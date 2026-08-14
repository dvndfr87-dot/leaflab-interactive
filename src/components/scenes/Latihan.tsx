import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneLayout from "@/components/SceneLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw, GripVertical, Eye } from "lucide-react";
import { sounds } from "@/lib/sounds";

type ExerciseType = "drag-location" | "drag-io" | "drag-energy";

interface DragItem {
  id: string;
  label: string;
  emoji: string;
  correctZone: string;
  color: string;
}

interface Exercise {
  type: ExerciseType;
  title: string;
  instruction: string;
  items: DragItem[];
  zones: { id: string; label: string; emoji: string; color: string }[];
}

const exercises: Exercise[] = [
  {
    type: "drag-location",
    title: "EX-01 · Lokalisasi Reaksi",
    instruction: "Tempatkan tiap spesimen pada kompartemen kloroplas yang sesuai.",
    items: [
      { id: "rt", label: "Reaksi Terang", emoji: "hν", correctZone: "tilakoid", color: "bg-sunlight/25 border-sunlight/60 text-foreground" },
      { id: "rg", label: "Reaksi Gelap", emoji: "C₃", correctZone: "stroma", color: "bg-primary/20 border-primary/55 text-foreground" },
      { id: "atp-nadph", label: "ATP & NADPH", emoji: "e⁻", correctZone: "tilakoid", color: "bg-atp/25 border-atp/60 text-foreground" },
      { id: "glukosa", label: "Glukosa", emoji: "C₆", correctZone: "stroma", color: "bg-glucose/25 border-glucose/60 text-foreground" },
    ],
    zones: [
      { id: "tilakoid", label: "Kompartemen Tilakoid", emoji: "THY", color: "border-primary/60 bg-primary/12" },
      { id: "stroma", label: "Kompartemen Stroma", emoji: "STR", color: "border-sunlight/60 bg-sunlight/12" },
    ],
  },
  {
    type: "drag-io",
    title: "EX-02 · Substrat & Produk",
    instruction: "Klasifikasikan tiap reagen ke jalur reaksi yang sesuai.",
    items: [
      { id: "cahaya", label: "Cahaya", emoji: "hν", correctZone: "terang", color: "bg-sunlight/25 border-sunlight/60 text-foreground" },
      { id: "h2o", label: "H₂O", emoji: "H₂O", correctZone: "terang", color: "bg-water/25 border-water/60 text-foreground" },
      { id: "o2", label: "O₂", emoji: "O₂", correctZone: "terang", color: "bg-oxygen/25 border-oxygen/60 text-foreground" },
      { id: "atp-t", label: "ATP", emoji: "ATP", correctZone: "terang", color: "bg-atp/25 border-atp/60 text-foreground" },
      { id: "nadph-t", label: "NADPH", emoji: "NADPH", correctZone: "terang", color: "bg-nadph/25 border-nadph/60 text-foreground" },
      { id: "co2", label: "CO₂", emoji: "CO₂", correctZone: "gelap", color: "bg-co2/25 border-co2/60 text-foreground" },
      { id: "atp-g", label: "ATP", emoji: "ATP", correctZone: "gelap", color: "bg-atp/25 border-atp/60 text-foreground" },
      { id: "nadph-g", label: "NADPH", emoji: "NADPH", correctZone: "gelap", color: "bg-nadph/25 border-nadph/60 text-foreground" },
      { id: "glukosa2", label: "Glukosa", emoji: "C₆H₁₂O₆", correctZone: "gelap", color: "bg-glucose/25 border-glucose/60 text-foreground" },
    ],
    zones: [
      { id: "terang", label: "Jalur Reaksi Terang", emoji: "LR", color: "border-sunlight/60 bg-sunlight/12" },
      { id: "gelap", label: "Jalur Reaksi Gelap", emoji: "DR", color: "border-primary/60 bg-primary/12" },
    ],
  },
  {
    type: "drag-energy",
    title: "EX-03 · Energetika & Lokasi",
    instruction: "Klasifikasikan tiap pernyataan ke reaksi yang relevan.",
    items: [
      { id: "s1", label: "Menghasilkan ATP", emoji: "+ATP", correctZone: "terang2", color: "bg-atp/25 border-atp/60 text-foreground" },
      { id: "s2", label: "Membutuhkan cahaya", emoji: "hν", correctZone: "terang2", color: "bg-sunlight/25 border-sunlight/60 text-foreground" },
      { id: "s3", label: "Menghasilkan glukosa", emoji: "+C₆", correctZone: "gelap2", color: "bg-glucose/25 border-glucose/60 text-foreground" },
      { id: "s4", label: "Menggunakan CO₂", emoji: "−CO₂", correctZone: "gelap2", color: "bg-co2/25 border-co2/60 text-foreground" },
      { id: "s5", label: "Menghasilkan NADPH", emoji: "+NADPH", correctZone: "terang2", color: "bg-nadph/25 border-nadph/60 text-foreground" },
      { id: "s6", label: "Terjadi di Tilakoid", emoji: "THY", correctZone: "terang2", color: "bg-primary/20 border-primary/55 text-foreground" },
    ],
    zones: [
      { id: "terang2", label: "Jalur Reaksi Terang", emoji: "LR", color: "border-sunlight/60 bg-sunlight/12" },
      { id: "gelap2", label: "Jalur Reaksi Gelap", emoji: "DR", color: "border-primary/60 bg-primary/12" },
    ],
  },
];

const Latihan = ({ onBack, onGoHome }: { onBack: () => void; onGoHome?: () => void }) => {
  const [currentEx, setCurrentEx] = useState(0);
  // Store placements per exercise
  const [allPlacements, setAllPlacements] = useState<Record<number, Record<string, string>>>({ 0: {}, 1: {}, 2: {} });
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [touchDragItem, setTouchDragItem] = useState<string | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const exercise = exercises[currentEx];
  const placements = allPlacements[currentEx] || {};
  const placedItems = Object.keys(placements);
  const unplacedItems = exercise.items.filter(item => !placedItems.includes(item.id));

  const setPlacements = (updater: (prev: Record<string, string>) => Record<string, string>) => {
    setAllPlacements(prev => ({
      ...prev,
      [currentEx]: updater(prev[currentEx] || {}),
    }));
  };

  const handleDragStart = (itemId: string) => {
    sounds.pickup();
    setDraggedItem(itemId);
  };

  const handleDrop = useCallback((zoneId: string) => {
    const item = draggedItem || touchDragItem;
    if (item) {
      sounds.drop();
      setPlacements(prev => ({ ...prev, [item]: zoneId }));
      setDraggedItem(null);
      setTouchDragItem(null);
    }
  }, [draggedItem, touchDragItem, currentEx]);

  const handleRemoveFromZone = (itemId: string) => {
    if (showFinalScore) return;
    sounds.remove();
    setPlacements(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const handleTouchStart = (itemId: string, e: React.TouchEvent) => {
    setTouchDragItem(itemId);
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchDragItem) return;
    const touch = e.changedTouches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    const zone = elem?.closest("[data-zone-id]");
    if (zone) {
      const zoneId = zone.getAttribute("data-zone-id");
      if (zoneId) {
        sounds.drop();
        setPlacements(prev => ({ ...prev, [touchDragItem]: zoneId }));
      }
    }
    setTouchDragItem(null);
    touchStartPos.current = null;
  };

  const handleNextExercise = () => {
    if (currentEx < exercises.length - 1) {
      sounds.next();
      setCurrentEx(currentEx + 1);
    }
  };

  const handleReset = () => {
    sounds.reset();
    setPlacements(() => ({}));
  };

  // Check if all exercises are fully placed
  const allExercisesFilled = exercises.every((ex, i) => {
    const p = allPlacements[i] || {};
    return Object.keys(p).length >= ex.items.length;
  });

  const currentExFilled = placedItems.length >= exercise.items.length;

  // Calculate scores only when showing results
  const getScores = () => {
    return exercises.map((ex, i) => {
      const p = allPlacements[i] || {};
      return ex.items.filter(item => p[item.id] === item.correctZone).length;
    });
  };

  const scores = showFinalScore ? getScores() : [];
  const totalScore = scores.reduce((a, b) => a + b, 0);
  const totalItems = exercises.reduce((a, e) => a + e.items.length, 0);

  const renderItem = (item: DragItem, inZone: boolean, zoneCorrect?: boolean) => {
    const isCorrect = showFinalScore && zoneCorrect;
    const isWrong = showFinalScore && zoneCorrect === false;

    return (
      <motion.div
        key={item.id}
        layout
        draggable={!showFinalScore}
        onDragStart={() => !showFinalScore && handleDragStart(item.id)}
        onTouchStart={(e) => !showFinalScore && handleTouchStart(item.id, e)}
        onTouchEnd={(e) => !showFinalScore && handleTouchEnd(e)}
        whileHover={!showFinalScore ? { scale: 1.03, y: -1 } : {}}
        whileTap={!showFinalScore ? { scale: 0.97 } : {}}
        className={`group flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-md border font-medium text-sm select-none transition-all ${
          showFinalScore
            ? isCorrect
              ? "bg-primary/10 border-primary/50"
              : isWrong
              ? "bg-destructive/10 border-destructive/50"
              : item.color
            : `${item.color} ${!inZone ? "cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md" : "cursor-pointer"}`
        }`}
      >
        {!showFinalScore && !inZone && (
          <GripVertical className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        )}
        <span className="specimen-chip flex-shrink-0">{item.emoji}</span>
        <span className="text-xs md:text-[13px] text-foreground/90">{item.label}</span>
        {showFinalScore && (
          isCorrect
            ? <CheckCircle className="w-4 h-4 text-primary ml-auto flex-shrink-0" />
            : isWrong
            ? <XCircle className="w-4 h-4 text-destructive ml-auto flex-shrink-0" />
            : null
        )}
        {!showFinalScore && inZone && (
          <button onClick={(e) => { e.stopPropagation(); handleRemoveFromZone(item.id); }} className="ml-auto text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
            <XCircle className="w-3.5 h-3.5" />
          </button>
        )}
      </motion.div>
    );
  };

  return (
    <SceneLayout
      title="Stasiun Uji · Laboratorium Virtual"
      subtitle="Asesmen pemahaman fotosintesis"
      currentScene={6}
      totalScenes={7}
      onBack={onBack}
      showNav={true}
    >
      <div className="max-w-3xl mx-auto py-4 space-y-4">
        {/* Lab bench header strip */}
        <div className="lab-panel px-3 py-2 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="lab-led" />
            <span className="text-muted-foreground">WORKSTATION</span>
            <span className="text-foreground/80">PSY-LAB · 02</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-muted-foreground">
            <span>MODE: <span className="text-primary">{showFinalScore ? "REVIEW" : "ASSESS"}</span></span>
            <span>TASK <span className="text-foreground">{currentEx + 1}/{exercises.length}</span></span>
          </div>
        </div>

        {/* Exercise tabs as instrument selector */}
        <div className="grid grid-cols-3 gap-2">
          {exercises.map((ex, i) => {
            const p = allPlacements[i] || {};
            const filled = Object.keys(p).length >= ex.items.length;
            const code = i === 0 ? "EX-01" : i === 1 ? "EX-02" : "EX-03";
            return (
              <button
                key={i}
                onClick={() => { if (!showFinalScore) { sounds.tab(); setCurrentEx(i); } }}
                className={`relative px-3 py-2 rounded-md text-left transition-all border ${
                  i === currentEx
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : filled
                    ? "bg-primary/10 text-foreground border-primary/30"
                    : "bg-card text-muted-foreground border-border hover:border-foreground/30"
                }`}
              >
                <div className="font-mono text-[10px] tracking-widest opacity-80">{code}</div>
                <div className="text-xs font-semibold leading-tight mt-0.5">
                  {ex.type === "drag-location" ? "Lokasi" : ex.type === "drag-io" ? "I/O" : "Energetika"}
                </div>
                {filled && !showFinalScore && (
                  <span className="absolute top-1.5 right-1.5 lab-led" />
                )}
              </button>
            );
          })}
        </div>

        {!showFinalScore ? (
          <AnimatePresence mode="wait">
            <motion.div key={currentEx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="lab-panel lab-corner p-5 space-y-4 bg-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="lab-label mb-1">Prosedur</div>
                    <h3 className="font-bold text-foreground text-base md:text-lg">{exercise.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">{exercise.instruction}</p>
                  </div>
                  <div className="lcd-readout flex-shrink-0">
                    {placedItems.length.toString().padStart(2, "0")}/{exercise.items.length.toString().padStart(2, "0")}
                  </div>
                </div>

                {/* Specimen tray */}
                <div className="space-y-1.5">
                  <div className="lab-label flex items-center justify-between">
                    <span>Specimen Tray</span>
                    <span>{unplacedItems.length} item</span>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[52px] p-3 bg-foreground/[0.03] rounded-md border border-dashed border-foreground/15">
                    {unplacedItems.length > 0
                      ? unplacedItems.map(item => renderItem(item, false))
                      : <span className="text-xs text-muted-foreground italic self-center">Tray kosong — semua spesimen telah ditempatkan</span>}
                  </div>
                </div>

                {/* Drop compartments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exercise.zones.map(zone => {
                    const itemsInZone = exercise.items.filter(item => placements[item.id] === zone.id);
                    return (
                      <div
                        key={zone.id}
                        data-zone-id={zone.id}
                        onDragOver={e => e.preventDefault()}
                        onDrop={() => handleDrop(zone.id)}
                        className={`relative lab-corner rounded-md p-3 border-2 border-dashed min-h-[150px] transition-all ${zone.color} ${
                          draggedItem || touchDragItem ? "ring-2 ring-primary/40 border-primary/60" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-foreground/10">
                          <span className="specimen-chip">{zone.emoji}</span>
                          <h4 className="text-xs font-semibold text-foreground tracking-wide">{zone.label}</h4>
                          <span className="font-mono text-[10px] text-muted-foreground">n={itemsInZone.length}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {itemsInZone.map(item => renderItem(item, true))}
                          {itemsInZone.length === 0 && (
                            <div className="text-center text-[11px] text-muted-foreground py-5 font-mono">
                              [ drop zone ]
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-foreground/10">
                  <Button variant="outline" size="sm" onClick={handleReset} className="gap-1 font-mono text-xs">
                    <RotateCcw className="w-3 h-3" />
                    RESET
                  </Button>
                  {currentEx < exercises.length - 1 ? (
                    <Button size="sm" onClick={handleNextExercise} disabled={!currentExFilled} className="bg-primary text-primary-foreground font-mono text-xs">
                      NEXT TASK →
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowFinalScore(true);
                        sounds.reveal();
                        const sc = exercises.map((ex, i) => {
                          const p = allPlacements[i] || {};
                          return ex.items.filter(item => p[item.id] === item.correctZone).length;
                        });
                        const total = sc.reduce((a, b) => a + b, 0);
                        const totalI = exercises.reduce((a, e) => a + e.items.length, 0);
                        const pct = total / totalI;
                        setTimeout(() => {
                          if (pct >= 0.8) sounds.success();
                          else if (pct < 0.5) sounds.fail();
                          else sounds.okay();
                        }, 600);
                      }}
                      disabled={!allExercisesFilled}
                      className="bg-primary text-primary-foreground gap-1 font-mono text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      ANALYZE
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          /* ── FINAL SCORE VIEW ── */
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            {/* Overall score — diagnostic report */}
            <div className="lab-panel lab-corner p-6 bg-card">
              <div className="flex items-center justify-between mb-3">
                <div className="lab-label">Diagnostic Report</div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                  <span className="lab-led" /> ANALYSIS COMPLETE
                </div>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Skor Total</p>
                  <p className="text-5xl font-bold text-primary font-mono mt-1 leading-none">
                    {totalScore}<span className="text-2xl text-muted-foreground">/{totalItems}</span>
                  </p>
                </div>
                <div className="lcd-readout text-base">
                  {Math.round((totalScore / totalItems) * 100)}%
                </div>
              </div>
              <div className="w-full bg-foreground/10 rounded-full h-2 mt-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(totalScore / totalItems) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3 font-mono">
                {totalScore === totalItems
                  ? "// Status: Mastery — pemahaman konsep telah tervalidasi."
                  : totalScore >= totalItems * 0.7
                  ? "// Status: Proficient — pemahaman baik, masih ada ruang penajaman."
                  : "// Status: Review required — tinjau kembali materi reaksi terang & gelap."}
              </p>
            </div>

            {/* Per-exercise breakdown */}
            {exercises.map((ex, i) => {
              const p = allPlacements[i] || {};
              const exScore = scores[i];
              return (
                <div key={i} className="lab-panel p-4 bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-foreground">{ex.title}</h4>
                    <span className={`font-mono text-sm font-bold ${exScore === ex.items.length ? "text-primary" : "text-destructive"}`}>
                      {exScore}/{ex.items.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {ex.zones.map(zone => {
                      const itemsInZone = ex.items.filter(item => p[item.id] === zone.id);
                      return (
                        <div key={zone.id} className={`rounded-md p-3 border ${zone.color}`}>
                          <h5 className="text-[11px] font-semibold text-foreground mb-2 flex items-center justify-between">
                            <span className="specimen-chip">{zone.emoji}</span>
                            <span>{zone.label}</span>
                          </h5>
                          <div className="flex flex-col gap-1">
                            {itemsInZone.map(item => renderItem(item, true, item.correctZone === zone.id))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Retry / Home */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={() => {
                  sounds.reset();
                  setShowFinalScore(false);
                  setCurrentEx(0);
                  setAllPlacements({ 0: {}, 1: {}, 2: {} });
                }}
                variant="outline"
                className="gap-1 font-mono text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                RUN AGAIN
              </Button>
              {onGoHome && (
                <Button
                  onClick={() => { sounds.start(); onGoHome(); }}
                  className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs"
                >
                  ← MAIN MENU
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </SceneLayout>
  );
};

export default Latihan;
