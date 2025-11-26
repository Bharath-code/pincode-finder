"use client";

import { useEffect } from "react";

type Metric = { name: string; value: number; id: string };

const send = async (metric: Metric) => {
  try {
    const body = JSON.stringify(metric);
    if (navigator.sendBeacon) {
      // Use sendBeacon for reliability during page unload
      navigator.sendBeacon('/api/vitals', body);
    } else {
      // Fallback to fetch
      await fetch("/api/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body,
      });
    }
  } catch (e) {
    console.error(e);
  }
};

export const WebVitals = () => {
  useEffect(() => {
    import("web-vitals").then(({ onLCP, onINP, onCLS, onTTFB }) => {
      onLCP((m) => send({ name: m.name, value: m.value, id: m.id }));
      onINP((m) => send({ name: m.name, value: m.value, id: m.id }));
      onCLS((m) => send({ name: m.name, value: m.value, id: m.id }));
      onTTFB((m) => send({ name: m.name, value: m.value, id: m.id }));
    });
  }, []);
  return null;
};
