export type CustomizerParam = {
  key: string;
  label: string;
  type: "range_slider" | "color_picker" | "toggle_switch" | "select_dropdown" | "text_input";
  default: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  palette?: string[];
  options?: { label: string; value: string }[];
};

export type CustomizerSchema = {
  params: CustomizerParam[];
};

export type RandomDataSchema = Record<string, unknown>;

export type BentoSize = "1x1" | "2x1" | "2x2";

export type ComponentMeta = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  tags: string[];
  bento_size: BentoSize;
  copy_count: number;
};

export type ComponentFull = ComponentMeta & {
  is_published: boolean;
  sort_order: number | null;
  customizer_schema: CustomizerSchema | null;
  random_data_schema: RandomDataSchema | null;
  created_at: string;
  updated_at: string;
};

export type CodeVariant = {
  language: string;
  code_template: string;
  display_order: number;
};
