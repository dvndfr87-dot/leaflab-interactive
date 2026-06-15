import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneLayout from "@/components/SceneLayout";
import LightReactionLab from "@/components/lab/LightReactionLab";
import InfoLabel from "@/components/lab/InfoLabel";
import { lightInfo } from "@/components/lab/infoEntries";
import thylakoidImg from "@/assets/thylakoid-reaction.jpg";
import { sounds } from "@/lib/sounds";

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
    desc: "Elektron bergerak melalui rantai transpor elektron (ETC) dari Fotosistem II → plastoquinon → sitokrom b6f → plastosianin → Fotosistem I.",
    icon: "⚡",
    color: "bg-atp/20 border-atp",
  },
  {
    title: "6. ATP & NADPH Terbentuk",
    desc: "Energi elektron digunakan untuk membentuk ATP (melalui kemiosmosis) dan NADPH — \"baterai\" energi untuk reaksi gelap.",
    icon: "🔋",
    color: "bg-primary/20 border-primary",
  },
];

const ReaksiTerang = ({ onNext, onBack }: ReaksiTerangProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [light, setLight] = useState(12);   // 0..20
  const [water, setWater] = useState(60);   // 0..100
  const [showMiniSim, setShowMiniSim] = useState(false);

  // Visual derivations (kept for the existing animation).
  const lightLevel = (light / 20) * 100;
  const bubbleCount = Math.max(1, Math.floor((lightLevel / 100) * 8));
  const atpRate = Math.round(Math.min(100, lightLevel * 0.9 + water * 0.2));
  const rayCount = Math.max(1, Math.ceil(lightLevel / 15));

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
        <figure className="m-0">
          <div className="rounded-xl overflow-hidden shadow-md">
            <img src={thylakoidImg} alt="Diagram reaksi terang fotosintesis pada membran tilakoid" className="w-full h-48 object-cover" loading="lazy" width={900} height={600} />
          </div>
          <figcaption className="mt-1.5 text-[11px] text-muted-foreground text-center italic">
            Sumber: Ilustrasi Virtual Lab Fotosintesis (2026)
          </figcaption>
        </figure>

        {/* Step progress */}
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <button key={i} onClick={() => { sounds.step(); setCurrentStep(i); }} className={`flex-1 h-2 rounded-full transition-colors cursor-pointer ${i <= currentStep ? "bg-primary" : "bg-muted"}`} />
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
          <button onClick={() => { sounds.back(); setCurrentStep(Math.max(0, currentStep - 1)); }} disabled={currentStep === 0} className="px-4 py-2 text-sm rounded-lg bg-muted text-muted-foreground disabled:opacity-40 hover:bg-muted/80 transition-colors">← Sebelumnya</button>
          <span className="text-xs text-muted-foreground self-center">Tahap {currentStep + 1} / {steps.length}</span>
          <button onClick={() => { sounds.step(); setCurrentStep(Math.min(steps.length - 1, currentStep + 1)); }} disabled={currentStep === steps.length - 1} className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors">Berikutnya →</button>
        </div>

        {/* ===== DETAILED ANIMATION PANEL ===== */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <span className="lab-led" />
              Visualisasi Membran Tilakoid
            </h4>
            <button onClick={() => { sounds.click(); setShowMiniSim(!showMiniSim); }} className="font-mono text-[10px] tracking-widest text-primary hover:underline">
              {showMiniSim ? "▾ CLOSE PANEL" : "▸ CONTROL PANEL"}
            </button>
          </div>

          {/* Light intensity instrument panel */}
          <AnimatePresence>
            {showMiniSim && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
                <LightReactionLab light={light} setLight={setLight} water={water} setWater={setWater} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main visualization — taller, more detailed */}
          <div
            className="relative h-64 md:h-72 rounded-lg overflow-hidden border border-border/50 select-none"
            style={{
              background: `linear-gradient(180deg, 
                hsl(42 95% 60% / ${Math.min(lightLevel / 200, 0.45)}) 0%, 
                hsl(142 45% 38% / 0.06) 40%, 
                hsl(200 70% 55% / 0.08) 100%)`
            }}
          >
            {/* ── SUN + RAYS ── */}
            <motion.div animate={{ opacity: Math.max(0.15, lightLevel / 100) }} className="absolute top-2 left-3 z-10">
              <motion.div animate={{ rotate: [0, 15, 0], scale: [0.9, 1.05, 0.9] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="text-3xl drop-shadow-lg">
                ☀️
              </motion.div>
            </motion.div>

            {/* Animated sun rays hitting tilakoid */}
            {currentStep >= 0 && lightLevel > 10 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 280">
                {Array.from({ length: rayCount }, (_, i) => {
                  const startX = 40 + i * 3;
                  const startY = 30 + i * 2;
                  const endX = 120 + i * 18;
                  const endY = 115;
                  return (
                    <motion.line
                      key={i}
                      x1={startX} y1={startY} x2={endX} y2={endY}
                      stroke="hsl(42 95% 60%)"
                      strokeWidth={1.2}
                      strokeLinecap="round"
                      animate={{ opacity: [0.1, 0.4 * (lightLevel / 100), 0.1] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                  );
                })}
              </svg>
            )}

            {/* ── LUMEN label (inside tilakoid) ── */}
            <div className="absolute top-[42%] left-1/2 -translate-x-1/2 text-[8px] text-primary/60 font-semibold tracking-wider">LUMEN</div>

            {/* ── TILAKOID MEMBRANE (double layer) ── */}
            <div className="absolute top-[38%] left-[10%] right-[10%]">
              {/* Upper membrane */}
              <div className="h-3 bg-primary/40 rounded-full relative overflow-hidden">
                <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-sunlight/30 to-transparent w-1/3" />
              </div>

              {/* Fotosystem II */}
              <motion.div
                animate={currentStep >= 0 && lightLevel > 15 ? { boxShadow: [`0 0 4px hsl(142 45% 38% / 0.3)`, `0 0 12px hsl(142 45% 38% / ${lightLevel / 150})`, `0 0 4px hsl(142 45% 38% / 0.3)`] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 left-[8%] w-14 h-7 bg-primary/50 rounded-md border border-primary/60 flex items-center justify-center"
              >
                <span className="text-[8px] font-bold text-primary-foreground leading-none">PSII</span>
              </motion.div>

              {/* Plastoquinone pool */}
              {currentStep >= 4 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-1 left-[30%] flex gap-0.5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ x: [0, 12, 24], opacity: [1, 0.6, 0.2] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                      className="w-2 h-2 rounded-full bg-accent/70"
                    />
                  ))}
                  <span className="text-[7px] text-accent font-medium ml-1 self-center">PQ</span>
                </motion.div>
              )}

              {/* Cytochrome b6f */}
              {currentStep >= 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2 left-[48%] w-12 h-7 bg-accent/40 rounded-md border border-accent/50 flex items-center justify-center"
                >
                  <span className="text-[7px] font-bold text-foreground leading-none">Cyt b6f</span>
                </motion.div>
              )}

              {/* Plastocyanin */}
              {currentStep >= 4 && (
                <motion.div className="absolute -top-1 left-[66%] flex gap-0.5">
                  {[0, 1].map(i => (
                    <motion.div
                      key={i}
                      animate={{ x: [0, 8, 16], opacity: [1, 0.6, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.4 }}
                      className="w-1.5 h-1.5 rounded-full bg-water/70"
                    />
                  ))}
                  <span className="text-[7px] text-water font-medium ml-0.5 self-center">PC</span>
                </motion.div>
              )}

              {/* Fotosystem I */}
              <motion.div
                animate={currentStep >= 4 && lightLevel > 15 ? { boxShadow: [`0 0 4px hsl(280 55% 55% / 0.3)`, `0 0 10px hsl(280 55% 55% / ${lightLevel / 180})`, `0 0 4px hsl(280 55% 55% / 0.3)`] } : {}}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-2 right-[8%] w-14 h-7 bg-atp/30 rounded-md border border-atp/50 flex items-center justify-center"
              >
                <span className="text-[8px] font-bold text-foreground leading-none">PSI</span>
              </motion.div>

              {/* ATP synthase */}
              {currentStep >= 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-5 left-[38%]"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-7 h-7 rounded-full border-2 border-dashed border-atp/60 flex items-center justify-center"
                  >
                    <div className="w-2 h-2 rounded-full bg-atp/80" />
                  </motion.div>
                  <span className="text-[7px] text-atp font-bold block text-center mt-0.5">ATP Sintase</span>
                </motion.div>
              )}

              {/* Lower membrane */}
              <div className="h-3 bg-primary/40 rounded-full mt-5 relative overflow-hidden">
                <motion.div animate={{ x: ["100%", "-100%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent w-1/3" />
              </div>
            </div>

            {/* ── STROMA label ── */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground font-semibold tracking-wider">STROMA</div>

            {/* ── WATER MOLECULES entering ── */}
            {currentStep >= 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-[26%] left-[6%]">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ x: [0, 20, 40], opacity: [0.8, 0.5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8 }}
                    className="flex items-center gap-0.5 mb-0.5"
                  >
                    <span className="text-xs">💧</span>
                    <span className="text-[8px] font-bold text-water">H₂O</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ── PHOTOLYSIS: splitting water ── */}
            {currentStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-[28%] left-[18%]"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-lg"
                >⚡</motion.div>
                <div className="flex gap-1 mt-0.5">
                  <span className="text-[7px] bg-foreground/10 px-1 rounded text-foreground font-medium">2H⁺</span>
                  <span className="text-[7px] bg-oxygen/20 px-1 rounded text-oxygen font-medium">½O₂</span>
                  <span className="text-[7px] bg-atp/20 px-1 rounded text-atp font-medium">e⁻</span>
                </div>
              </motion.div>
            )}

            {/* ── O₂ BUBBLES rising ── */}
            {currentStep >= 3 && (
              <div className="absolute top-0 right-[15%] w-20 h-full pointer-events-none">
                {Array.from({ length: bubbleCount }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 0.7, 0.5, 0],
                      y: [160, 100, 40, -10],
                      x: [0, Math.sin(i * 1.5) * 10, Math.sin(i * 2) * -8, Math.sin(i) * 6],
                      scale: [0.5, 1, 0.9, 0.6],
                    }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.45, ease: "easeOut" }}
                    className="absolute rounded-full bg-oxygen/40 border border-oxygen/50"
                    style={{ width: 6 + (i % 3) * 3, height: 6 + (i % 3) * 3, left: 4 + (i % 4) * 12 }}
                  />
                ))}
                <motion.span
                  animate={{ y: [0, -3, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-1 right-0 text-[10px] font-bold text-oxygen"
                >O₂ ↑</motion.span>
              </div>
            )}

            {/* ── ELECTRON TRANSPORT: dots moving along ETC ── */}
            {currentStep >= 4 && (
              <svg className="absolute top-[36%] left-[12%] w-[76%] h-8 pointer-events-none" viewBox="0 0 300 30">
                {/* Path line */}
                <path d="M 20 15 Q 75 5 110 15 Q 145 25 180 15 Q 215 5 260 15" fill="none" stroke="hsl(280 55% 55% / 0.25)" strokeWidth="1.5" strokeDasharray="4 3" />
                {/* Moving electrons */}
                {[0, 1, 2, 3].map(i => (
                  <motion.circle
                    key={i}
                    r={2.5}
                    fill="hsl(280 55% 55%)"
                    animate={{
                      cx: [20, 75, 110, 145, 180, 215, 260],
                      cy: [15, 8, 15, 22, 15, 8, 15],
                    }}
                    transition={{
                      duration: Math.max(1.5, 4 - (lightLevel / 40)),
                      repeat: Infinity,
                      delay: i * 0.6,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </svg>
            )}

            {/* ── H⁺ PROTON GRADIENT (chemiosmosis) ── */}
            {currentStep >= 5 && (
              <div className="absolute top-[44%] left-[12%] right-[12%] flex justify-around pointer-events-none">
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.25 }}
                    className="text-[8px] font-bold text-foreground/50"
                  >H⁺</motion.div>
                ))}
              </div>
            )}

            {/* ── ATP & NADPH OUTPUT ── */}
            {currentStep >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-8 right-[8%] flex gap-2"
              >
                <motion.div
                  animate={{ y: [0, -5, 0], boxShadow: ["0 0 6px hsl(280 55% 55% / 0.2)", "0 0 14px hsl(280 55% 55% / 0.5)", "0 0 6px hsl(280 55% 55% / 0.2)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-2.5 py-1.5 bg-atp/15 text-atp text-xs font-bold rounded-lg border border-atp/40"
                >
                  ATP {showMiniSim ? `(${atpRate}%)` : ""}
                </motion.div>
                <motion.div
                  animate={{ y: [0, -5, 0], boxShadow: ["0 0 6px hsl(320 50% 55% / 0.2)", "0 0 14px hsl(320 50% 55% / 0.5)", "0 0 6px hsl(320 50% 55% / 0.2)"] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                  className="px-2.5 py-1.5 bg-nadph/15 text-nadph text-xs font-bold rounded-lg border border-nadph/40"
                >
                  NADPH
                </motion.div>
              </motion.div>
            )}

            {/* ── ARROW: ATP/NADPH → stroma ── */}
            {currentStep >= 5 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="absolute bottom-4 right-[30%] text-[9px] text-muted-foreground flex items-center gap-1"
              >
                → ke Siklus Calvin
              </motion.div>
            )}

            {/* Low light overlay */}
            {showMiniSim && lightLevel < 10 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-lg z-20">
                <p className="text-sm text-foreground font-medium px-4 text-center">🌙 Cahaya sangat redup — reaksi terang hampir berhenti</p>
              </motion.div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {[
              { label: "PSII / PSI", color: "bg-primary/40" },
              { label: "Elektron (e⁻)", color: "bg-atp/60" },
              { label: "O₂", color: "bg-oxygen/60" },
              { label: "H₂O", color: "bg-water/60" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>

          {/* Label Interaktif — klik untuk penjelasan biologis */}
          <div className="mt-4 pt-3 border-t border-border/60">
            <div className="flex items-center justify-between mb-2">
              <span className="lab-label">Label Interaktif</span>
              <span className="text-[11px] text-muted-foreground italic">klik label untuk penjelasan</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.values(lightInfo).map((entry) => (
                <InfoLabel key={entry.id} entry={entry} className="px-2 py-1 border border-border bg-card text-foreground text-xs">
                  <span className="font-semibold">{entry.label}</span>
                </InfoLabel>
              ))}
            </div>
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
