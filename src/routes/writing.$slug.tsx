import { createFileRoute, notFound } from "@tanstack/react-router";
import { PostPage } from "@/components/Posts";
import { getMeta } from "@/lib/content";

export const Route = createFileRoute("/writing/$slug")({
  loader: ({ params }) => {
    const meta = getMeta(params.slug);
    if (!meta) throw notFound();
    return meta;
  },
  head: ({ loaderData: m }) => ({
    meta: [
      { title: `${m?.title} | Amirali Abbasi` },
      { name: "description", content: m?.description },
      { property: "og:title", content: m?.title },
      { property: "og:description", content: m?.description },
      { property: "og:type", content: "article" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PostPage slug={Route.useParams().slug} />;
}
