function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function randomInt(min: number, max: number, seed: number): number {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
}

function pickFrom<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

type ColumnDef = { name: string; type: "string" | "number" | "date" };
type Row = Record<string, string | number>;

function generateTableData(
  schema: { columns: ColumnDef[]; row_count: { min: number; max: number } },
  seed = Date.now(),
): Row[] {
  const count = randomInt(schema.row_count.min, schema.row_count.max, seed);

  const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Hank"];
  const lastNames = ["Smith", "Johnson", "Brown", "Lee", "Garcia", "Martinez", "Davis"];
  const domains = ["acme.com", "example.org", "test.io", "demo.net"];
  const roles = ["Admin", "Editor", "Viewer", "Contributor", "Manager"];
  const statuses = ["Active", "Inactive", "Pending"];
  const items = ["Widget A", "Widget B", "Gadget X", "Gadget Y", "Tool Z", "Module Q"];
  const categories = ["Electronics", "Hardware", "Software", "Accessories"];
  const ids = Array.from({ length: count }, (_, i) => `ID-${String(i + 1).padStart(3, "0")}`);

  const rows: Row[] = [];

  for (let i = 0; i < count; i++) {
    const s = seed + i;
    const row: Row = {};

    for (const col of schema.columns) {
      if (col.type === "string") {
        const nameLower = col.name.toLowerCase();
        if (nameLower.includes("name")) {
          row[col.name] = `${pickFrom(firstNames, s)} ${pickFrom(lastNames, s + 1)}`;
        } else if (nameLower.includes("email")) {
          const fn = pickFrom(firstNames, s).toLowerCase();
          const ln = pickFrom(lastNames, s + 1).toLowerCase();
          row[col.name] = `${fn}.${ln}@${pickFrom(domains, s + 2)}`;
        } else if (nameLower.includes("role")) {
          row[col.name] = pickFrom(roles, s);
        } else if (nameLower.includes("status")) {
          row[col.name] = pickFrom(statuses, s);
        } else if (nameLower.includes("item") || nameLower.includes("product")) {
          row[col.name] = pickFrom(items, s);
        } else if (nameLower.includes("category")) {
          row[col.name] = pickFrom(categories, s);
        } else if (nameLower.includes("id")) {
          row[col.name] = ids[i];
        } else {
          row[col.name] = pickFrom(firstNames, s);
        }
      } else if (col.type === "number") {
        row[col.name] = randomInt(10, 1000, s);
      } else if (col.type === "date") {
        const d = new Date();
        d.setDate(d.getDate() - randomInt(0, 30, s));
        row[col.name] = d.toISOString().split("T")[0];
      }
    }

    rows.push(row);
  }

  return rows;
}

type DataPoint = { label: string; value: number };

function generateChartData(
  schema: {
    data_type?: "time_series" | "categorical";
    points?: { min: number; max: number };
    value_range?: { min: number; max: number };
    variance?: number;
    categories?: { min: number; max: number };
  },
  seed = Date.now(),
): DataPoint[] {
  if (schema.data_type === "categorical") {
    const catCount = schema.categories
      ? randomInt(schema.categories.min, schema.categories.max, seed)
      : 6;
    const labels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    return Array.from({ length: catCount }, (_, i) => ({
      label: labels[i] ?? `S-${i + 1}`,
      value: randomInt(schema.value_range?.min ?? 5, schema.value_range?.max ?? 100, seed + i),
    }));
  }

  const pointCount = schema.points ? randomInt(schema.points.min, schema.points.max, seed) : 12;
  const variance = schema.variance ?? 15;
  let prev = randomInt(schema.value_range?.min ?? 10, schema.value_range?.max ?? 100, seed);

  return Array.from({ length: pointCount }, (_, i) => {
    const step = seededRandom(seed + i) * variance * 2 - variance;
    prev = Math.max(schema.value_range?.min ?? 0, prev + step);
    prev = Math.min(schema.value_range?.max ?? 100, prev);

    return {
      label: `T${i + 1}`,
      value: Math.round(prev * 10) / 10,
    };
  });
}

export { generateTableData, generateChartData };
export type { Row, DataPoint, ColumnDef };
