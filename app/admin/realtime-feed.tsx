"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ChartTile } from "./chart-tile";

interface CopyEvent {
  id: string;
  component_slug: string | null;
  language: string | null;
  created_at: string;
}

const realtimeClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

function RealTimeCopyFeed() {
  const [events, setEvents] = useState<CopyEvent[]>([]);

  useEffect(() => {
    const channel = realtimeClient
      .channel("admin-copy-feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "analytics_events",
          filter: "event_type=eq.copy",
        },
        (payload) => {
          const newEvent = payload.new as CopyEvent;
          setEvents((prev) => [newEvent, ...prev].slice(0, 20));
        },
      )
      .subscribe();

    return () => {
      realtimeClient.removeChannel(channel);
    };
  }, []);

  return (
    <ChartTile title="Real-Time Copy Feed" className="lg:col-span-2">
      <div className="max-h-[280px] overflow-auto">
        {events.length === 0 ? (
          <p className="text-small text-secondary py-4 text-center">Waiting for copy events...</p>
        ) : (
          <table className="w-full text-small">
            <thead>
              <tr className="border-b border-default text-muted">
                <th className="text-left py-1 pr-2">Component</th>
                <th className="text-left py-1 pr-2">Language</th>
                <th className="text-left py-1">Time</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} className="border-b border-default">
                  <td className="py-1 pr-2 text-secondary">{ev.component_slug ?? "—"}</td>
                  <td className="py-1 pr-2 text-secondary">{ev.language ?? "—"}</td>
                  <td className="py-1 text-secondary">
                    {new Date(ev.created_at).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ChartTile>
  );
}

export { RealTimeCopyFeed };
