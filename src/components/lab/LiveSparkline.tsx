import { useEffect, useRef, useState } from "react";

interface Series {
  label: string;
  color: string; // hsl string e.g. "var(--primary)" or full
  value: number; // 0..100
}

interface Props {
  series: Series[];
  height?: number;
  maxPoints?: number;
  intervalMs?: number;
}

/**
 * Lightweight rolling-window line chart.
 * Samples the latest `value` of every series every `intervalMs`.
 */
const LiveSparkline = ({ series, height = 90, maxPoints = 40, intervalMs = 400 }: Props) => {
  const [history, setHistory] = useState<number[][]>(() => series.map(() => []));
  const seriesRef = useRef(series);
  seriesRef.current = series;

  useEffect(() => {
    const id = setInterval(() => {
      setHistory(prev =>
        seriesRef.current.map((s, i) => {
          const next = [...(prev[i] ?? []), s.value];
          if (next.length > maxPoints) next.shift();
          return next;
        })
      );
    }, intervalMs);
    return () => clearInterval(id);
  }, [maxPoints, intervalMs]);

  const W = 300;
  const H = height;

  const toPath = (data: number[]) => {
    if (data.length === 0) return "";
    const stepX = W / Math.max(1, maxPoints - 1);
    return data
      .map((v, i) => {
        const x = i * stepX;
        const y = H - (Math.max(0, Math.min(100, v)) / 100) * (H - 6) - 3;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  };

  return (
    <div className="lab-panel lab-corner p-2">
      <div className="flex items-center justify-between mb-1">
        <div className="lab-label">Live Graph · 0–100%</div>
        <div className="flex gap-2">
          {series.map(s => (
            <div key={s.label} className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground">
              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              {s.label}
            </div>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
        {/* grid */}
        {[0, 25, 50, 75, 100].map(g => {
          const y = H - (g / 100) * (H - 6) - 3;
          return <line key={g} x1={0} x2={W} y1={y} y2={y} stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2 3" />;
        })}
        {history.map((data, i) => (
          <path key={i} d={toPath(data)} fill="none" stroke={series[i].color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>
    </div>
  );
};

export default LiveSparkline;
