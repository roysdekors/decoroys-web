import KategoriClient from "./KategoriClient";

const SLUG_TO_CATEGORY: Record<string, string> = {
  "tv-uniteleri": "TV Üniteleri",
  "kahve-dolaplari": "Kahve Dolapları",
  "tv-panelleri": "Tv Panelleri",
};

export default async function KategoriPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoryName = SLUG_TO_CATEGORY[slug] ?? slug;

  return <KategoriClient slug={slug} categoryName={categoryName} />;
}
