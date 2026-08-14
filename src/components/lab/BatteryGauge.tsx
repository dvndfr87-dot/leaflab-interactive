import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BatteryFull, Info } from "lucide-react";

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

  const body = (
    <div className="lab-panel lab-corner p-2 cursor-help">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-1">
          <BatteryFull className="w-3 h-3" style={{ color: `hsl(var(${colorVar}))` }} />
          <div className="lab-label">{label}</div>
          {tooltip && <Info className="w-2.5 h-2.5 text-muted-foreground" />}
        </div>
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
              className="flex-1 h-3 rounded-[2px] transition-all duration-200"
              style={{
                background: i < filled ? `hsl(var(${colorVar}))` : "hsl(var(--muted))",
                boxShadow: i < filled ? `0 0 6px hsl(var(${colorVar}) / 0.6)` : undefined,
              }}
            />
          ))}
        </div>
        <div className="w-1.5 h-2 rounded-r" style={{ background: `hsl(var(${colorVar}) / 0.6)` }} />
      </div>
      <div className="flex items-center justify-between mt-0.5">
        <div className="font-mono text-[9px] text-muted-foreground">{v >= 80 ? "ENERGI TINGGI" : v >= 40 ? "ENERGI SEDANG" : v > 5 ? "ENERGI RENDAH" : "KOSONG"}</div>
        <div className="font-mono text-[10px] font-bold" style={{ color: `hsl(var(${colorVar}))` }}>{v.toFixed(0)}%</div>
      </div>
    </div>
  );

  if (!tooltip) return body;
  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>{body}</TooltipTrigger>
      <TooltipContent side="top" className="max-w-[240px] text-xs">{tooltip}</TooltipContent>
    </Tooltip>
  );
};

export default BatteryGauge;
