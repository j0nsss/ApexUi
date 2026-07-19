import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();

  let body: { component_id?: string; language?: string; session_id?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { component_id, language, session_id } = body;

  if (!component_id || !language || !session_id) {
    return NextResponse.json(
      { error: "Missing required fields: component_id, language, session_id" },
      { status: 400 },
    );
  }

  const { error: insertError } = await supabase.from("analytics_events").insert({
    event_type: "copy",
    component_id,
    language,
    session_id,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const { error: updateError } = await supabase.rpc("increment_copy_count", {
    comp_id: component_id,
  });

  if (updateError) {
    console.error("Failed to increment copy_count:", updateError);
  }

  return NextResponse.json({ ok: true });
}
