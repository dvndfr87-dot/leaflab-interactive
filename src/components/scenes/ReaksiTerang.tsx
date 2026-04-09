import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneLayout from "@/components/SceneLayout";
import thylakoidImg from "@/assets/thylakoid-reaction.jpg";

interface ReaksiTerangProps {
  onNext: () => void;
  onBack: () => void;
}

const steps = [
  {
    title: "1. Cahaya Masuk",
    desc: "Cahaya matahari mengenai membran tilakoid dan diserap oleh klorofil pada fotosistem II.",
    icon: "☀️",
    color: "bg-sunlight/20 border-sunlight",
  },
  {
    title: "2. Air Masuk (H₂O)",
    desc: "Molekul air (H₂O) masuk ke dalam tilakoid sebagai bahan baku reaksi terang.",
    icon: "💧",
    color: "bg-water/20 border-water",
  },
  {
    title: "3. Fotolisis Air",
    desc: "Air dipecah oleh energi cahaya (fotolisis): H₂O → 2H⁺ + ½O₂ + elektron. Proses ini melepaskan oksigen.",
    icon: "⚡",
    color: "bg-accent/20 border-accent",
  },
  {
    title: "4. O₂ Keluar",
    desc: "Oksigen (O₂) dilepaskan sebagai produk sampingan. Inilah oksigen yang kita hirup!",
    icon: "🫧",
    color: "bg-oxygen/20 border-oxygen",
  },
  {
    title: "5. Elektron Bergerak",
    desc: "Elektron bergerak melalui rantai transpor elektron, meningkatkan energi secara bertahap.",
    icon: "⚡",
    color: "bg-atp/20 border-atp",
  },
  {
    title: "6. ATP & NADPH Terbentuk",
    desc: "Energi elektron digunakan untuk membentuk ATP dan NADPH — \"baterai\" energi yang akan digunakan di reaksi gelap.",
    icon: "🔋",
    color: "bg-primary/20 border-primary",
  },
];

const ReaksiTerang = ({ onNext, onBack }: ReaksiTerangProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <SceneLayout
      title="Reaksi Terang"
      subtitle="Lokasi: Tilakoid — Membutuhkan cahaya"
      currentScene={3}
      totalScenes={7}
      onBack={onBack}
      onNext={currentStep === steps.length - 1 ? onNext : undefined}
      nextLabel={currentStep === steps.length - 1 ? "Ke Reaksi Gelap" : undefined}
    >
      <div className="max-w-2xl mx-auto py-4 space-y-4">
        {/* Reference image */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <img
            src={thylakoidImg}
            alt="Reaksi Terang di Tilakoid"
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

        {/* Animation visualization */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h4 className="font-semibold text-sm text-foreground mb-3">Visualisasi Proses</h4>
          <div className="relative h-32 bg-gradient-to-r from-primary/5 to-sunlight/10 rounded-lg overflow-hidden">
            {/* Sun rays */}
            {currentStep >= 0 && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-2 left-2"
              >
                <motion.div
                  animate={{ rotate: [0, 10, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl"
                >☀️</motion.div>
                {[1,2,3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ width: ["20px", "60px", "20px"], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="h-0.5 bg-sunlight rounded-full mt-1"
                  />
                ))}
              </motion.div>
            )}

            {/* Water */}
            {currentStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-3 left-16 text-sm font-medium text-water"
              >
                💧 H₂O
              </motion.div>
            )}

            {/* Tilakoid */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex flex-col gap-1">
                {[1,2,3].map(i => (
                  <motion.div
                    key={i}
                    animate={currentStep >= 2 ? { backgroundColor: ["hsl(142,45%,38%)", "hsl(42,95%,60%)", "hsl(142,45%,38%)"] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="w-20 h-2.5 bg-primary/60 rounded-full"
                  />
                ))}
              </div>
              <p className="text-[10px] text-center text-muted-foreground mt-1">Tilakoid</p>
            </div>

            {/* O2 bubbles */}
            {currentStep >= 3 && (
              <div className="absolute top-4 right-20">
                {[0,1,2].map(i => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: [0.8, 0], y: [20, -30], scale: [1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
                    className="w-3 h-3 rounded-full bg-oxygen/60 border border-oxygen absolute"
                    style={{ left: i * 12 }}
                  />
                ))}
                <span className="text-xs text-oxygen font-medium ml-10">O₂</span>
              </div>
            )}

            {/* ATP & NADPH */}
            {currentStep >= 5 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute bottom-3 right-4 flex gap-2"
              >
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="px-2 py-1 bg-atp/20 text-atp text-xs font-bold rounded-md border border-atp/40"
                >ATP</motion.span>
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  className="px-2 py-1 bg-nadph/20 text-nadph text-xs font-bold rounded-md border border-nadph/40"
                >NADPH</motion.span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-card rounded-lg p-4 border border-border text-sm">
          <h4 className="font-semibold text-foreground mb-2">📝 Ringkasan Reaksi Terang</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-primary/5 rounded-lg p-2">
              <span className="font-semibold text-foreground">Input:</span>
              <p className="text-muted-foreground">Cahaya + H₂O</p>
            </div>
            <div className="bg-primary/5 rounded-lg p-2">
              <span className="font-semibold text-foreground">Output:</span>
              <p className="text-muted-foreground">O₂ + ATP + NADPH</p>
            </div>
          </div>
        </div>
      </div>
    </SceneLayout>
  );
};

export default ReaksiTerang;
