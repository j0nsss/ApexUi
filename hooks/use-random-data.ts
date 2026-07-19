"use client";

import { useState, useCallback } from "react";
import { generateTableData, generateChartData } from "@/lib/random-data";
import type { Row, DataPoint } from "@/lib/random-data";
import type { RandomDataSchema } from "@/lib/types";

interface UseRandomDataResult {
  loading: boolean;
  generate: (schema: RandomDataSchema, category: string, setData: (json: string) => void) => void;
}

function useRandomData(): UseRandomDataResult {
  const [loading, setLoading] = useState(false);

  const generate = useCallback(
    (schema: RandomDataSchema, category: string, setData: (json: string) => void) => {
      setLoading(true);

      const typedSchema = schema as Record<string, unknown>;
      let result: Row[] | DataPoint[];

      if (category === "chart") {
        result = generateChartData(typedSchema as Parameters<typeof generateChartData>[0]);
      } else {
        result = generateTableData(typedSchema as Parameters<typeof generateTableData>[0]);
      }

      const json = JSON.stringify(result, null, 2);
      setData(json);

      setTimeout(() => setLoading(false), 400);
    },
    [],
  );

  return { loading, generate };
}

export { useRandomData };
