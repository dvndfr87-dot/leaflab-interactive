import { Download, Trash2, FlaskConical } from "lucide-react";
import type { LogEntry } from "./useExperimentLog";

interface Props {
  entries: LogEntry[];
  onClear: () => void;
  onDownload: () => void;
  title?: string;
}

const fmt = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(1));
const time = (t: number) => {
  const d = new Date(t);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
};

const ExperimentLog = ({ entries, onClear, onDownload, title = "Log Eksperimen" }: Props) => {
  return (
    <div className="lab-panel lab-corner p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <FlaskConical className="w-3.5 h-3.5 text-primary" />
          <div className="lab-label">{title}</div>
          <span className="font-mono text-[9px] text-muted-foreground">({entries.length})</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onDownload}
            disabled={entries.length === 0}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-background hover:bg-muted text-[10px] font-mono disabled:opacity-40"
            title="Unduh log sebagai CSV"
          >
            <Download className="w-3 h-3" /> CSV
          </button>
          <button
            onClick={onClear}
            disabled={entries.length === 0}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-background hover:bg-muted text-[10px] font-mono disabled:opacity-40"
            title="Hapus semua entri"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="max-h-44 overflow-y-auto rounded border border-border bg-background/60">
        {entries.length === 0 ? (
          <div className="text-center text-[10px] text-muted-foreground italic py-4">
            Geser slider untuk mulai mencatat eksperimen.
          </div>
        ) : (
          <table className="w-full text-[10px] font-mono">
            <thead className="sticky top-0 bg-card border-b border-border">
              <tr className="text-muted-foreground">
                <th className="px-1.5 py-1 text-left">Waktu</th>
                <th className="px-1.5 py-1 text-left">Δ</th>
                {Object.keys(entries[0].params).map(k => (
                  <th key={k} className="px-1.5 py-1 text-right">{k}</th>
                ))}
                {Object.keys(entries[0].results).map(k => (
                  <th key={k} className="px-1.5 py-1 text-right text-primary/80">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e, idx) => (
                <tr key={e.t + "-" + idx} className="border-b border-border/50 last:border-b-0 hover:bg-muted/40">
                  <td className="px-1.5 py-0.5 text-muted-foreground">{time(e.t)}</td>
                  <td className="px-1.5 py-0.5 text-accent font-bold">{e.changed}</td>
                  {Object.keys(e.params).map(k => (
                    <td key={k} className="px-1.5 py-0.5 text-right">{fmt(e.params[k])}</td>
                  ))}
                  {Object.keys(e.results).map(k => (
                    <td key={k} className="px-1.5 py-0.5 text-right text-primary">{fmt(e.results[k])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExperimentLog;
