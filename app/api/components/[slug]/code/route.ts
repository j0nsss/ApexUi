import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const supabase = getSupabaseAdmin();

  const { data: component, error: compError } = await supabase
    .from("components")
    .select("id")
    .eq("slug", params.slug)
    .single();

  if (compError || !component) {
    return NextResponse.json({ error: "Component not found" }, { status: 404 });
  }

  const { data: variants, error: varError } = await supabase
    .from("code_variants")
    .select("language, code_template, display_order")
    .eq("component_id", component.id)
    .order("display_order", { ascending: true });

  if (varError) {
    return NextResponse.json({ error: varError.message }, { status: 500 });
  }

  return NextResponse.json(variants, {
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
