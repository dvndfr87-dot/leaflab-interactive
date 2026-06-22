import { useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import LiveSparkline from "./LiveSparkline";
import BatteryGauge from "./BatteryGauge";
import StatusBadge from "./StatusBadge";
import ProtonRelay from "./ProtonRelay";
import ExperimentLog from "./ExperimentLog";
import { useExperimentLog } from "./useExperimentLog";

interface Props {
  light: number;
  setLight: (v: number) => void;
  water: number;
  setWater: (v: number) => void;
}

const SliderTip = ({ children }: { children: React.ReactNode }) => (
  <Tooltip delayDuration={150}>
    <TooltipTrigger asChild>
      <Info className="w-3 h-3 text-muted-foreground/70 cursor-help" />
    </TooltipTrigger>
    <TooltipContent side="top" className="max-w-[260px] text-xs">{children}</TooltipContent>
  </Tooltip>
);

const LightReactionLab = ({ light, setLight, water, setWater }: Props) => {
  const m = useMemo(() => {
    const L = Math.max(0, Math.min(20, light));
    const W = Math.max(0, Math.min(100, water)) / 100;
    const protons = L === 0 ? 1 : Math.min(100, 1 + (L / 20) * 70 + W * 25);
    const lightSpeed = L === 0 ? 0 : Math.min(100, (L / 20) * 75 + W * 20);
    const o2 = L === 0 || W === 0 ? 0 : Math.min(100, (L / 20) * 60 + W * 45);
    const atp = Math.min(100, (protons / 100) * 90 + (L / 20) * 10);
    const nadph = L < 4 ? L * 6 : Math.min(100, (L / 20) * 70 + W * 25);
    return { protons, lightSpeed, o2, atp, nadph };
  }, [light, water]);

  const log = useExperimentLog({
    params: { Cahaya: light, "H₂O": water },
    results: { "H⁺": +m.protons.toFixed(1), Kec: +m.lightSpeed.toFixed(1), "O₂": +m.o2.toFixed(1), ATP: +m.atp.toFixed(1), NADPH: +m.nadph.toFixed(1) },
  });

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-2">
        <div className="lab-panel lab-corner p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="lab-label">CH-01 · Intensitas Cahaya</div>
              <SliderTip>
                Skala 0–20 (fase pembelajaran). 0 = gelap, reaksi terang berhenti. 1–6 produksi H⁺ rendah, 7–14 reaksi mulai cepat, &gt;14 + H₂O tinggi → PSI cepat & O₂ melonjak.
              </SliderTip>
            </div>
            <div className="lcd-readout">{light.toString().padStart(2, "0")}/20</div>
          </div>
          <Slider value={[light]} onValueChange={([v]) => setLight(v)} min={0} max={20} step={1} />
          <div className="flex justify-between font-mono text-[9px] text-muted-foreground">
            <span>gelap</span><span>fase rendah</span><span>fase optimal</span>
          </div>

          <details className="group mt-2 rounded-md border border-border/50 bg-muted/30">
            <summary className="cursor-pointer list-none px-2 py-1.5 text-[10px] font-mono uppercase tracking-wide text-foreground/80 flex items-center justify-between">
              <span>📊 Hasil Penelitian Uji Cakram Daun</span>
              <span className="text-muted-foreground transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div className="px-2 pb-2 pt-1 space-y-2">
              <div className="space-y-1.5 p-2 rounded-md bg-muted/40 border border-border/40">
                {[
                  { color: "#ef4444", level: 95, status: "Tinggi" },
                  { color: "#3b82f6", level: 90, status: "Tinggi" },
                  { color: "#22c55e", level: 18, status: "Rendah" },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm shrink-0 border border-border/40" style={{ background: b.color }} />
                    <div className="flex-1 h-3 rounded-sm bg-background/60 overflow-hidden">
                      <div className="h-full rounded-sm transition-all" style={{ width: `${b.level}%`, background: b.color }} />
                    </div>
                    <span className={`w-14 text-right font-mono text-[10px] ${b.status === "Tinggi" ? "text-emerald-600" : "text-amber-600"}`}>{b.status}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground leading-snug pt-1 border-t border-border/40">
                <b>Dasar simulasi:</b> Hasil penelitian uji cakram daun menunjukkan efektivitas fotosintesis tertinggi pada cahaya <b style={{ color: "#ef4444" }}>merah</b> dan <b style={{ color: "#3b82f6" }}>biru</b> (bar memanjang menandakan laju fotosintesis <b className="text-emerald-600">tinggi</b>), sedangkan cahaya <b style={{ color: "#22c55e" }}>hijau</b> menunjukkan efektivitas paling <b className="text-amber-600">rendah</b> (bar pendek karena sebagian besar dipantulkan oleh klorofil).
              </p>
            </div>
          </details>
        </div>

        <div className="lab-panel lab-corner p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="lab-label">CH-02 · Konsentrasi H₂O</div>
              <SliderTip>
                Substrat fotolisis di lumen tilakoid. Saat cahaya tinggi, H₂O melimpah → PSI bekerja lebih cepat → produksi O₂ meningkat tajam.
              </SliderTip>
            </div>
            <div className="lcd-readout">{water.toString().padStart(3, "0")}%</div>
          </div>
          <Slider value={[water]} onValueChange={([v]) => setWater(v)} min={0} max={100} step={5} />
          <div className="flex justify-between font-mono text-[9px] text-muted-foreground">
            <span>0</span><span>substrat fotolisis</span><span>jenuh</span>
          </div>
        </div>
      </div>

      {/* Cahaya → H⁺ → Kecepatan relay */}
      <ProtonRelay light={light} protons={m.protons} speed={m.lightSpeed} />

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

      <div className="grid grid-cols-3 gap-2">
        <BatteryGauge label="ATP" sublabel="dari ATP-sintase" value={m.atp} colorVar="--atp"
          tooltip="ATP terbentuk via kemiosmosis: H⁺ mengalir balik melalui ATP-sintase. Energi ini dipakai siklus Calvin untuk reduksi 3-PGA → G3P." />
        <BatteryGauge label="NADPH" sublabel="dari Fotosistem I" value={m.nadph} colorVar="--nadph"
          tooltip="NADP⁺ menerima elektron dari PSI menjadi NADPH. Bersama ATP, NADPH menyumbang elektron berenergi tinggi untuk fiksasi karbon." />
        <BatteryGauge label="O₂" sublabel="hasil fotolisis" value={m.o2} colorVar="--oxygen"
          tooltip="Pemecahan H₂O di PSII menghasilkan O₂ sebagai produk samping. Tanpa cahaya atau air, produksi O₂ = 0." />
      </div>

      <LiveSparkline
        series={[
          { label: "Cahaya", color: "hsl(var(--sunlight))", value: (light / 20) * 100 },
          { label: "H⁺", color: "hsl(var(--accent))", value: m.protons },
          { label: "O₂", color: "hsl(var(--oxygen))", value: m.o2 },
          { label: "ATP", color: "hsl(var(--atp))", value: m.atp },
        ]}
      />

      <ExperimentLog entries={log.entries} onClear={log.clear} onDownload={log.downloadCSV} title="Log Eksperimen · Reaksi Terang" />

      <p className="text-[11px] text-muted-foreground italic px-1">
        💡 Coba turunkan cahaya ke 0 — H⁺ dan O₂ runtuh, status berubah ke <b>Stopped</b>. Naikkan H₂O saat cahaya tinggi untuk mempercepat PSI.
      </p>
    </div>
  );
};

export default LightReactionLab;
