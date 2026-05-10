import { useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import LiveSparkline from "./LiveSparkline";
import BatteryGauge from "./BatteryGauge";
import StatusBadge from "./StatusBadge";

interface Props {
  co2: number;     // 0..100
  setCo2: (v: number) => void;
  o2: number;      // 0..100  (atmospheric / chamber)
  setO2: (v: number) => void;
  energy: number;  // 0..100  (ATP/NADPH supply from light reaction)
  setEnergy: (v: number) => void;
}

/**
 * Stasiun Uji Reaksi Gelap (Siklus Calvin).
 *  - CO₂ → substrat fiksasi RuBisCO
 *  - O₂  → kompetitor RuBisCO (fotorespirasi).  10–20%: lambat, 30–50%: lebih cepat (asumsi pembelajaran).
 *  - energy (ATP+NADPH) → reduksi 3-PGA → G3P
 */
const DarkReactionLab = ({ co2, setCo2, o2, setO2, energy, setEnergy }: Props) => {
  const m = useMemo(() => {
    const C = Math.max(0, Math.min(100, co2)) / 100;
    const O = Math.max(0, Math.min(100, o2));
    const E = Math.max(0, Math.min(100, energy)) / 100;

    // Faktor O₂ sesuai brief: 10–20% lambat, 30–50% lebih cepat, >70% mulai jenuh.
    let o2Factor = 0.4;
    if (O < 10) o2Factor = 0.55;
    else if (O <= 20) o2Factor = 0.45;
    else if (O <= 50) o2Factor = 1.0;
    else if (O <= 70) o2Factor = 0.8;
    else o2Factor = 0.55;

    const cycleSpeed = C === 0 || E === 0 ? 0 : Math.min(100, C * 60 + E * 45) * o2Factor;

    const glucose = Math.min(100, cycleSpeed * 0.9);
    const starch  = Math.min(100, glucose * 0.75);   // pati = penyimpanan kelebihan glukosa
    const g3p     = Math.min(100, cycleSpeed * 1.1);

    return { cycleSpeed, glucose, starch, g3p, o2Factor };
  }, [co2, o2, energy]);

  return (
    <div className="space-y-3">
      {/* Control sliders */}
      <div className="grid md:grid-cols-3 gap-2">
        <div className="lab-panel lab-corner p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="lab-label">CH-03 · CO₂ (ppm rel.)</div>
            <div className="lcd-readout">{co2.toString().padStart(3, "0")}%</div>
          </div>
          <Slider value={[co2]} onValueChange={([v]) => setCo2(v)} min={0} max={100} step={5} />
        </div>

        <div className="lab-panel lab-corner p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="lab-label" title="O₂ tinggi memicu fotorespirasi">CH-04 · O₂ Atmosfer</div>
            <div className="lcd-readout">{o2.toString().padStart(3, "0")}%</div>
          </div>
          <Slider value={[o2]} onValueChange={([v]) => setO2(v)} min={0} max={100} step={5} />
          <div className="font-mono text-[9px] text-muted-foreground">faktor RuBisCO ×{m.o2Factor.toFixed(2)}</div>
        </div>

        <div className="lab-panel lab-corner p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="lab-label">CH-05 · Pasokan ATP/NADPH</div>
            <div className="lcd-readout">{energy.toString().padStart(3, "0")}%</div>
          </div>
          <Slider value={[energy]} onValueChange={([v]) => setEnergy(v)} min={0} max={100} step={5} />
          <div className="font-mono text-[9px] text-muted-foreground">dari Reaksi Terang</div>
        </div>
      </div>

      {/* Status */}
      <StatusBadge speed={m.cycleSpeed} label="Laju Siklus Calvin" />

      {/* Battery indicators */}
      <div className="grid grid-cols-3 gap-2">
        <BatteryGauge label="G3P" sublabel="produk antara 3C" value={m.g3p} colorVar="--accent" tooltip="Sebagian regenerasi RuBP, sebagian → glukosa." />
        <BatteryGauge label="Glukosa" sublabel="C₆H₁₂O₆" value={m.glucose} colorVar="--glucose" tooltip="Output siklus Calvin." />
        <BatteryGauge label="Pati (Starch)" sublabel="penyimpanan" value={m.starch} colorVar="--secondary" tooltip="Polimerisasi glukosa berlebih di stroma." />
      </div>

      {/* Live graph */}
      <LiveSparkline
        series={[
          { label: "CO₂",     color: "hsl(var(--co2))",     value: co2 },
          { label: "Siklus",  color: "hsl(var(--primary))", value: m.cycleSpeed },
          { label: "Glukosa", color: "hsl(var(--glucose))", value: m.glucose },
          { label: "Pati",    color: "hsl(var(--secondary))", value: m.starch },
        ]}
      />

      <p className="text-[11px] text-muted-foreground italic px-1">
        💡 Atur O₂ di rentang 30–50% untuk laju RuBisCO terbaik. Tanpa pasokan ATP/NADPH, siklus berhenti meskipun CO₂ tinggi.
      </p>
    </div>
  );
};

export default DarkReactionLab;
