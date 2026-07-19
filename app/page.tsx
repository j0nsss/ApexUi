import { GalleryClient } from "./gallery-client";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { ComponentMeta } from "@/components/ui/bento-cell";

export const revalidate = 60;

async function getComponents(): Promise<ComponentMeta[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("components")
    .select("id, slug, name, description, category, tags, bento_size, copy_count")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}

export default async function GalleryPage() {
  const components = await getComponents();

  return (
    <div className="min-h-screen bg-base">
      <header className="border-b border-default px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1">ApexUI</h1>
            <p className="text-body text-secondary mt-1">
              Design Vault — {components.length} components
            </p>
          </div>
        </div>
      </header>

      <GalleryClient components={components} />
    </div>
  );
}
