# The People of India

Independent, non-profit, open-source journalism. On-ground reporting of what's
really happening to real people in India - neither left nor right, never for
sale.

> "This should not stop here. I will not stop here. You should not stop here."

## What this is

- **For the People** - the editorial desk. Only admins publish. Readers react
  (no comments).
- **By the People** - open ground reports. Any signed-in user publishes
  instantly under their real Google name. Full real-time comments, reactions
  on posts and comments.
- **Reactions are two distinct signals**: Heart (*agree*) and **Disagree**
  (*"I dispute this" - explicitly not a dislike*). Post health is shown as a
  live agree/disagree ratio meter, never a raw disagree count.
- **Community auto-moderation** (By the People only): a post with **≥ 15 total
  reactions** where **≥ 70% are disagrees** is auto-hidden into the admin
  review queue. Never hard-deleted automatically. Enforced in Firestore rules,
  not just the client.
- **Admin panel** at `/admin`, gated by the Firebase custom claim
  `admin: true` and enforced server-side in `firestore.rules`: editorial desk
  (Tiptap editor with image/video), review queue (restore / permanently
  delete), delete-anything override, reports queue, and an email blocklist.

**Stack**: Next.js (App Router, TypeScript) · Firebase (Auth - Google only,
Firestore, Storage) · Tailwind CSS · Framer Motion · Tiptap. Deploys to Vercel.

---

## 1. Firebase setup (console)

1. Go to <https://console.firebase.google.com> → **Add project** (e.g.
   `thepeopleofindia`). Analytics optional - not used.

2. **Enable Google sign-in**
   - Build → **Authentication** → *Get started*.
   - *Sign-in method* tab → **Google** → Enable → pick a support email → Save.
   - (Google is the **only** provider - do not enable email/password.)

3. **Create Firestore**
   - Build → **Firestore Database** → *Create database*.
   - Choose a location (e.g. `asia-south1` for India) → start in
     **production mode** (our rules replace the defaults anyway).

4. **Create a Storage bucket**
   - Build → **Storage** → *Get started* → production mode → same region.

5. **Register a Web app**
   - Project settings (gear) → *Your apps* → **Web** (`</>`) → register.
   - Copy the config values into `.env.local` (see below).

## 2. Local setup

```bash
git clone <your-fork>
cd thepeopleofindia
npm install
cp .env.local.example .env.local   # paste your Firebase web config values
npm run dev                        # http://localhost:3000
```

## 3. Media hosting - Cloudinary (free, no billing)

Firebase Storage now requires a billing account, so v1 uploads images and
videos to **Cloudinary's free tier** instead (25 GB, no card needed):

1. Sign up at <https://cloudinary.com> (free plan).
2. Dashboard → **Settings → Upload → Upload presets → Add upload preset**.
   - **Signing mode: Unsigned** (required - uploads come from the browser).
   - Optionally restrict allowed formats to images + video.
3. Copy your **cloud name** (dashboard home) and the **preset name** into
   `.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxxx
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=xxxx
   ```

When you later upgrade Firebase to the Blaze plan, `storage.rules` is already
written - swap `src/lib/upload.ts` back to `firebase/storage`.

## 3b. Deploy the security rules

The rules are the actual security boundary - deploy them before inviting
anyone. **The console `permission-denied` errors you see on a fresh project
disappear after this step** - a production-mode Firestore denies everything
until these rules replace the defaults.

```bash
npm install -g firebase-tools
firebase login
firebase use --add          # select your project
firebase deploy --only firestore
```

This ships `firestore.rules` and `firestore.indexes.json` (composite indexes
the feeds need). Skip the `storage` target until you enable Firebase Storage.

## 4. Assign the first admin

The admin claim can only be set with the Admin SDK - that's the point.

1. **Sign in to the site once** with the Google account that should be admin.
2. Firebase Console → Project settings → **Service accounts** →
   *Generate new private key* → save as
   `firebase-admin-scripts/serviceAccountKey.json` (git-ignored, never commit).
3. ```bash
   cd firebase-admin-scripts
   npm install
   node assignRole.js you@gmail.com
   ```
4. Sign out and back in on the site - `/admin` is now yours.
   (Revoke later with `node assignRole.js you@gmail.com --revoke`.)

## 5. Deploy to Vercel

1. Push the repo to GitHub.
2. <https://vercel.com> → **New Project** → import the repo (Next.js is
   auto-detected).
3. Add every `NEXT_PUBLIC_*` variable from `.env.local` (Firebase +
   Cloudinary) under *Settings → Environment Variables*.
4. Deploy.
5. **Authorize the domain for sign-in**: Firebase Console → Authentication →
   *Settings* → **Authorized domains** → add `your-app.vercel.app` (and your
   custom domain).

## Data model

```
posts/{postId}            zone: 'for'|'by' · title · content (HTML) · author*
                          hearts · disagrees · commentCount
                          status: 'live'|'hidden' · autoHidden?
  reactions/{uid}         { type: 'heart'|'disagree' }
  comments/{commentId}    author* · text · hearts · disagrees
    reactions/{uid}       { type }
reports/{reportId}        postId · reason · reporter* · status: 'open'|'resolved'
blocked/{email}           existence of the doc = blocked (checked in rules)
users/{uid}               name · email · photoURL · lastSeen
```

## Security model (summary)

| Actor | Can |
|---|---|
| Guest | Read live posts and comments. Nothing else. |
| Signed-in (non-blocked) | Publish By-the-People posts, comment, react. Counter-only updates on others' docs; the sole status change allowed is the community auto-hide, validated by threshold in rules. |
| Blocked (email in `/blocked`) | Read only - every write path re-checks the blocklist server-side. |
| Admin (`admin: true` claim) | Everything: For-the-People editorial, hide/restore, delete anything, reports, blocklist. |

Server-side rate limiting is intentionally deferred; the hook points are
commented in `src/lib/reactions.ts` and `firestore.rules`.

## License

Open source under **AGPL-3.0** - for the people, by the people. Forks must
stay open. This platform is not for sale, to anyone, ever.
# The-People-Of-India
# The-People-Of-India
