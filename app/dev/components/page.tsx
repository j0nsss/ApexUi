"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { TextInput } from "@/components/ui/text-input";
import { Toggle } from "@/components/ui/toggle";
import { RangeSlider } from "@/components/ui/range-slider";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { ColorPickerSwatch } from "@/components/ui/color-picker-swatch";
import { FlatTab } from "@/components/ui/flat-tab";
import { IconButton } from "@/components/ui/icon-button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Maximize2 } from "lucide-react";

const TABS = [
  { label: "Code", value: "code" },
  { label: "Customize", value: "customize" },
];

const DROPDOWN_OPTIONS = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
  { label: "Option C", value: "c" },
];

const PALETTE = [
  "#A31D1D",
  "#1D3A8A",
  "#1D8A4A",
  "#8A6A1D",
  "#6B21A8",
  "#0D9488",
  "#F5F2EB",
  "#9A9BA0",
];

export default function DevComponentsPage() {
  const [toggleOn, setToggleOn] = useState(false);
  const [sliderVal, setSliderVal] = useState(48);
  const [dropdownVal, setDropdownVal] = useState("a");
  const [colorVal, setColorVal] = useState("#A31D1D");
  const [activeTab, setActiveTab] = useState("code");

  return (
    <div className="min-h-screen bg-base text-primary p-8">
      <h1 className="text-h1 mb-8">Component Library — Dev Preview</h1>

      <section className="mb-10">
        <h2 className="text-h2 mb-4">Button</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-h2 mb-4">Tag</h2>
        <div className="flex flex-wrap gap-2">
          <Tag label="Table" />
          <Tag label="Chart" variant="accent" />
          <Tag label="Navigation" />
          <Tag label="Bento" variant="accent" />
        </div>
      </section>

      <section className="mb-10 max-w-sm">
        <h2 className="text-h2 mb-4">TextInput</h2>
        <div className="flex flex-col gap-3">
          <TextInput placeholder="Placeholder text" />
          <TextInput label="With Label" placeholder="Enter value" />
          <TextInput label="Disabled" disabled value="Cannot edit" />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-h2 mb-4">Toggle</h2>
        <div className="flex flex-col gap-3">
          <Toggle checked={toggleOn} onChange={setToggleOn} label="Show details" />
          <Toggle checked={true} onChange={() => {}} label="Always on (disabled)" />
        </div>
      </section>

      <section className="mb-10 max-w-sm">
        <h2 className="text-h2 mb-4">RangeSlider</h2>
        <RangeSlider
          value={sliderVal}
          onChange={setSliderVal}
          min={36}
          max={72}
          step={4}
          label="Row Height (px)"
        />
      </section>

      <section className="mb-10 max-w-sm">
        <h2 className="text-h2 mb-4">SelectDropdown</h2>
        <SelectDropdown
          value={dropdownVal}
          onChange={setDropdownVal}
          options={DROPDOWN_OPTIONS}
          label="Variant"
        />
      </section>

      <section className="mb-10 max-w-sm">
        <h2 className="text-h2 mb-4">ColorPickerSwatch</h2>
        <ColorPickerSwatch
          value={colorVal}
          onChange={setColorVal}
          palette={PALETTE}
          label="Accent Color"
        />
      </section>

      <section className="mb-10">
        <h2 className="text-h2 mb-4">FlatTab / TabGroup</h2>
        <FlatTab tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        <div className="p-4 border border-t-0 border-default text-body text-secondary">
          {activeTab === "code" ? "Code panel content" : "Customize panel content"}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-h2 mb-4">IconButton</h2>
        <div className="flex flex-wrap gap-2 items-end">
          <IconButton icon={<Maximize2 />} label="Full screen" size={16} />
          <IconButton icon={<Maximize2 />} label="Full screen" size={20} />
          <IconButton icon={<Maximize2 />} label="Full screen" size={24} />
          <IconButton icon={<Maximize2 />} label="Disabled" disabled />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-h2 mb-4">Badge / CopyCount</h2>
        <div className="flex gap-2">
          <Badge count={42} />
          <Badge count={1500} max={999} />
          <Badge count={0} />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-h2 mb-4">EmptyState</h2>
        <EmptyState
          title="No components found"
          description="Try adjusting your search or filter criteria."
        />
      </section>

      <section className="mb-10">
        <h2 className="text-h2 mb-4">LoadingSpinner</h2>
        <div className="flex gap-3 items-center">
          <LoadingSpinner size={16} />
          <LoadingSpinner size={24} />
          <LoadingSpinner size={32} />
        </div>
      </section>
    </div>
  );
}
