import PostView from "@/components/PostView";

export default async function ByPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PostView id={id} zone="by" />;
}
