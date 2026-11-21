import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article } from "@/components/kv/Article";
import { getPost } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/research/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p || p.kind !== "research") return { title: "Publication not found" };
  return { title: p.title, description: p.excerpt, alternates: { canonical: `/research/${p.slug}` }, openGraph: { type: "article" } };
}

export default async function ResearchPostPage({ params }: PageProps<"/research/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || post.kind !== "research") notFound();
  return <Article post={post} back={{ href: "/research", label: "Research" }} />;
}
