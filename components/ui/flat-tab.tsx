"use client";

interface FlatTabItem {
  label: string;
  value: string;
}

interface TabGroupProps {
  tabs: FlatTabItem[];
  activeTab: string;
  onChange: (value: string) => void;
}

const FlatTab = ({ tabs, activeTab, onChange }: TabGroupProps) => {
  return (
    <div className="flex border-b border-default">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 text-body border border-transparent border-b-0 transition-colors duration-75 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-[-2px] ${
            activeTab === tab.value
              ? "text-primary border-default border-b-2 border-b-accent"
              : "text-secondary hover:text-primary"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export { FlatTab };
export type { FlatTabItem, TabGroupProps };
