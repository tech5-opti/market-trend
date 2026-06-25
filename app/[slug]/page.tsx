import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPosts, getPostBySlug, formatDate } from "@/app/lib/blog-db";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return { title: post.title, description: post.description };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <Link href="/" className="text-sm text-muted transition-colors hover:text-foreground">
        ← Home
      </Link>
      <header className="mt-5 border-b border-border pb-8">
        <time className="text-xs uppercase tracking-wide text-muted">
          {formatDate(post.published_at)}
        </time>
        <h1 className="font-display mt-3 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
          {post.title}
        </h1>
        {post.description ? (
          <p className="mt-4 font-serif text-lg leading-relaxed text-muted">{post.description}</p>
        ) : null}
      </header>
      {post.image_url ? (
        <div className="mt-8 overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image_url} alt={post.title} className="w-full object-cover" />
        </div>
      ) : null}
      <div
        className="mt-8 font-serif text-lg leading-relaxed text-foreground [&_a]:text-[#1d6fa5] [&_a]:underline [&_h2]:font-display [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-4 [&_ul]:mt-4"
        dangerouslySetInnerHTML={{ __html: post.content_html }}
      />
    </main>
  );
}
