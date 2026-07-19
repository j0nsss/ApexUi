import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();

  let body: { component_id?: string; route?: string; session_id?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { component_id, route, session_id } = body;

  if (!session_id) {
    return NextResponse.json({ error: "Missing required field: session_id" }, { status: 400 });
  }

  const { error: insertError } = await supabase.from("analytics_events").insert({
    event_type: "page_view",
    component_id: component_id || null,
    route: route || null,
    session_id,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
