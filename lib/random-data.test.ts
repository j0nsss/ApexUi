import { describe, it, expect } from "vitest";
import { generateTableData, generateChartData } from "./random-data";

describe("generateTableData", () => {
  const schema = {
    columns: [
      { name: "Name", type: "string" as const },
      { name: "Email", type: "string" as const },
      { name: "Role", type: "string" as const },
      { name: "Status", type: "string" as const },
      { name: "Value", type: "number" as const },
      { name: "Date", type: "date" as const },
    ],
    row_count: { min: 10, max: 20 },
  };

  it("produces rows within min-max range", () => {
    const rows = generateTableData(schema, 42);
    expect(rows.length).toBeGreaterThanOrEqual(10);
    expect(rows.length).toBeLessThanOrEqual(20);
  });

  it("each row has all expected columns", () => {
    const rows = generateTableData(schema, 42);
    for (const row of rows) {
      expect(row).toHaveProperty("Name");
      expect(row).toHaveProperty("Email");
      expect(row).toHaveProperty("Role");
      expect(row).toHaveProperty("Status");
      expect(row).toHaveProperty("Value");
      expect(row).toHaveProperty("Date");
    }
  });

  it("values are correct types", () => {
    const rows = generateTableData(schema, 42);
    for (const row of rows) {
      expect(typeof row.Name).toBe("string");
      expect(typeof row.Email).toBe("string");
      expect(typeof row.Value).toBe("number");
      expect(typeof row.Date).toBe("string");
    }
  });

  it("same seed produces same output", () => {
    const a = generateTableData(schema, 99);
    const b = generateTableData(schema, 99);
    expect(a).toEqual(b);
  });

  it("different seed produces different output", () => {
    const a = generateTableData(schema, 1);
    const b = generateTableData(schema, 2);
    expect(a).not.toEqual(b);
  });
});

describe("generateChartData", () => {
  it("produces time_series data within point range", () => {
    const data = generateChartData(
      {
        data_type: "time_series",
        points: { min: 6, max: 24 },
        value_range: { min: 10, max: 100 },
        variance: 15,
      },
      42,
    );
    expect(data.length).toBeGreaterThanOrEqual(6);
    expect(data.length).toBeLessThanOrEqual(24);
  });

  it("time_series values are within range", () => {
    const data = generateChartData(
      {
        data_type: "time_series",
        points: { min: 10, max: 10 },
        value_range: { min: 20, max: 80 },
        variance: 10,
      },
      42,
    );
    for (const point of data) {
      expect(point.value).toBeGreaterThanOrEqual(20);
      expect(point.value).toBeLessThanOrEqual(80);
      expect(point.label).toBeTruthy();
    }
  });

  it("produces categorical data within category range", () => {
    const data = generateChartData(
      {
        data_type: "categorical",
        categories: { min: 4, max: 8 },
        value_range: { min: 5, max: 100 },
      },
      42,
    );
    expect(data.length).toBeGreaterThanOrEqual(4);
    expect(data.length).toBeLessThanOrEqual(8);
  });

  it("categorical values are within range", () => {
    const data = generateChartData(
      {
        data_type: "categorical",
        categories: { min: 5, max: 5 },
        value_range: { min: 10, max: 50 },
      },
      42,
    );
    for (const point of data) {
      expect(point.value).toBeGreaterThanOrEqual(10);
      expect(point.value).toBeLessThanOrEqual(50);
    }
  });

  it("same seed produces same output", () => {
    const a = generateChartData(
      { data_type: "time_series", points: { min: 12, max: 12 }, value_range: { min: 0, max: 100 } },
      42,
    );
    const b = generateChartData(
      { data_type: "time_series", points: { min: 12, max: 12 }, value_range: { min: 0, max: 100 } },
      42,
    );
    expect(a).toEqual(b);
  });
});
