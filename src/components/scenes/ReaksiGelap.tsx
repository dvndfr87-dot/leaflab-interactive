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
    desc: "CO₂ diikat oleh enzim RuBisCO dan bergabung dengan molekul 5-karbon (RuBP) membentuk molekul 3-karbon (3-PGA).",
    icon: "🔄",
    color: "bg-primary/20 border-primary",
  },
  {
    title: "4. ATP & NADPH Digunakan",
    desc: "ATP dan NADPH digunakan untuk mengubah 3-PGA menjadi G3P (gliseraldehida-3-fosfat). Energi dari \"baterai\" reaksi terang habis terpakai.",
    icon: "⚡",
    color: "bg-atp/20 border-atp",
  },
  {
    title: "5. Glukosa Terbentuk",
    desc: "Beberapa molekul G3P digabungkan untuk membentuk glukosa (C₆H₁₂O₆) — makanan bagi tumbuhan!",
    icon: "🍬",
    color: "bg-glucose/20 border-glucose",
  },
];

const ReaksiGelap = ({ onNext, onBack }: ReaksiGelapProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [co2Slider, setCo2Slider] = useState(50);
  const [showMiniSim, setShowMiniSim] = useState(false);

  const glucoseRate = Math.round((co2Slider / 100) * 100);
  const cycleSpeed = 4 + (1 - co2Slider / 100) * 12; // faster at higher CO2

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
          <img
            src={calvinImg}
            alt="Siklus Calvin"
            className="w-full h-48 object-cover"
            loading="lazy"
            width={900}
            height={600}
          />
        </div>

        {/* Step progress */}
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`flex-1 h-2 rounded-full transition-colors cursor-pointer ${
                i <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Current step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`rounded-xl p-5 border-2 ${steps[currentStep].color}`}
          >
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
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm rounded-lg bg-muted text-muted-foreground disabled:opacity-40 hover:bg-muted/80 transition-colors"
          >
            ← Sebelumnya
          </button>
          <span className="text-xs text-muted-foreground self-center">
            Tahap {currentStep + 1} / {steps.length}
          </span>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors"
          >
            Berikutnya →
          </button>
        </div>

        {/* Interactive Calvin Cycle Visualization */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm text-foreground">Visualisasi Siklus Calvin</h4>
            <button
              onClick={() => setShowMiniSim(!showMiniSim)}
              className="text-xs text-primary font-semibold hover:underline"
            >
              {showMiniSim ? "Tutup kontrol 💨" : "Coba atur CO₂ 💨"}
            </button>
          </div>

          {/* CO2 slider */}
          <AnimatePresence>
            {showMiniSim && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-3"
              >
                <div className="bg-muted/30 rounded-lg p-3 border border-border space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground font-medium">💨 Konsentrasi CO₂</span>
                    <span className="font-bold text-co2">{co2Slider}%</span>
                  </div>
                  <Slider
                    value={[co2Slider]}
                    onValueChange={([v]) => setCo2Slider(v)}
                    min={0}
                    max={100}
                    step={5}
                    className="cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Geser untuk melihat bagaimana CO₂ memengaruhi kecepatan siklus dan produksi glukosa!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative h-48 bg-gradient-to-br from-sunlight/5 to-primary/5 rounded-lg overflow-hidden flex items-center justify-center">
            {/* Central cycle - speed changes with CO2 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: cycleSpeed, repeat: Infinity, ease: "linear" }}
              className="w-28 h-28 rounded-full border-2 border-dashed border-primary/40 relative"
            >
              {/* Cycle markers */}
              {["RuBP", "3-PGA", "G3P"].map((label, i) => (
                <motion.div
                  key={label}
                  className="absolute w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[8px] font-bold text-primary"
                  style={{
                    top: `${50 - 45 * Math.cos((i * 2 * Math.PI) / 3)}%`,
                    left: `${50 + 45 * Math.sin((i * 2 * Math.PI) / 3)}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.span animate={{ rotate: -360 }} transition={{ duration: cycleSpeed, repeat: Infinity, ease: "linear" }}>
                    {label}
                  </motion.span>
                </motion.div>
              ))}
            </motion.div>
            <div className="absolute text-[10px] text-muted-foreground font-medium">Siklus Calvin</div>

            {/* CO2 input - count based on slider */}
            {currentStep >= 1 && (
              <div className="absolute top-3 left-3">
                {Array.from({ length: Math.max(1, Math.ceil(co2Slider / 25)) }, (_, i) => (
                  <motion.div
                    key={i}
                    animate={{ x: [0, 15, 0], opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                    className="flex items-center gap-1 mb-1"
                  >
                    <span className="text-xs">💨</span>
                    <span className="text-[10px] font-bold text-co2">CO₂</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ATP/NADPH input */}
            {currentStep >= 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-3 left-3 flex gap-1"
              >
                <motion.span
                  animate={currentStep >= 3 ? { opacity: [1, 0.3, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="px-1.5 py-0.5 bg-atp/20 text-atp text-[10px] font-bold rounded border border-atp/40"
                >ATP</motion.span>
                <motion.span
                  animate={currentStep >= 3 ? { opacity: [1, 0.3, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  className="px-1.5 py-0.5 bg-nadph/20 text-nadph text-[10px] font-bold rounded border border-nadph/40"
                >NADPH</motion.span>
              </motion.div>
            )}

            {/* RuBisCO enzyme indicator */}
            {currentStep >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-3 right-3 px-2 py-1 bg-primary/10 rounded border border-primary/30"
              >
                <span className="text-[9px] font-bold text-primary">🧬 RuBisCO</span>
              </motion.div>
            )}

            {/* Glucose output */}
            {currentStep >= 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="absolute right-3 bottom-3"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-1 px-2 py-1 bg-glucose/20 rounded-lg border border-glucose/40"
                >
                  <span className="text-lg">🍬</span>
                  <div>
                    <span className="text-xs font-bold text-glucose">Glukosa</span>
                    {showMiniSim && (
                      <div className="text-[8px] text-glucose/70">{glucoseRate}%</div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Low CO2 warning */}
            {showMiniSim && co2Slider < 10 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg"
              >
                <p className="text-sm text-foreground font-medium px-4 text-center">
                  ⚠️ CO₂ sangat rendah — siklus Calvin hampir berhenti
                </p>
              </motion.div>
            )}
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
