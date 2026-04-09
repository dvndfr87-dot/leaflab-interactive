import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneLayout from "@/components/SceneLayout";
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

  return (
    <SceneLayout
      title="Reaksi Gelap (Siklus Calvin)"
      subtitle="Lokasi: Stroma — Tidak memerlukan cahaya langsung"
      currentScene={4}
      totalScenes={7}
      onBack={onBack}
      onNext={currentStep === steps.length - 1 ? onNext : undefined}
      nextLabel={currentStep === steps.length - 1 ? "Ke Rangkuman" : undefined}
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

        {/* Animation visualization - Calvin Cycle */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h4 className="font-semibold text-sm text-foreground mb-3">Visualisasi Siklus Calvin</h4>
          <div className="relative h-40 bg-gradient-to-br from-sunlight/5 to-primary/5 rounded-lg overflow-hidden flex items-center justify-center">
            {/* Central cycle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-full border-2 border-dashed border-primary/40"
            />
            <div className="absolute text-[10px] text-muted-foreground font-medium">Siklus Calvin</div>

            {/* CO2 input */}
            {currentStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-4 left-4 flex items-center gap-1"
              >
                <motion.span
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-sm"
                >💨</motion.span>
                <span className="text-xs font-bold text-co2">CO₂</span>
              </motion.div>
            )}

            {/* ATP input */}
            {currentStep >= 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-3 left-4 flex gap-1"
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

            {/* Glucose output */}
            {currentStep >= 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-1 px-2 py-1 bg-glucose/20 rounded-lg border border-glucose/40"
                >
                  <span className="text-lg">🍬</span>
                  <span className="text-xs font-bold text-glucose">Glukosa</span>
                </motion.div>
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
