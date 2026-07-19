import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("components")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Component not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
