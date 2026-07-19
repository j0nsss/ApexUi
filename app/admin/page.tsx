import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { KpiCard } from "./kpi-card";

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

async function getKpis() {
  const supabase = getSupabaseAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [{ count: copyCount }, { count: pageviewCount }, { data: topComponent }] =
    await Promise.all([
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
    ]);

  return {
    copyCount: copyCount ?? 0,
    pageviewCount: pageviewCount ?? 0,
    topComponent: topComponent?.name ?? "—",
  };
}

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const isAuthenticated = await validateSession();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const kpis = await getKpis();

  return (
    <div className="min-h-screen bg-base">
      <header className="border-b border-default px-6 py-5">
        <h1 className="text-h1">Admin Dashboard</h1>
      </header>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard label="Total Copy Events (30d)" value={kpis.copyCount} />
        <KpiCard label="Total Page Views (30d)" value={kpis.pageviewCount} />
        <KpiCard label="Most Copied Component" value={kpis.topComponent} />
      </div>
    </div>
  );
}
