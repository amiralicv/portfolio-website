import { createFileRoute } from "@tanstack/react-router";
import { PostsPage } from "@/components/Posts";

const DESCRIPTION = "Notes on backend development, AI and computer vision.";

export const Route = createFileRoute("/writing/")({
  head: () => ({
    meta: [
      { title: "Writing | Amirali Abbasi" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Writing | Amirali Abbasi" },
      { property: "og:description", content: DESCRIPTION },
      { name: "twitter:title", content: "Writing | Amirali Abbasi" },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: PostsPage,
});
