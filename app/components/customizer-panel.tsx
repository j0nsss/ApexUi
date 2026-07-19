"use client";

import { useEffect } from "react";
import { useCustomizerStore } from "@/lib/store";
import type { CustomizerSchema } from "@/lib/types";
import { RangeSlider } from "@/components/ui/range-slider";
import { ColorPickerSwatch } from "@/components/ui/color-picker-swatch";
import { Toggle } from "@/components/ui/toggle";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { TextInput } from "@/components/ui/text-input";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface CustomizerPanelProps {
  schema: CustomizerSchema;
  slug: string;
}

function parseSearchParams(
  searchParams: URLSearchParams,
  schema: CustomizerSchema,
): Record<string, string | number | boolean> | undefined {
  const overrides: Record<string, string | number | boolean> = {};
  let hasOverride = false;

  for (const param of schema.params) {
    const raw = searchParams.get(param.key);
    if (raw === null) continue;

    hasOverride = true;
    if (param.type === "toggle_switch") {
      overrides[param.key] = raw === "true";
    } else if (param.type === "range_slider") {
      overrides[param.key] = Number(raw);
    } else {
      overrides[param.key] = raw;
    }
  }

  return hasOverride ? overrides : undefined;
}

function buildDefaults(schema: CustomizerSchema): Record<string, string | number | boolean> {
  const defaults: Record<string, string | number | boolean> = {};
  for (const param of schema.params) {
    defaults[param.key] = param.default;
  }
  return defaults;
}

function buildQueryString(params: Record<string, string | number | boolean>): string {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    q.set(key, String(value));
  }
  return q.toString();
}

function CustomizerPanel({ schema, slug }: CustomizerPanelProps) {
  const { params, initParams, setParam, resetParams } = useCustomizerStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const defaults = buildDefaults(schema);
    const overrides = parseSearchParams(searchParams, schema);
    initParams(defaults, overrides);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleChange = (key: string, value: string | number | boolean) => {
    setParam(key, value);

    const updated = { ...params, [key]: value };
    const qs = buildQueryString(updated);
    router.replace(`${pathname}?${qs}`, { scroll: false });
  };

  const handleReset = () => {
    const defaults = buildDefaults(schema);
    resetParams(defaults);
    const qs = buildQueryString(defaults);
    router.replace(`${pathname}?${qs}`, { scroll: false });
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-default">
        <p className="text-label text-primary">Customize</p>
        <button
          onClick={handleReset}
          className="px-2 py-1 text-small border border-default text-secondary hover:text-primary hover:border-accent transition-colors duration-75"
        >
          Reset Defaults
        </button>
      </div>

      <div className="flex-1 p-4 space-y-5">
        {schema.params.map((param) => (
          <div key={param.key}>
            <label
              id={`label-${param.key}`}
              htmlFor={param.key === "toggle_switch" ? undefined : `ctrl-${param.key}`}
              className="block text-label text-secondary mb-1.5"
            >
              {param.label}
            </label>
            <div role="group" aria-labelledby={`label-${param.key}`}>
              {param.type === "range_slider" && (
                <RangeSlider
                  min={param.min ?? 0}
                  max={param.max ?? 100}
                  step={param.step ?? 1}
                  value={(params[param.key] as number) ?? (param.default as number)}
                  onChange={(val) => handleChange(param.key, val)}
                />
              )}
              {param.type === "color_picker" && (
                <ColorPickerSwatch
                  palette={param.palette ?? ["#A31D1D", "#F5F2EB", "#262930"]}
                  value={(params[param.key] as string) ?? (param.default as string)}
                  onChange={(val) => handleChange(param.key, val)}
                />
              )}
              {param.type === "toggle_switch" && (
                <div className="flex items-center gap-2">
                  <Toggle
                    checked={(params[param.key] as boolean) ?? (param.default as boolean)}
                    onChange={(val) => handleChange(param.key, val)}
                  />
                  <span className="text-small text-secondary">
                    {((params[param.key] as boolean) ?? (param.default as boolean)) ? "On" : "Off"}
                  </span>
                </div>
              )}
              {param.type === "select_dropdown" && (
                <SelectDropdown
                  options={param.options ?? []}
                  value={(params[param.key] as string) ?? (param.default as string)}
                  onChange={(val) => handleChange(param.key, val)}
                />
              )}
              {param.type === "text_input" && (
                <TextInput
                  value={(params[param.key] as string) ?? (param.default as string)}
                  onChange={(e) => handleChange(param.key, e.target.value)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { CustomizerPanel };
