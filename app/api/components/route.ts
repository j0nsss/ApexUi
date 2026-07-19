import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const revalidate = 60;

export async function GET() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("components")
    .select("id, slug, name, description, category, tags, bento_size, copy_count, sort_order")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
