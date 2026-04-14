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
    title: "Latihan 1: Lokasi Reaksi",
    instruction: "Seret setiap item ke lokasi yang tepat di dalam kloroplas!",
    items: [
      { id: "rt", label: "Reaksi Terang", emoji: "☀️", correctZone: "tilakoid", color: "bg-sunlight/15 border-sunlight/40 text-foreground" },
      { id: "rg", label: "Reaksi Gelap", emoji: "🌙", correctZone: "stroma", color: "bg-primary/10 border-primary/30 text-foreground" },
      { id: "atp-nadph", label: "ATP & NADPH", emoji: "🔋", correctZone: "tilakoid", color: "bg-atp/15 border-atp/40 text-foreground" },
      { id: "glukosa", label: "Glukosa", emoji: "🍬", correctZone: "stroma", color: "bg-glucose/15 border-glucose/40 text-foreground" },
    ],
    zones: [
      { id: "tilakoid", label: "Tilakoid", emoji: "📚", color: "border-primary/40 bg-primary/5" },
      { id: "stroma", label: "Stroma", emoji: "💧", color: "border-sunlight/40 bg-sunlight/5" },
    ],
  },
  {
    type: "drag-io",
    title: "Latihan 2: Input dan Output",
    instruction: "Kelompokkan zat-zat ke reaksi yang sesuai! Beberapa item bisa masuk ke kedua reaksi.",
    items: [
      { id: "cahaya", label: "Cahaya", emoji: "☀️", correctZone: "terang", color: "bg-sunlight/15 border-sunlight/40 text-foreground" },
      { id: "h2o", label: "H₂O", emoji: "💧", correctZone: "terang", color: "bg-water/15 border-water/40 text-foreground" },
      { id: "o2", label: "O₂", emoji: "🫧", correctZone: "terang", color: "bg-oxygen/15 border-oxygen/40 text-foreground" },
      { id: "atp-t", label: "ATP", emoji: "⚡", correctZone: "terang", color: "bg-atp/15 border-atp/40 text-foreground" },
      { id: "nadph-t", label: "NADPH", emoji: "🔋", correctZone: "terang", color: "bg-nadph/15 border-nadph/40 text-foreground" },
      { id: "co2", label: "CO₂", emoji: "💨", correctZone: "gelap", color: "bg-co2/15 border-co2/40 text-foreground" },
      { id: "atp-g", label: "ATP", emoji: "⚡", correctZone: "gelap", color: "bg-atp/15 border-atp/40 text-foreground" },
      { id: "nadph-g", label: "NADPH", emoji: "🔋", correctZone: "gelap", color: "bg-nadph/15 border-nadph/40 text-foreground" },
      { id: "glukosa2", label: "Glukosa", emoji: "🍬", correctZone: "gelap", color: "bg-glucose/15 border-glucose/40 text-foreground" },
    ],
    zones: [
      { id: "terang", label: "Reaksi Terang", emoji: "☀️", color: "border-sunlight/40 bg-sunlight/5" },
      { id: "gelap", label: "Reaksi Gelap", emoji: "🌙", color: "border-primary/40 bg-primary/5" },
    ],
  },
  {
    type: "drag-energy",
    title: "Latihan 3: Sumber & Hasil Energi",
    instruction: "Tempatkan setiap pernyataan ke reaksi yang tepat!",
    items: [
      { id: "s1", label: "Menghasilkan ATP", emoji: "⚡", correctZone: "terang2", color: "bg-atp/15 border-atp/40 text-foreground" },
      { id: "s2", label: "Membutuhkan cahaya", emoji: "☀️", correctZone: "terang2", color: "bg-sunlight/15 border-sunlight/40 text-foreground" },
      { id: "s3", label: "Menghasilkan glukosa", emoji: "🍬", correctZone: "gelap2", color: "bg-glucose/15 border-glucose/40 text-foreground" },
      { id: "s4", label: "Menggunakan CO₂", emoji: "💨", correctZone: "gelap2", color: "bg-co2/15 border-co2/40 text-foreground" },
      { id: "s5", label: "Menghasilkan NADPH", emoji: "🔋", correctZone: "terang2", color: "bg-nadph/15 border-nadph/40 text-foreground" },
      { id: "s6", label: "Terjadi di Tilakoid", emoji: "📚", correctZone: "terang2", color: "bg-primary/10 border-primary/30 text-foreground" },
    ],
    zones: [
      { id: "terang2", label: "Reaksi Terang", emoji: "☀️", color: "border-sunlight/40 bg-sunlight/5" },
      { id: "gelap2", label: "Reaksi Gelap", emoji: "🌙", color: "border-primary/40 bg-primary/5" },
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
        whileHover={!showFinalScore ? { scale: 1.05, y: -2 } : {}}
        whileTap={!showFinalScore ? { scale: 0.95 } : {}}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 font-medium text-sm select-none transition-all ${
          showFinalScore
            ? isCorrect
              ? "bg-primary/10 border-primary/50 shadow-sm"
              : isWrong
              ? "bg-destructive/10 border-destructive/50 shadow-sm"
              : item.color
            : `${item.color} ${!inZone ? "cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg" : "cursor-pointer"}`
        }`}
      >
        {!showFinalScore && !inZone && <GripVertical className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
        <span className="text-lg flex-shrink-0">{item.emoji}</span>
        <span className="text-xs md:text-sm">{item.label}</span>
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
      title="Latihan Interaktif"
      subtitle="Uji pemahamanmu tentang fotosintesis"
      currentScene={6}
      totalScenes={7}
      onBack={onBack}
      showNav={true}
    >
      <div className="max-w-2xl mx-auto py-4 space-y-4">
        {/* Exercise tabs */}
        <div className="flex gap-2">
          {exercises.map((ex, i) => {
            const p = allPlacements[i] || {};
            const filled = Object.keys(p).length >= ex.items.length;
            return (
              <button
                key={i}
                onClick={() => { if (!showFinalScore) { sounds.tab(); setCurrentEx(i); } }}
                className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  i === currentEx
                    ? "bg-primary text-primary-foreground shadow-md"
                    : filled
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                <span className="text-base block mb-0.5">{i === 0 ? "📍" : i === 1 ? "🔬" : "⚡"}</span>
                {i + 1}. {ex.type === "drag-location" ? "Lokasi" : ex.type === "drag-io" ? "Input/Output" : "Energi"}
                {filled && !showFinalScore && " ✓"}
              </button>
            );
          })}
        </div>

        {!showFinalScore ? (
          <AnimatePresence mode="wait">
            <motion.div key={currentEx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-card rounded-xl p-5 border border-border space-y-4">
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-1">{exercise.title}</h3>
                  <p className="text-sm text-muted-foreground">{exercise.instruction}</p>
                </div>

                {/* Unplaced items */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {unplacedItems.length > 0 ? "Seret item ke zona yang benar:" : "Semua item sudah ditempatkan ✓"}
                  </p>
                  <div className="flex flex-wrap gap-2 min-h-[48px] p-3 bg-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/20">
                    {unplacedItems.map(item => renderItem(item, false))}
                  </div>
                </div>

                {/* Drop zones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exercise.zones.map(zone => {
                    const itemsInZone = exercise.items.filter(item => placements[item.id] === zone.id);
                    return (
                      <div
                        key={zone.id}
                        data-zone-id={zone.id}
                        onDragOver={e => e.preventDefault()}
                        onDrop={() => handleDrop(zone.id)}
                        className={`rounded-xl p-4 border-2 border-dashed min-h-[140px] transition-all ${zone.color} ${
                          draggedItem || touchDragItem ? "ring-2 ring-primary/30 border-primary/50" : ""
                        }`}
                      >
                        <h4 className="font-bold text-sm text-foreground mb-3 text-center flex items-center justify-center gap-2">
                          <span className="text-xl">{zone.emoji}</span>
                          {zone.label}
                        </h4>
                        <div className="flex flex-col gap-1.5">
                          {itemsInZone.map(item => renderItem(item, true))}
                          {itemsInZone.length === 0 && (
                            <div className="text-center text-xs text-muted-foreground py-4 border border-dashed border-muted-foreground/20 rounded-lg">
                              Seret item ke sini
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2">
                  <Button variant="outline" size="sm" onClick={handleReset} className="gap-1">
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </Button>
                  {currentEx < exercises.length - 1 ? (
                    <Button size="sm" onClick={handleNextExercise} disabled={!currentExFilled} className="bg-primary text-primary-foreground">
                      Latihan Berikutnya →
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowFinalScore(true);
                        // Play score-based sound after a brief delay for reveal
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
                      className="bg-primary text-primary-foreground gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Lihat Skor
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          /* ── FINAL SCORE VIEW ── */
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            {/* Overall score */}
            <div className="bg-gradient-to-br from-primary/10 to-glucose/10 rounded-xl p-6 border border-primary/20 text-center">
              <h3 className="text-2xl font-bold text-primary mb-2">🎉 Hasil Latihan</h3>
              <p className="text-foreground text-sm mb-1">Total Skor Keseluruhan:</p>
              <p className="text-4xl font-bold text-primary my-2">
                {totalScore} / {totalItems}
              </p>
              <div className="w-full bg-muted rounded-full h-3 mt-3 mb-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(totalScore / totalItems) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {totalScore === totalItems
                  ? "Sempurna! Kamu sudah menguasai materi fotosintesis! 🌟"
                  : totalScore >= totalItems * 0.7
                  ? "Bagus sekali! Terus tingkatkan pemahamanmu! 💪"
                  : "Jangan menyerah! Coba ulangi lagi untuk memahami lebih baik. 📖"}
              </p>
            </div>

            {/* Per-exercise breakdown with correct/wrong */}
            {exercises.map((ex, i) => {
              const p = allPlacements[i] || {};
              const exScore = scores[i];
              return (
                <div key={i} className="bg-card rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-foreground">{ex.title}</h4>
                    <span className={`text-sm font-bold ${exScore === ex.items.length ? "text-primary" : "text-destructive"}`}>
                      {exScore} / {ex.items.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {ex.zones.map(zone => {
                      const itemsInZone = ex.items.filter(item => p[item.id] === zone.id);
                      return (
                        <div key={zone.id} className={`rounded-lg p-3 border ${zone.color}`}>
                          <h5 className="text-xs font-semibold text-foreground mb-2 text-center">{zone.emoji} {zone.label}</h5>
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

            {/* Retry button */}
            <div className="text-center">
              <Button
                onClick={() => {
                  sounds.reset();
                  setShowFinalScore(false);
                  setCurrentEx(0);
                  setAllPlacements({ 0: {}, 1: {}, 2: {} });
                }}
                variant="outline"
                className="gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                Ulangi Semua Latihan
              </Button>
              {onGoHome && (
                <Button
                  onClick={() => { sounds.start(); onGoHome(); }}
                  className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
                >
                  🏠 Kembali ke Halaman Awal
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
