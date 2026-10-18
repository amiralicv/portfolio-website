import { createFileRoute } from "@tanstack/react-router";
import { PostsPage } from "@/components/Posts";

export const Route = createFileRoute("/writing/")({
  head: () => ({ meta: [{ title: "Writing | Amirali Abbasi" }] }),
  component: PostsPage,
});
