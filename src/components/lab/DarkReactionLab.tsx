import { useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import LiveSparkline from "./LiveSparkline";
import BatteryGauge from "./BatteryGauge";
import StatusBadge from "./StatusBadge";
import ExperimentLog from "./ExperimentLog";
import { useExperimentLog } from "./useExperimentLog";

interface Props {
  co2: number;
  setCo2: (v: number) => void;
  o2: number;
  setO2: (v: number) => void;
  energy: number;
  setEnergy: (v: number) => void;
}

const SliderTip = ({ children }: { children: React.ReactNode }) => (
  <Tooltip delayDuration={150}>
    <TooltipTrigger asChild>
      <Info className="w-3 h-3 text-muted-foreground cursor-help" />
    </TooltipTrigger>
    <TooltipContent side="top" className="max-w-[280px] text-xs">{children}</TooltipContent>
  </Tooltip>
);

const o2Insight = (O: number) => {
  if (O < 10) return "O₂ sangat rendah: RuBisCO bekerja efisien tapi belum optimal.";
  if (O <= 20) return "10–20% O₂: kompetisi O₂ vs CO₂ menahan laju → reaksi lambat.";
  if (O <= 50) return "30–50% O₂: zona optimal pembelajaran, RuBisCO bekerja cepat.";
  if (O <= 70) return "50–70% O₂: fotorespirasi mulai meningkat, laju turun.";
  return ">70% O₂: fotorespirasi dominan, siklus Calvin tertekan.";
};

const DarkReactionLab = ({ co2, setCo2, o2, setO2, energy, setEnergy }: Props) => {
  const m = useMemo(() => {
    const C = Math.max(0, Math.min(100, co2)) / 100;
    const O = Math.max(0, Math.min(100, o2));
    const E = Math.max(0, Math.min(100, energy)) / 100;

    let o2Factor = 0.4;
    if (O < 10) o2Factor = 0.55;
    else if (O <= 20) o2Factor = 0.45;
    else if (O <= 50) o2Factor = 1.0;
    else if (O <= 70) o2Factor = 0.8;
    else o2Factor = 0.55;

    const cycleSpeed = C === 0 || E === 0 ? 0 : Math.min(100, C * 60 + E * 45) * o2Factor;
    const glucose = Math.min(100, cycleSpeed * 0.9);
    const starch = Math.min(100, glucose * 0.75);
    const g3p = Math.min(100, cycleSpeed * 1.1);
    return { cycleSpeed, glucose, starch, g3p, o2Factor };
  }, [co2, o2, energy]);

  const log = useExperimentLog({
    params: { "CO₂": co2, "O₂": o2, "ATP/NADPH": energy },
    results: { Kec: +m.cycleSpeed.toFixed(1), G3P: +m.g3p.toFixed(1), Glukosa: +m.glucose.toFixed(1), Pati: +m.starch.toFixed(1) },
  });

  return (
    <div className="space-y-3">
      {/* Cara kerja control panel — penjelasan teks */}
      <div className="lab-panel lab-corner p-3 text-xs leading-relaxed text-foreground/90 space-y-1.5">
        <div className="font-mono text-[10px] tracking-widest text-primary">▸ CARA KERJA CONTROL PANEL</div>
        <p>
          Panel ini mensimulasikan <b>Siklus Calvin</b> di stroma kloroplas. Tiga slider mengatur kondisi reaksi:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-foreground/85">
          <li><b>CH-03 · CO₂</b> — jumlah substrat yang difiksasi RuBisCO ke RuBP. Naikkan CO₂ → laju siklus & produksi glukosa meningkat. CO₂ = 0 → siklus berhenti walau energi tersedia.</li>
          <li><b>CH-04 · O₂</b> — kadar oksigen yang berkompetisi dengan CO₂ di sisi aktif RuBisCO (fotorespirasi). O₂ tinggi → laju turun meski CO₂ banyak.</li>
          <li><b>CH-05 · Energi (ATP/NADPH)</b> — pasokan energi dari reaksi terang. Tanpa ATP/NADPH, reduksi 3-PGA → G3P tidak terjadi sehingga glukosa & pati tidak terbentuk.</li>
        </ul>
        <p className="pt-1">
          <span className="font-semibold">Output yang dihasilkan panel:</span> kecepatan siklus (<b>Cycle Speed</b>), molekul antara <b>G3P</b>, akumulasi <b>Glukosa (C₆H₁₂O₆)</b>, serta penimbunan <b>Pati</b> ketika glukosa berlebih. Semua nilai output bergerak real-time mengikuti kombinasi slider di atas.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-2">
        <div className="lab-panel lab-corner p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="lab-label">CH-03 · CO₂ (ppm rel.)</div>
              <SliderTip>Substrat fiksasi RuBisCO. CO₂ ↑ → laju siklus ↑ → glukosa ↑. CO₂ = 0 → siklus berhenti meskipun ATP tersedia.</SliderTip>
            </div>
            <div className="lcd-readout">{co2.toString().padStart(3, "0")}%</div>
          </div>
          <Slider value={[co2]} onValueChange={([v]) => setCo2(v)} min={0} max={100} step={5} />
        </div>

        <div className="lab-panel lab-corner p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="lab-label">CH-04 · O₂ Atmosfer</div>
              <SliderTip>
                O₂ bersaing dengan CO₂ di sisi aktif RuBisCO (fotorespirasi).<br />
                10–20%: lambat · 30–50%: optimal · &gt;50%: melambat.
              </SliderTip>
            </div>
            <div className="lcd-readout">{o2.toString().padStart(3, "0")}%</div>
          </div>
          <Slider value={[o2]} onValueChange={([v]) => setO2(v)} min={0} max={100} step={5} />
          <div className="font-mono text-[9px] text-muted-foreground">faktor RuBisCO ×{m.o2Factor.toFixed(2)}</div>
        </div>

        <div className="lab-panel lab-corner p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="lab-label">CH-05 · Pasokan ATP/NADPH</div>
              <SliderTip>Energi dari reaksi terang. ATP mereduksi 3-PGA, NADPH menyumbang elektron. Tanpa pasokan, fase reduksi tidak berjalan.</SliderTip>
            </div>
            <div className="lcd-readout">{energy.toString().padStart(3, "0")}%</div>
          </div>
          <Slider value={[energy]} onValueChange={([v]) => setEnergy(v)} min={0} max={100} step={5} />
          <div className="font-mono text-[9px] text-muted-foreground">dari Reaksi Terang</div>
        </div>
      </div>

      {/* CO2 vs O2 dynamic relation panel */}
      <div className="lab-panel lab-corner p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="lab-label">Relasi Dinamis · CO₂ ↔ O₂ pada RuBisCO</div>
          <div className="font-mono text-[10px] text-primary">×{m.o2Factor.toFixed(2)}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-mono text-co2">CO₂ · substrat</span>
              <span className="font-mono text-foreground/90">{co2}%</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full transition-all duration-300" style={{ width: `${co2}%`, background: "hsl(var(--co2))", boxShadow: "0 0 6px hsl(var(--co2) / 0.4)" }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-mono text-oxygen">O₂ · kompetitor</span>
              <span className="font-mono text-foreground/90">{o2}%</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full transition-all duration-300" style={{ width: `${o2}%`, background: "hsl(var(--oxygen))", boxShadow: "0 0 6px hsl(var(--oxygen) / 0.4)" }} />
            </div>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-muted-foreground">{o2Insight(o2)}</div>
      </div>

      <StatusBadge speed={m.cycleSpeed} label="Laju Siklus Calvin" />

      <div className="grid grid-cols-3 gap-2">
        <BatteryGauge label="G3P" sublabel="produk antara 3C" value={m.g3p} colorVar="--accent"
          tooltip="Gliseraldehida-3-fosfat: 5 dari 6 G3P meregenerasi RuBP, 1 keluar untuk membentuk glukosa." />
        <BatteryGauge label="Glukosa" sublabel="C₆H₁₂O₆" value={m.glucose} colorVar="--glucose"
          tooltip="Output siklus Calvin. Sebagian dipakai langsung untuk respirasi sel, sisanya disimpan sebagai pati." />
        <BatteryGauge label="Pati (Starch)" sublabel="penyimpanan stroma" value={m.starch} colorVar="--secondary"
          tooltip="Polimer glukosa yang disimpan sebagai cadangan energi di stroma kloroplas pada siang hari." />
      </div>

      <LiveSparkline
        series={[
          { label: "CO₂", color: "hsl(var(--co2))", value: co2 },
          { label: "O₂", color: "hsl(var(--oxygen))", value: o2 },
          { label: "Siklus", color: "hsl(var(--primary))", value: m.cycleSpeed },
          { label: "Glukosa", color: "hsl(var(--glucose))", value: m.glucose },
          { label: "Pati", color: "hsl(var(--secondary))", value: m.starch },
        ]}
      />

      <ExperimentLog entries={log.entries} onClear={log.clear} onDownload={log.downloadCSV} title="Log Eksperimen · Reaksi Gelap" />

      <p className="text-[11px] text-muted-foreground italic px-1">
        💡 Atur O₂ di rentang 30–50% untuk laju RuBisCO terbaik. Tanpa pasokan ATP/NADPH, siklus berhenti meskipun CO₂ tinggi.
      </p>
    </div>
  );
};

export default DarkReactionLab;
