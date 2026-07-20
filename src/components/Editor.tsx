"use client";

// Shared Tiptap rich-text editor: used by the full-bleed field composer
// (/write) and the admin editorial desk. Supports images, video AND voice -
// media can be pasted, picked, or drag-and-dropped anywhere onto the canvas;
// a report can be spoken instead of typed (dictation via the Web Speech API)
// or recorded as an audio block (MediaRecorder → Cloudinary → <audio>).
import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor as TiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { Node as TiptapNode, mergeAttributes } from "@tiptap/react";
import { AnimatePresence, motion } from "framer-motion";
import { isSupportedMedia, uploadMedia } from "@/lib/upload";
import { useAuth } from "@/lib/AuthContext";

// Minimal inline <video> node so uploaded videos embed natively.
const Video = TiptapNode.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return { src: { default: null } };
  },
  parseHTML() {
    return [{ tag: "video" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, { controls: "true", playsinline: "true" }),
    ];
  },
});

// Audio block - a spoken report embeds as a native player.
const Audio = TiptapNode.create({
  name: "audio",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return { src: { default: null } };
  },
  parseHTML() {
    return [{ tag: "audio" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["audio", mergeAttributes(HTMLAttributes, { controls: "true" })];
  },
});

// Minimal typing for the (still-prefixed) Web Speech API.
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: {
    resultIndex: number;
    results: { length: number; [i: number]: { isFinal: boolean; 0: { transcript: string } } };
  }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

function getSpeechRecognition(): SpeechRecognitionLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, new () => SpeechRecognitionLike>;
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

interface Props {
  onReady?: (editor: TiptapEditor) => void;
  placeholder?: string;
  initialContent?: string;
  /** True when rendered inside the full-screen composer (no site navbar above). */
  overlay?: boolean;
}

export default function Editor({
  onReady,
  placeholder,
  initialContent,
  overlay,
}: Props) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [recording, setRecording] = useState(false);
  const [dictating, setDictating] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  // Stop mic/recognition if the composer unmounts mid-session.
  useEffect(() => {
    return () => {
      recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
      recognitionRef.current?.stop();
    };
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: false }),
      Video,
      Audio,
      Link.configure({ openOnClick: false }),
      Youtube.configure({ width: 720, height: 405 }),
      Placeholder.configure({
        placeholder: placeholder ?? "Report what you saw…",
      }),
    ],
    content: initialContent ?? "",
    editorProps: {
      attributes: { class: "tiptap prose-tpi" },
    },
    onCreate: ({ editor }) => onReady?.(editor),
  });

  const insertFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!editor || !user) return;
      for (const file of Array.from(files)) {
        if (!isSupportedMedia(file)) continue;
        setUploading((n) => n + 1);
        try {
          const url = await uploadMedia(file, user.uid);
          if (file.type.startsWith("image/")) {
            editor.chain().focus().setImage({ src: url }).run();
          } else {
            const type = file.type.startsWith("audio/") ? "audio" : "video";
            editor.chain().focus().insertContent({ type, attrs: { src: url } }).run();
          }
        } catch (e) {
          console.error("Upload failed:", e);
          alert(e instanceof Error ? e.message : "Upload failed.");
        } finally {
          setUploading((n) => n - 1);
        }
      }
    },
    [editor, user]
  );

  // Record a voice note → upload → embed as an audio block.
  const toggleRecording = async () => {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        const ext = mimeType.includes("webm") ? "webm" : "m4a";
        const file = new File(chunks, `voice-note.${ext}`, { type: mimeType });
        if (file.size > 0) insertFiles([file]);
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      alert("Microphone access was denied or is unavailable.");
    }
  };

  // Dictation: speech-to-text straight into the editor at the cursor.
  const toggleDictation = () => {
    if (dictating) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = getSpeechRecognition();
    if (!recognition) {
      alert(
        "Voice typing isn't supported in this browser. Chrome and Edge support it - or use ● Rec to attach your voice as audio."
      );
      return;
    }
    recognition.lang = "en-IN"; // Indian English; Hindi speakers can still Rec audio
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal && editor) {
          editor.chain().focus().insertContent(result[0].transcript + " ").run();
        }
      }
    };
    recognition.onend = () => setDictating(false);
    recognition.onerror = () => setDictating(false);
    recognitionRef.current = recognition;
    recognition.start();
    setDictating(true);
  };

  if (!editor) return null;

  const Btn = ({
    active,
    onClick,
    children,
    title,
  }: {
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1 text-sm transition ${
        active ? "bg-saffron/15 text-saffron" : "text-paper-dim hover:bg-elevate hover:text-paper"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div
      className="relative"
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files.length) insertFiles(e.dataTransfer.files);
      }}
    >
      {/* Toolbar */}
      <div
        className={`sticky z-10 mb-6 flex flex-wrap items-center gap-1 rounded-xl glass px-2 py-1.5 ${
          overlay ? "top-4" : "top-16"
        }`}
      >
        <Btn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </Btn>
        <Btn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </Btn>
        <Btn
          title="Heading"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Btn>
        <Btn
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          ❝
        </Btn>
        <Btn
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          ••
        </Btn>
        <Btn
          title="Link"
          active={editor.isActive("link")}
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
            else editor.chain().focus().unsetLink().run();
          }}
        >
          ⛓
        </Btn>
        <Btn
          title="Embed YouTube video"
          onClick={() => {
            const url = window.prompt("YouTube URL");
            if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
          }}
        >
          ▶
        </Btn>
        <Btn
          title="Upload image, video, or audio"
          onClick={() => fileInput.current?.click()}
        >
          ⇪ Media
        </Btn>

        <span className="mx-1 h-4 w-px bg-line" aria-hidden />

        {/* Voice: speak instead of typing, or attach your voice itself */}
        <button
          type="button"
          title={
            dictating
              ? "Stop voice typing"
              : "Voice typing - speak and your words appear as text"
          }
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleDictation}
          className={`rounded-lg px-2.5 py-1 text-sm transition ${
            dictating
              ? "bg-saffron/20 text-saffron"
              : "text-paper-dim hover:bg-elevate hover:text-paper"
          }`}
        >
          {dictating ? "◼ Listening…" : "🎙 Speak"}
        </button>
        <button
          type="button"
          title={
            recording
              ? "Stop and attach the recording"
              : "Record a voice note - attaches as playable audio"
          }
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleRecording}
          className={`rounded-lg px-2.5 py-1 text-sm transition ${
            recording
              ? "bg-red-500/15 text-red-400"
              : "text-paper-dim hover:bg-elevate hover:text-paper"
          }`}
        >
          {recording ? (
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
              Stop
            </span>
          ) : (
            "● Rec"
          )}
        </button>

        <input
          ref={fileInput}
          type="file"
          accept="image/*,video/*,audio/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) insertFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {uploading > 0 && (
          <span className="ml-auto flex items-center gap-2 pr-2 text-xs text-saffron">
            <span className="h-2 w-2 animate-ping rounded-full bg-saffron" />
            uploading…
          </span>
        )}
      </div>

      <EditorContent editor={editor} />

      {/* Upload placeholder shimmer strip */}
      {uploading > 0 && (
        <div className="upload-shimmer mt-4 h-40 rounded-xl" aria-hidden />
      )}

      {/* Drag-over veil */}
      <AnimatePresence>
        {dragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-2xl border-2 border-dashed border-saffron/70 bg-ink/70 backdrop-blur-sm"
          >
            <p className="font-display text-xl text-saffron">
              Drop image or video anywhere
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
