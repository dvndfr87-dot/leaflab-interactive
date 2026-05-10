import { useEffect, useRef, useState } from "react";

export interface LogEntry {
  t: number;        // timestamp ms
  changed: string;  // which parameter changed, e.g. "Cahaya"
  params: Record<string, number>;
  results: Record<string, number>;
}

interface Options {
  /** Parameter values keyed by display name. */
  params: Record<string, number>;
  /** Computed/result values keyed by display name. */
  results: Record<string, number>;
  /** Debounce window in ms before committing an entry. */
  debounceMs?: number;
  /** Hard cap on retained entries. */
  max?: number;
}

/**
 * Records a new log entry whenever any tracked parameter changes (debounced).
 * Detects which parameter triggered the change for the "changed" label.
 */
export function useExperimentLog({ params, results, debounceMs = 350, max = 50 }: Options) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const lastParamsRef = useRef<Record<string, number>>({ ...params });
  const pendingRef = useRef<{ changed: string } | null>(null);
  const timerRef = useRef<number | null>(null);
  const latestRef = useRef({ params, results });
  latestRef.current = { params, results };

  useEffect(() => {
    // Detect which key changed.
    let changed: string | null = null;
    for (const k of Object.keys(params)) {
      if (lastParamsRef.current[k] !== params[k]) {
        changed = k;
        break;
      }
    }
    if (!changed) return;
    lastParamsRef.current = { ...params };
    pendingRef.current = { changed };

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const p = pendingRef.current;
      if (!p) return;
      const cur = latestRef.current;
      setEntries(prev => {
        const next: LogEntry = {
          t: Date.now(),
          changed: p.changed,
          params: { ...cur.params },
          results: { ...cur.results },
        };
        const out = [next, ...prev];
        if (out.length > max) out.length = max;
        return out;
      });
      pendingRef.current = null;
    }, debounceMs);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [params, debounceMs, max]);

  const clear = () => setEntries([]);

  const downloadCSV = (filename = "experiment-log.csv") => {
    if (entries.length === 0) return;
    const paramKeys = Object.keys(entries[0].params);
    const resultKeys = Object.keys(entries[0].results);
    const header = ["timestamp", "changed", ...paramKeys, ...resultKeys].join(",");
    const rows = entries.map(e =>
      [
        new Date(e.t).toISOString(),
        e.changed,
        ...paramKeys.map(k => e.params[k]?.toFixed(2) ?? ""),
        ...resultKeys.map(k => e.results[k]?.toFixed(2) ?? ""),
      ].join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { entries, clear, downloadCSV };
}
