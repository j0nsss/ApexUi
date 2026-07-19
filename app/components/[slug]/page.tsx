import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { DetailShell } from "../detail-shell";

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

async function getComponent(slug: string) {
  const supabase = getSupabaseAdmin();

  const [compResult, navResult] = await Promise.all([
    supabase.from("components").select("*").eq("slug", slug).single(),
    supabase
      .from("components")
      .select("slug, name, category")
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),
  ]);

  if (compResult.error || !compResult.data) return null;

  const { data: codeVariants } = await supabase
    .from("code_variants")
    .select("language, code_template, display_order")
    .eq("component_id", compResult.data.id)
    .order("display_order", { ascending: true });

  return {
    component: compResult.data,
    codeVariants: codeVariants ?? [],
    allComponents: navResult.data ?? [],
  };
}

export default async function ComponentDetailPage({ params }: { params: { slug: string } }) {
  const data = await getComponent(params.slug);

  if (!data) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="text-secondary">Component not found</p>
      </div>
    );
  }

  return (
    <DetailShell
      component={data.component}
      codeVariants={data.codeVariants}
      allComponents={data.allComponents}
    />
  );
}
