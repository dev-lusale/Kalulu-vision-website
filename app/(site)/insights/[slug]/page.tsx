import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article } from "@/components/kv/Article";
import { getPost, getPosts } from "@/lib/content";

export const revalidate = 86400; // admin edits refresh pages instantly via revalidatePath

/** Pre-build published articles; new ones are built on first visit and then cached. */
export async function generateStaticParams() {
  return (await getPosts("insights")).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p || p.kind === "research") return { title: "Article not found" };
  return {
    title: p.title, description: p.excerpt, alternates: { canonical: `/insights/${p.slug}` },
    openGraph: { type: "article", publishedTime: p.publishedAt ?? undefined, images: p.coverUrl ? [p.coverUrl] : undefined },
  };
}

export default async function InsightPage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || post.kind === "research") notFound();
  return <Article post={post} back={{ href: "/insights", label: "Insights" }} />;
}
