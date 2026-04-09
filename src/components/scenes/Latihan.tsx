import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneLayout from "@/components/SceneLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

type ExerciseType = "drag-location" | "drag-io" | "drag-energy";

interface DragItem {
  id: string;
  label: string;
  correctZone: string;
}

interface Exercise {
  type: ExerciseType;
  title: string;
  instruction: string;
  items: DragItem[];
  zones: { id: string; label: string }[];
}

const exercises: Exercise[] = [
  {
    type: "drag-location",
    title: "Latihan 1: Lokasi Reaksi",
    instruction: "Tempatkan setiap item ke lokasi yang tepat!",
    items: [
      { id: "rt", label: "Reaksi Terang", correctZone: "tilakoid" },
      { id: "rg", label: "Reaksi Gelap", correctZone: "stroma" },
      { id: "atp-nadph", label: "ATP & NADPH", correctZone: "tilakoid" },
      { id: "glukosa", label: "Glukosa", correctZone: "stroma" },
    ],
    zones: [
      { id: "tilakoid", label: "Tilakoid" },
      { id: "stroma", label: "Stroma" },
    ],
  },
  {
    type: "drag-io",
    title: "Latihan 2: Input dan Output Reaksi",
    instruction: "Tempatkan setiap zat ke reaksi yang sesuai!",
    items: [
      { id: "cahaya", label: "Cahaya", correctZone: "terang" },
      { id: "h2o", label: "H₂O", correctZone: "terang" },
      { id: "o2", label: "O₂", correctZone: "terang" },
      { id: "atp", label: "ATP", correctZone: "terang" },
      { id: "nadph", label: "NADPH", correctZone: "terang" },
      { id: "co2", label: "CO₂", correctZone: "gelap" },
      { id: "glukosa2", label: "Glukosa", correctZone: "gelap" },
    ],
    zones: [
      { id: "terang", label: "Reaksi Terang" },
      { id: "gelap", label: "Reaksi Gelap" },
    ],
  },
  {
    type: "drag-energy",
    title: "Latihan 3: Sumber dan Hasil Energi",
    instruction: "Tempatkan pernyataan ke reaksi yang tepat!",
    items: [
      { id: "s1", label: "Menghasilkan ATP", correctZone: "terang2" },
      { id: "s2", label: "Membutuhkan cahaya", correctZone: "terang2" },
      { id: "s3", label: "Menghasilkan glukosa", correctZone: "gelap2" },
      { id: "s4", label: "Menggunakan CO₂", correctZone: "gelap2" },
      { id: "s5", label: "Menghasilkan NADPH", correctZone: "terang2" },
      { id: "s6", label: "Terjadi di Tilakoid", correctZone: "terang2" },
    ],
    zones: [
      { id: "terang2", label: "Reaksi Terang" },
      { id: "gelap2", label: "Reaksi Gelap" },
    ],
  },
];

const Latihan = ({ onBack }: { onBack: () => void }) => {
  const [currentEx, setCurrentEx] = useState(0);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const exercise = exercises[currentEx];
  const placedItems = Object.keys(placements);
  const unplacedItems = exercise.items.filter(item => !placedItems.includes(item.id));

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDrop = useCallback((zoneId: string) => {
    if (draggedItem) {
      setPlacements(prev => ({ ...prev, [draggedItem]: zoneId }));
      setDraggedItem(null);
    }
  }, [draggedItem]);

  const handleRemoveFromZone = (itemId: string) => {
    setPlacements(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const handleSubmit = () => {
    const correct = exercise.items.filter(
      item => placements[item.id] === item.correctZone
    ).length;
    const newScores = [...scores];
    newScores[currentEx] = correct;
    setScores(newScores);
    setShowResults(true);
  };

  const handleNextExercise = () => {
    if (currentEx < exercises.length - 1) {
      setCurrentEx(currentEx + 1);
      setPlacements({});
      setShowResults(false);
    }
  };

  const handleReset = () => {
    setPlacements({});
    setShowResults(false);
  };

  const totalScore = scores.reduce((a, b) => (a || 0) + (b || 0), 0);
  const totalItems = exercises.reduce((a, e) => a + e.items.length, 0);
  const allDone = scores.length === exercises.length && scores.every(s => s !== undefined);

  return (
    <SceneLayout
      title="Latihan Interaktif"
      subtitle="Uji pemahamanmu tentang fotosintesis"
      currentScene={7}
      totalScenes={8}
      onBack={onBack}
      showNav={true}
    >
      <div className="max-w-2xl mx-auto py-4 space-y-4">
        {/* Exercise tabs */}
        <div className="flex gap-2">
          {exercises.map((ex, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentEx(i);
                setPlacements({});
                setShowResults(false);
              }}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                i === currentEx
                  ? "bg-primary text-primary-foreground"
                  : scores[i] !== undefined
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}. {ex.type === "drag-location" ? "Lokasi" : ex.type === "drag-io" ? "Input/Output" : "Energi"}
              {scores[i] !== undefined && " ✓"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentEx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-card rounded-xl p-5 border border-border">
              <h3 className="font-bold text-foreground text-lg mb-1">{exercise.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{exercise.instruction}</p>

              {/* Unplaced items */}
              <div className="flex flex-wrap gap-2 mb-4 min-h-[40px] p-3 bg-muted/50 rounded-lg">
                {unplacedItems.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    draggable
                    onDragStart={() => handleDragStart(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-grab active:cursor-grabbing select-none border-2 transition-colors ${
                      showResults
                        ? placements[item.id] === item.correctZone
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-destructive/10 border-destructive text-destructive"
                        : "bg-card border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    {item.label}
                  </motion.div>
                ))}
                {unplacedItems.length === 0 && !showResults && (
                  <span className="text-xs text-muted-foreground">Semua item sudah ditempatkan</span>
                )}
              </div>

              {/* Drop zones */}
              <div className="grid grid-cols-2 gap-3">
                {exercise.zones.map(zone => {
                  const itemsInZone = exercise.items.filter(
                    item => placements[item.id] === zone.id
                  );
                  return (
                    <div
                      key={zone.id}
                      onDragOver={e => e.preventDefault()}
                      onDrop={() => handleDrop(zone.id)}
                      className={`rounded-xl p-3 border-2 border-dashed min-h-[120px] transition-colors ${
                        draggedItem ? "border-primary/50 bg-primary/5" : "border-border bg-background"
                      }`}
                    >
                      <h4 className="font-semibold text-sm text-foreground mb-2 text-center">
                        {zone.label}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {itemsInZone.map(item => (
                          <motion.div
                            key={item.id}
                            layout
                            className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${
                              showResults
                                ? item.correctZone === zone.id
                                  ? "bg-primary/10 text-primary border border-primary/30"
                                  : "bg-destructive/10 text-destructive border border-destructive/30"
                                : "bg-card text-foreground border border-border"
                            }`}
                          >
                            {item.label}
                            {showResults && (
                              item.correctZone === zone.id
                                ? <CheckCircle className="w-3 h-3" />
                                : <XCircle className="w-3 h-3" />
                            )}
                            {!showResults && (
                              <button
                                onClick={() => handleRemoveFromZone(item.id)}
                                className="ml-1 text-muted-foreground hover:text-foreground"
                              >
                                ×
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </Button>

                {!showResults ? (
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={placedItems.length < exercise.items.length}
                    className="bg-primary text-primary-foreground"
                  >
                    Lihat Skor
                  </Button>
                ) : (
                  currentEx < exercises.length - 1 ? (
                    <Button
                      size="sm"
                      onClick={handleNextExercise}
                      className="bg-primary text-primary-foreground"
                    >
                      Latihan Berikutnya →
                    </Button>
                  ) : null
                )}
              </div>

              {/* Score */}
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-primary/10 rounded-lg text-center"
                >
                  <p className="text-sm font-semibold text-primary">
                    Skor: {scores[currentEx]} / {exercise.items.length} benar
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Final score */}
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary/10 rounded-xl p-6 border border-primary/20 text-center"
          >
            <h3 className="text-xl font-bold text-primary mb-2">🎉 Selesai!</h3>
            <p className="text-foreground text-sm mb-1">
              Total Skor Keseluruhan:
            </p>
            <p className="text-3xl font-bold text-primary">
              {totalScore} / {totalItems}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {totalScore === totalItems
                ? "Sempurna! Kamu sudah menguasai materi fotosintesis! 🌟"
                : totalScore >= totalItems * 0.7
                ? "Bagus sekali! Terus tingkatkan pemahamanmu! 💪"
                : "Jangan menyerah! Coba ulangi lagi untuk memahami lebih baik. 📖"}
            </p>
          </motion.div>
        )}
      </div>
    </SceneLayout>
  );
};

export default Latihan;
