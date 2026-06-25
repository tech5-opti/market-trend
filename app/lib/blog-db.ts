import { neon } from "@neondatabase/serverless";

// Which satellite site this app represents (matches BlogPost.site in Signalor).
const SITE = "market_trends";

export interface BlogRow {
  id: number;
  slug: string;
  title: string;
  description: string;
  content_html: string;
  image_url: string;
  category: string;
  brand_url: string;
  published_at: string | null;
}

function db() {
  const url = process.env.BLOG_DATABASE_URL;
  if (!url) throw new Error("BLOG_DATABASE_URL is not set");
  return neon(url);
}

/** Published posts for this site, newest first. Read-only; Signalor writes them. */
export async function getPosts(): Promise<BlogRow[]> {
  try {
    const sql = db();
    const rows = await sql`
      SELECT id, slug, title, description, content_html, image_url, category, brand_url, published_at
      FROM analyzer_blogpost
      WHERE site = ${SITE} AND status = 'published'
      ORDER BY published_at DESC NULLS LAST, created_at DESC
    `;
    return rows as BlogRow[];
  } catch (e) {
    console.error("[blog-db] getPosts failed:", e);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogRow | null> {
  try {
    const sql = db();
    const rows = await sql`
      SELECT id, slug, title, description, content_html, image_url, category, brand_url, published_at
      FROM analyzer_blogpost
      WHERE site = ${SITE} AND slug = ${slug} AND status = 'published'
      LIMIT 1
    `;
    return (rows[0] as BlogRow) ?? null;
  } catch (e) {
    console.error("[blog-db] getPostBySlug failed:", e);
    return null;
  }
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
