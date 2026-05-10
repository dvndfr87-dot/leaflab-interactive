interface Props {
  speed: number; // 0..100 reaction speed
  label?: string;
}

/** Mengubah laju reaksi 0..100 menjadi status: Stopped / Slow / Medium / Fast / Optimal. */
const StatusBadge = ({ speed, label = "Status Reaksi" }: Props) => {
  let status = "Berhenti";
  let colorVar = "--muted";
  let textVar = "--muted-foreground";

  if (speed >= 85) { status = "Optimal"; colorVar = "--primary"; textVar = "--primary"; }
  else if (speed >= 60) { status = "Cepat"; colorVar = "--accent"; textVar = "--accent"; }
  else if (speed >= 30) { status = "Sedang"; colorVar = "--secondary"; textVar = "--secondary-foreground"; }
  else if (speed >= 8)  { status = "Lambat"; colorVar = "--destructive"; textVar = "--destructive"; }

  return (
    <div className="lab-panel lab-corner p-2">
      <div className="flex items-center justify-between">
        <div className="lab-label">{label}</div>
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border"
          style={{
            borderColor: `hsl(var(${colorVar}) / 0.5)`,
            background: `hsl(var(${colorVar}) / 0.12)`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: `hsl(var(${colorVar}))`, boxShadow: `0 0 6px hsl(var(${colorVar}))` }}
          />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: `hsl(var(${textVar}))` }}>
            {status}
          </span>
        </div>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${speed}%`, background: `hsl(var(${colorVar}))` }}
        />
      </div>
      <div className="font-mono text-[9px] text-muted-foreground text-right mt-0.5">v = {speed.toFixed(0)} u/s</div>
    </div>
  );
};

export default StatusBadge;
