import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneLayout from "@/components/SceneLayout";
import { Slider } from "@/components/ui/slider";
import calvinImg from "@/assets/calvin-cycle.jpg";

interface ReaksiGelapProps {
  onNext: () => void;
  onBack: () => void;
}

const steps = [
  {
    title: "1. Transisi Energi",
    desc: "ATP dan NADPH yang dihasilkan dari reaksi terang bergerak dari tilakoid menuju stroma.",
    icon: "🔋",
    color: "bg-atp/20 border-atp",
  },
  {
    title: "2. CO₂ Masuk",
    desc: "Karbon dioksida (CO₂) dari udara masuk ke stroma melalui stomata daun.",
    icon: "💨",
    color: "bg-muted border-border",
  },
  {
    title: "3. Fiksasi Karbon",
    desc: "CO₂ diikat oleh enzim RuBisCO dan bergabung dengan molekul 5-karbon (RuBP) membentuk 2 molekul 3-karbon (3-PGA).",
    icon: "🔄",
    color: "bg-primary/20 border-primary",
  },
  {
    title: "4. Reduksi (ATP & NADPH Digunakan)",
    desc: "ATP dan NADPH digunakan untuk mengubah 3-PGA menjadi G3P (gliseraldehida-3-fosfat). Energi dari \"baterai\" reaksi terang habis terpakai.",
    icon: "⚡",
    color: "bg-atp/20 border-atp",
  },
  {
    title: "5. Regenerasi RuBP & Glukosa",
    desc: "Sebagian G3P digunakan untuk membentuk glukosa (C₆H₁₂O₆), sisanya untuk meregenerasi RuBP agar siklus terus berputar.",
    icon: "🍬",
    color: "bg-glucose/20 border-glucose",
  },
];

const ReaksiGelap = ({ onNext, onBack }: ReaksiGelapProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [co2Slider, setCo2Slider] = useState(50);
  const [showMiniSim, setShowMiniSim] = useState(false);

  const glucoseRate = Math.round((co2Slider / 100) * 100);
  const cycleSpeed = Math.max(3, 14 - (co2Slider / 100) * 10);
  const co2MoleculeCount = Math.max(1, Math.ceil(co2Slider / 20));

  return (
    <SceneLayout
      title="Reaksi Gelap (Siklus Calvin)"
      subtitle="Lokasi: Stroma — Tidak memerlukan cahaya langsung"
      currentScene={4}
      totalScenes={8}
      onBack={onBack}
      onNext={currentStep === steps.length - 1 ? onNext : undefined}
      nextLabel={currentStep === steps.length - 1 ? "Ke Simulasi" : undefined}
    >
      <div className="max-w-2xl mx-auto py-4 space-y-4">
        {/* Reference image */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <img src={calvinImg} alt="Siklus Calvin" className="w-full h-48 object-cover" loading="lazy" width={900} height={600} />
        </div>

        {/* Step progress */}
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setCurrentStep(i)} className={`flex-1 h-2 rounded-full transition-colors cursor-pointer ${i <= currentStep ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        {/* Current step card */}
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className={`rounded-xl p-5 border-2 ${steps[currentStep].color}`}>
            <div className="flex items-start gap-3">
              <span className="text-3xl">{steps[currentStep].icon}</span>
              <div>
                <h3 className="font-bold text-foreground text-lg">{steps[currentStep].title}</h3>
                <p className="text-sm text-foreground/80 mt-1">{steps[currentStep].desc}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step navigation */}
        <div className="flex justify-between">
          <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="px-4 py-2 text-sm rounded-lg bg-muted text-muted-foreground disabled:opacity-40 hover:bg-muted/80 transition-colors">← Sebelumnya</button>
          <span className="text-xs text-muted-foreground self-center">Tahap {currentStep + 1} / {steps.length}</span>
          <button onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} disabled={currentStep === steps.length - 1} className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors">Berikutnya →</button>
        </div>

        {/* ===== DETAILED CALVIN CYCLE VISUALIZATION ===== */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm text-foreground">🔬 Visualisasi Siklus Calvin</h4>
            <button onClick={() => setShowMiniSim(!showMiniSim)} className="text-xs text-primary font-semibold hover:underline">
              {showMiniSim ? "Tutup kontrol 💨" : "Coba atur CO₂ 💨"}
            </button>
          </div>

          {/* CO2 slider */}
          <AnimatePresence>
            {showMiniSim && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
                <div className="bg-muted/30 rounded-lg p-3 border border-border space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground font-medium">💨 Konsentrasi CO₂</span>
                    <span className="font-bold text-co2">{co2Slider}%</span>
                  </div>
                  <Slider value={[co2Slider]} onValueChange={([v]) => setCo2Slider(v)} min={0} max={100} step={5} className="cursor-pointer" />
                  <p className="text-[10px] text-muted-foreground">Geser — perhatikan kecepatan siklus, jumlah CO₂ masuk, dan laju glukosa!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative h-72 md:h-80 rounded-lg overflow-hidden border border-border/50 select-none bg-gradient-to-br from-primary/3 via-background to-sunlight/3">
            {/* ── STROMA LABEL ── */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground font-semibold tracking-wider bg-card/60 px-2 py-0.5 rounded-full">STROMA</div>

            {/* ── CENTRAL CYCLE RING ── */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.svg
                width="160" height="160" viewBox="0 0 160 160"
                animate={{ rotate: 360 }}
                transition={{ duration: cycleSpeed, repeat: Infinity, ease: "linear" }}
              >
                {/* Cycle ring */}
                <circle cx="80" cy="80" r="60" fill="none" stroke="hsl(142 45% 38% / 0.2)" strokeWidth="2" strokeDasharray="8 4" />
                {/* Direction arrows on ring */}
                {[0, 120, 240].map(deg => (
                  <g key={deg} transform={`rotate(${deg} 80 80)`}>
                    <polygon points="80,18 76,26 84,26" fill="hsl(142 45% 38% / 0.4)" />
                  </g>
                ))}
              </motion.svg>

              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[9px] text-muted-foreground font-semibold">Siklus</div>
                  <div className="text-[10px] text-primary font-bold">Calvin</div>
                </div>
              </div>
            </div>

            {/* ── MOLECULE NODES (fixed position, counter-rotate text) ── */}
            {/* RuBP — top */}
            <motion.div
              animate={currentStep >= 2 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-[14%] left-1/2 -translate-x-1/2 flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/15 border-2 border-primary/40 flex items-center justify-center">
                <span className="text-[9px] font-bold text-primary">RuBP</span>
              </div>
              <span className="text-[7px] text-muted-foreground mt-0.5">5C</span>
            </motion.div>

            {/* 3-PGA — bottom-right */}
            {currentStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-[58%] right-[12%] flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-accent/15 border-2 border-accent/40 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-accent">3-PGA</span>
                </div>
                <span className="text-[7px] text-muted-foreground mt-0.5">3C × 2</span>
              </motion.div>
            )}

            {/* G3P — bottom-left */}
            {currentStep >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-[58%] left-[12%] flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-glucose/15 border-2 border-glucose/40 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-glucose">G3P</span>
                </div>
                <span className="text-[7px] text-muted-foreground mt-0.5">3C × 2</span>
              </motion.div>
            )}

            {/* ── ARROWS between molecules ── */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 320">
              {/* RuBP → 3-PGA (with CO₂) */}
              {currentStep >= 2 && (
                <motion.path
                  d="M 210 100 Q 280 140 290 190"
                  fill="none"
                  stroke="hsl(142 45% 38% / 0.35)"
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                />
              )}
              {/* 3-PGA → G3P */}
              {currentStep >= 3 && (
                <motion.path
                  d="M 260 220 Q 200 260 140 220"
                  fill="none"
                  stroke="hsl(195 60% 50% / 0.35)"
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                />
              )}
              {/* G3P → RuBP (regeneration) */}
              {currentStep >= 4 && (
                <motion.path
                  d="M 120 190 Q 110 140 190 100"
                  fill="none"
                  stroke="hsl(35 90% 55% / 0.35)"
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                />
              )}
            </svg>

            {/* ── CO₂ MOLECULES entering ── */}
            {currentStep >= 1 && (
              <div className="absolute top-[8%] right-[10%]">
                {Array.from({ length: co2MoleculeCount }, (_, i) => (
                  <motion.div
                    key={i}
                    animate={{ x: [-10, -30, -50], y: [0, 10, 20], opacity: [0.9, 0.5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
                    className="flex items-center gap-0.5 mb-0.5"
                  >
                    <span className="text-[10px]">💨</span>
                    <span className="text-[8px] font-bold text-co2">CO₂</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ── RuBisCO ENZYME (at junction) ── */}
            {currentStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="absolute top-[30%] right-[25%]"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="px-2 py-1.5 bg-primary/10 rounded-lg border border-primary/30 shadow-sm"
                >
                  <span className="text-[8px] font-bold text-primary">🧬 RuBisCO</span>
                  <div className="text-[7px] text-muted-foreground text-center">Enzim</div>
                </motion.div>
              </motion.div>
            )}

            {/* ── ATP & NADPH consumed (step 3→4) ── */}
            {currentStep >= 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-[22%] left-1/2 -translate-x-1/2 flex gap-1.5"
              >
                <motion.div
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.9, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="px-2 py-1 bg-atp/15 text-atp text-[9px] font-bold rounded border border-atp/30"
                >ATP →</motion.div>
                <motion.div
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.9, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  className="px-2 py-1 bg-nadph/15 text-nadph text-[9px] font-bold rounded border border-nadph/30"
                >NADPH →</motion.div>
                <span className="text-[8px] text-muted-foreground self-center">terpakai</span>
              </motion.div>
            )}

            {/* ── GLUCOSE OUTPUT ── */}
            {currentStep >= 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="absolute bottom-[6%] left-[8%]"
              >
                <motion.div
                  animate={{ y: [0, -5, 0], boxShadow: ["0 0 8px hsl(35 90% 55% / 0.2)", "0 0 16px hsl(35 90% 55% / 0.5)", "0 0 8px hsl(35 90% 55% / 0.2)"] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-glucose/15 rounded-xl border border-glucose/40"
                >
                  <span className="text-xl">🍬</span>
                  <div>
                    <span className="text-xs font-bold text-glucose">Glukosa</span>
                    <div className="text-[8px] text-glucose/70">C₆H₁₂O₆ {showMiniSim ? `(${glucoseRate}%)` : ""}</div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ── REGENERATION arrow label ── */}
            {currentStep >= 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="absolute top-[40%] left-[8%] text-[8px] text-muted-foreground -rotate-45"
              >
                Regenerasi →
              </motion.div>
            )}

            {/* Low CO2 overlay */}
            {showMiniSim && co2Slider < 8 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-lg z-20">
                <p className="text-sm text-foreground font-medium px-4 text-center">⚠️ CO₂ sangat rendah — siklus Calvin hampir berhenti</p>
              </motion.div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {[
              { label: "RuBP (5C)", color: "bg-primary/40" },
              { label: "3-PGA (3C)", color: "bg-accent/40" },
              { label: "G3P (3C)", color: "bg-glucose/40" },
              { label: "CO₂", color: "bg-co2/40" },
              { label: "RuBisCO", color: "bg-primary/30" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1 text-[9px] text-muted-foreground">
                <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-card rounded-lg p-4 border border-border text-sm">
          <h4 className="font-semibold text-foreground mb-2">📝 Ringkasan Reaksi Gelap</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-primary/5 rounded-lg p-2">
              <span className="font-semibold text-foreground">Input:</span>
              <p className="text-muted-foreground">CO₂ + ATP + NADPH</p>
            </div>
            <div className="bg-primary/5 rounded-lg p-2">
              <span className="font-semibold text-foreground">Output:</span>
              <p className="text-muted-foreground">Glukosa (C₆H₁₂O₆)</p>
            </div>
          </div>
        </div>
      </div>
    </SceneLayout>
  );
};

export default ReaksiGelap;
