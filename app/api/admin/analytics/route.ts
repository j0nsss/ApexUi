import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ error: "from and to params required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const toDate = new Date(to);
  toDate.setDate(toDate.getDate() + 1);

  const [{ count: copyCount }, { count: pageviewCount }, { data: topComponent }] =
    await Promise.all([
      supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "copy")
        .gte("created_at", from)
        .lte("created_at", toDate.toISOString()),
      supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "page_view")
        .gte("created_at", from)
        .lte("created_at", toDate.toISOString()),
      supabase
        .from("components")
        .select("name")
        .order("copy_count", { ascending: false })
        .limit(1)
        .single(),
    ]);

  const [{ data: copyRows }, { data: routeRows }, { data: categoryRows }] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("created_at")
      .eq("event_type", "copy")
      .gte("created_at", from)
      .lte("created_at", toDate.toISOString())
      .order("created_at", { ascending: true }),
    supabase
      .from("analytics_events")
      .select("route")
      .eq("event_type", "page_view")
      .gte("created_at", from)
      .lte("created_at", toDate.toISOString()),
    supabase
      .from("analytics_events")
      .select("component_slug")
      .eq("event_type", "copy")
      .gte("created_at", from)
      .lte("created_at", toDate.toISOString()),
  ]);

  const dailyMap = new Map<string, number>();
  for (const row of copyRows ?? []) {
    const day = new Date(row.created_at).toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
  }
  const dailyChartData = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([event_date, copy_count]) => ({ event_date, copy_count }));

  const routeMap = new Map<string, number>();
  for (const row of routeRows ?? []) {
    const route = row.route ?? "/unknown";
    routeMap.set(route, (routeMap.get(route) ?? 0) + 1);
  }
  const routeChartData = Array.from(routeMap.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([route, count]) => ({ route, count }));

  const catMap = new Map<string, number>();
  for (const row of categoryRows ?? []) {
    const slug = row.component_slug ?? "unknown";
    const firstPart = slug.split("-")[0] ?? "other";
    catMap.set(firstPart, (catMap.get(firstPart) ?? 0) + 1);
  }
  const categoryChartData = Array.from(catMap.entries()).map(([name, value]) => ({ name, value }));

  return NextResponse.json({
    copyCount: copyCount ?? 0,
    pageviewCount: pageviewCount ?? 0,
    topComponent: topComponent?.name ?? "—",
    dailyChartData,
    topComponentsData: [],
    routeChartData,
    categoryChartData,
  });
}
