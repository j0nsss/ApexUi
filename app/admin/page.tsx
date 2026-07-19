import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { AdminClient } from "./admin-client";

export const dynamic = "force-dynamic";

async function validateSession(): Promise<boolean> {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
}

async function getInitialData() {
  const supabase = getSupabaseAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    { count: copyCount },
    { count: pageviewCount },
    { data: topComponent },
    { data: dailyCopyData },
    { data: topComponentsData },
    { data: routeData },
    { data: categoryData },
  ] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "copy")
      .gte("created_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "page_view")
      .gte("created_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("components")
      .select("name")
      .order("copy_count", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("analytics_events")
      .select("created_at")
      .eq("event_type", "copy")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true }),
    supabase.from("vw_top_components").select("*"),
    supabase
      .from("analytics_events")
      .select("route")
      .eq("event_type", "page_view")
      .gte("created_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("analytics_events")
      .select("component_slug")
      .eq("event_type", "copy")
      .gte("created_at", thirtyDaysAgo.toISOString()),
  ]);

  const dailyMap = new Map<string, number>();
  for (const row of dailyCopyData ?? []) {
    const day = new Date(row.created_at).toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
  }
  const dailyChartData = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([event_date, copy_count]) => ({ event_date, copy_count }));

  const routeMap = new Map<string, number>();
  for (const row of routeData ?? []) {
    const route = row.route ?? "/unknown";
    routeMap.set(route, (routeMap.get(route) ?? 0) + 1);
  }
  const routeChartData = Array.from(routeMap.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([route, count]) => ({ route, count }));

  const catMap = new Map<string, number>();
  for (const row of categoryData ?? []) {
    const slug = row.component_slug ?? "unknown";
    const firstPart = slug.split("-")[0] ?? "other";
    catMap.set(firstPart, (catMap.get(firstPart) ?? 0) + 1);
  }
  const categoryChartData = Array.from(catMap.entries()).map(([name, value]) => ({ name, value }));

  return {
    copyCount: copyCount ?? 0,
    pageviewCount: pageviewCount ?? 0,
    topComponent: topComponent?.name ?? "—",
    dailyChartData,
    topComponentsData: (topComponentsData ?? []) as {
      component_slug: string;
      copy_count: number;
      language: string;
    }[],
    routeChartData,
    categoryChartData,
  };
}

export default async function AdminDashboardPage() {
  const isAuthenticated = await validateSession();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const initialData = await getInitialData();

  return (
    <div className="min-h-screen bg-base">
      <header className="border-b border-default px-6 py-5">
        <h1 className="text-h1">Admin Dashboard</h1>
      </header>
      <AdminClient initialData={initialData} />
    </div>
  );
}
