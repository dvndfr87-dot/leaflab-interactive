interface Props {
  label: string;
  sublabel?: string;
  value: number; // 0..100
  cells?: number;
  colorVar: string; // e.g. "--atp"
  tooltip?: string;
}

const BatteryGauge = ({ label, sublabel, value, cells = 10, colorVar, tooltip }: Props) => {
  const v = Math.max(0, Math.min(100, value));
  const filled = Math.round((v / 100) * cells);

  return (
    <div className="lab-panel lab-corner p-2 group relative" title={tooltip}>
      <div className="flex items-baseline justify-between">
        <div className="lab-label">{label}</div>
        <div className="font-mono text-[10px] text-foreground/80">
          {filled}/{cells}
        </div>
      </div>
      {sublabel && <div className="text-[9px] text-muted-foreground -mt-0.5 mb-1">{sublabel}</div>}
      <div className="flex items-center gap-1">
        <div className="flex-1 flex gap-[2px] p-[3px] rounded border border-foreground/20 bg-background/50">
          {Array.from({ length: cells }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-3 rounded-[2px] transition-colors"
              style={{
                background:
                  i < filled
                    ? `hsl(var(${colorVar}))`
                    : "hsl(var(--muted))",
                boxShadow: i < filled ? `0 0 6px hsl(var(${colorVar}) / 0.5)` : undefined,
              }}
            />
          ))}
        </div>
        <div className="w-1.5 h-2 rounded-r bg-foreground/30" />
      </div>
      <div className="font-mono text-[10px] text-right mt-0.5 text-muted-foreground">{v.toFixed(0)}%</div>
    </div>
  );
};

export default BatteryGauge;
