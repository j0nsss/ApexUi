import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const revalidate = 60;

export async function generateStaticParams() {
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("components")
    .select("slug")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(20);

  return (data ?? []).map((c) => ({ slug: c.slug }));
}

export default async function ComponentDetailPage({ params }: { params: { slug: string } }) {
  const supabase = getSupabaseAdmin();

  const { data: component } = await supabase
    .from("components")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!component) {
    return <div className="p-8 text-secondary">Component not found</div>;
  }

  return (
    <div className="min-h-screen bg-base">
      <div className="p-6 border-b border-default">
        <h1 className="text-h1">{component.name}</h1>
        <p className="text-body text-secondary mt-1">{component.category}</p>
      </div>
      <div className="p-6">
        <p className="text-secondary">Detail view — Phase 4 implementation.</p>
      </div>
    </div>
  );
}
