import { ArrowRight, Sun, Zap, Gauge } from "lucide-react";

interface Props {
  light: number;    // 0..20
  protons: number;  // 0..100
  speed: number;    // 0..100
}

const speedLabel = (v: number) => {
  if (v < 8) return { txt: "Stopped", color: "--muted" };
  if (v < 30) return { txt: "Slow", color: "--destructive" };
  if (v < 60) return { txt: "Medium", color: "--secondary" };
  if (v < 85) return { txt: "Fast", color: "--accent" };
  return { txt: "Optimal", color: "--primary" };
};

/**
 * Visualizes the dynamic relationship: Cahaya → H⁺ → Kecepatan reaksi.
 * Three linked progress bars + status badge so siswa melihat efek slider real-time.
 */
const ProtonRelay = ({ light, protons, speed }: Props) => {
  const lightPct = (Math.max(0, Math.min(20, light)) / 20) * 100;
  const status = speedLabel(speed);

  return (
    <div className="lab-panel lab-corner p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="lab-label">Relasi Dinamis · Cahaya → H⁺ → Kecepatan</div>
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border font-mono text-[10px] font-bold uppercase tracking-wider"
          style={{
            color: `hsl(var(${status.color}))`,
            borderColor: `hsl(var(${status.color}) / 0.5)`,
            background: `hsl(var(${status.color}) / 0.1)`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: `hsl(var(${status.color}))`, boxShadow: `0 0 6px hsl(var(${status.color}))` }} />
          {status.txt}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
        {/* Cahaya */}
        <RelayBar icon={<Sun className="w-3 h-3" />} label="Cahaya" value={lightPct} unit={`${light}/20`} colorVar="--sunlight" />
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
        {/* H⁺ */}
        <RelayBar icon={<Zap className="w-3 h-3" />} label="H⁺ (lumen)" value={protons} unit={`${protons.toFixed(0)} mM`} colorVar="--accent" />
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
        {/* Kecepatan */}
        <RelayBar icon={<Gauge className="w-3 h-3" />} label="Kec. Reaksi" value={speed} unit={`v=${speed.toFixed(0)}`} colorVar={status.color} />
      </div>

      <div className="mt-2 text-[10px] text-muted-foreground">
        {light === 0
          ? "🌙 Tanpa cahaya: H⁺ ≈ 1 mM, reaksi terang berhenti."
          : light < 7
          ? "🔅 Cahaya rendah: H⁺ menumpuk perlahan, ATP-sintase berputar lambat."
          : light < 15
          ? "🔆 Cahaya sedang: gradien H⁺ kuat, reaksi mulai cepat."
          : "☀️ Cahaya tinggi: PSI saturasi, produksi ATP/O₂ maksimum."}
      </div>
    </div>
  );
};

interface BarProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  colorVar: string;
}
const RelayBar = ({ icon, label, value, unit, colorVar }: BarProps) => (
  <div>
    <div className="flex items-center justify-between text-[10px]">
      <span className="flex items-center gap-1 font-mono text-muted-foreground" style={{ color: `hsl(var(${colorVar}))` }}>
        {icon}{label}
      </span>
      <span className="font-mono text-[9px] text-foreground/70">{unit}</span>
    </div>
    <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full transition-all duration-300"
        style={{
          width: `${Math.max(2, Math.min(100, value))}%`,
          background: `hsl(var(${colorVar}))`,
          boxShadow: `0 0 8px hsl(var(${colorVar}) / 0.5)`,
        }}
      />
    </div>
  </div>
);

export default ProtonRelay;
