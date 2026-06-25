import Link from "next/link";
import { getPosts, formatDate } from "@/app/lib/blog-db";

/** Latest published blogs (from the shared DB) shown at the top of the homepage.
 *  Rendered inside the homepage's max-w-6xl container, so no own width wrapper. */
export default async function LatestFromBlog() {
  const posts = (await getPosts()).slice(0, 4);
  if (posts.length === 0) return null;
  return (
    <section className="pt-8">
      <h2 className="font-display border-b border-border pb-3 text-2xl font-bold text-foreground">
        Latest
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((p) => (
          <Link key={p.id} href={`/${p.slug}`} className="group block">
            {p.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.image_url}
                alt={p.title}
                className="mb-3 aspect-[16/10] w-full rounded-lg object-cover"
              />
            ) : null}
            <p className="text-xs uppercase tracking-wide text-muted">
              {formatDate(p.published_at)}
            </p>
            <h3 className="font-display mt-1 text-lg font-bold leading-snug text-foreground group-hover:text-[#1d6fa5]">
              {p.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
