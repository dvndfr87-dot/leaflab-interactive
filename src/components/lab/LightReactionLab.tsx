import { useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import LiveSparkline from "./LiveSparkline";
import BatteryGauge from "./BatteryGauge";
import StatusBadge from "./StatusBadge";

interface Props {
  light: number;        // 0..20
  setLight: (v: number) => void;
  water: number;        // 0..100
  setWater: (v: number) => void;
}

/**
 * Stasiun Uji Reaksi Terang.
 * Logika simulasi:
 *  - light = 0   → reaksi terang berhenti, H+ ≈ 1
 *  - 1..6        → produksi H+ rendah, reaksi lambat
 *  - 7..14       → reaksi sedang–cepat, PSI mulai aktif
 *  - >14 + H₂O↑  → PSI cepat, O₂ meningkat tajam
 */
const LightReactionLab = ({ light, setLight, water, setWater }: Props) => {
  const m = useMemo(() => {
    const L = Math.max(0, Math.min(20, light));
    const W = Math.max(0, Math.min(100, water)) / 100;

    // Akumulasi proton H+ (skala 1–100, 1 saat gelap).
    const protons = L === 0 ? 1 : Math.min(100, 1 + (L / 20) * 70 + W * 25);

    // Laju reaksi terang (0..100).
    const lightSpeed = L === 0 ? 0 : Math.min(100, (L / 20) * 75 + W * 20);

    // Produksi O₂ — perlu cahaya & air.
    const o2 = L === 0 || W === 0 ? 0 : Math.min(100, (L / 20) * 60 + W * 45);

    // ATP via gradien proton (kemiosmosis).
    const atp = Math.min(100, (protons / 100) * 90 + (L / 20) * 10);

    // NADPH dari fotosistem I — butuh cahaya tinggi.
    const nadph = L < 4 ? L * 6 : Math.min(100, (L / 20) * 70 + W * 25);

    return { protons, lightSpeed, o2, atp, nadph };
  }, [light, water]);

  return (
    <div className="space-y-3">
      {/* Control sliders */}
      <div className="grid md:grid-cols-2 gap-2">
        <div className="lab-panel lab-corner p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="lab-label" title="Photosynthetically Active Radiation, fase pembelajaran">CH-01 · Intensitas Cahaya</div>
            <div className="lcd-readout">{light.toString().padStart(2, "0")}/20</div>
          </div>
          <Slider value={[light]} onValueChange={([v]) => setLight(v)} min={0} max={20} step={1} />
          <div className="flex justify-between font-mono text-[9px] text-muted-foreground">
            <span>gelap</span><span>fase rendah</span><span>fase optimal</span>
          </div>
        </div>

        <div className="lab-panel lab-corner p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="lab-label" title="Substrat fotolisis di lumen tilakoid">CH-02 · Konsentrasi H₂O</div>
            <div className="lcd-readout">{water.toString().padStart(3, "0")}%</div>
          </div>
          <Slider value={[water]} onValueChange={([v]) => setWater(v)} min={0} max={100} step={5} />
          <div className="flex justify-between font-mono text-[9px] text-muted-foreground">
            <span>0</span><span>substrat fotolisis</span><span>jenuh</span>
          </div>
        </div>
      </div>

      {/* Status + readouts */}
      <div className="grid md:grid-cols-2 gap-2">
        <StatusBadge speed={m.lightSpeed} label="Laju Reaksi Terang" />
        <div className="lab-panel lab-corner p-2">
          <div className="flex items-center justify-between">
            <div className="lab-label">Akumulasi H⁺ (lumen)</div>
            <div className="font-mono text-[10px] text-foreground/80">{m.protons.toFixed(0)} mM</div>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${m.protons}%` }} />
          </div>
          <div className="text-[9px] text-muted-foreground mt-1">
            {light === 0 ? "Tanpa cahaya, gradien proton runtuh (≈ 1 mM)." : "Gradien H⁺ mendorong ATP-sintase."}
          </div>
        </div>
      </div>

      {/* Battery indicators */}
      <div className="grid grid-cols-3 gap-2">
        <BatteryGauge label="ATP" sublabel="dari ATP-sintase" value={m.atp} colorVar="--atp" tooltip="Dihasilkan via kemiosmosis (gradien H⁺)." />
        <BatteryGauge label="NADPH" sublabel="dari Fotosistem I" value={m.nadph} colorVar="--nadph" tooltip="Reduksi NADP⁺ oleh elektron PSI." />
        <BatteryGauge label="O₂" sublabel="hasil fotolisis" value={m.o2} colorVar="--oxygen" tooltip="Produk samping pemecahan H₂O." />
      </div>

      {/* Live graph */}
      <LiveSparkline
        series={[
          { label: "Cahaya",  color: "hsl(var(--sunlight))", value: (light / 20) * 100 },
          { label: "H⁺",      color: "hsl(var(--accent))",   value: m.protons },
          { label: "O₂",      color: "hsl(var(--oxygen))",   value: m.o2 },
          { label: "ATP",     color: "hsl(var(--atp))",      value: m.atp },
        ]}
      />

      <p className="text-[11px] text-muted-foreground italic px-1">
        💡 Coba turunkan cahaya ke 0 — perhatikan H⁺ dan O₂ runtuh. Naikkan H₂O saat cahaya tinggi untuk mempercepat PSI dan O₂.
      </p>
    </div>
  );
};

export default LightReactionLab;
