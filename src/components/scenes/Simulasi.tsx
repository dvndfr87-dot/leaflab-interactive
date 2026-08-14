import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneLayout from "@/components/SceneLayout";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, CheckCircle, Lightbulb } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SimulasiProps {
  onNext: () => void;
  onBack: () => void;
}

interface Bubble {
  id: number;
  x: number;
  delay: number;
  size: number;
}

interface DataPoint {
  time: number;
  o2: number;
  glucose: number;
}

type Phase = "predict" | "simulate";

interface Prediction {
  scenario: string;
  question: string;
  options: { label: string; value: string; emoji: string }[];
  correctValue: string;
  explanation: string;
}

const predictions: Prediction[] = [
  {
    scenario: "Cahaya tinggi (80%), CO₂ tinggi (80%), Air cukup (70%)",
    question: "Apa yang akan terjadi pada laju fotosintesis?",
    options: [
      { label: "Sangat rendah", value: "very-low", emoji: "🥀" },
      { label: "Sedang", value: "medium", emoji: "🌱" },
      { label: "Tinggi / Optimal", value: "high", emoji: "🌳" },
    ],
    correctValue: "high",
    explanation: "Dengan cahaya dan CO₂ tinggi serta air yang cukup, semua faktor terpenuhi sehingga fotosintesis berlangsung optimal! 🌳",
  },
  {
    scenario: "Cahaya tinggi (90%), CO₂ sangat rendah (10%), Air cukup (70%)",
    question: "Apa yang akan terjadi pada produksi O₂?",
    options: [
      { label: "Banyak O₂", value: "high", emoji: "🫧" },
      { label: "Sedikit O₂", value: "low", emoji: "💨" },
      { label: "Tidak ada O₂", value: "none", emoji: "❌" },
    ],
    correctValue: "low",
    explanation: "Meskipun cahaya tinggi, CO₂ yang sangat rendah menjadi faktor pembatas. Fotosintesis tetap rendah karena CO₂ dibutuhkan untuk siklus Calvin.",
  },
  {
    scenario: "Cahaya gelap (5%), CO₂ tinggi (80%), Air banyak (90%)",
    question: "Apa yang akan terjadi pada tanaman?",
    options: [
      { label: "Fotosintesis optimal", value: "optimal", emoji: "🌳" },
      { label: "Fotosintesis sangat rendah", value: "very-low", emoji: "🥀" },
      { label: "Fotosintesis sedang", value: "medium", emoji: "🌿" },
    ],
    correctValue: "very-low",
    explanation: "Tanpa cahaya, reaksi terang tidak bisa berlangsung, sehingga ATP dan NADPH tidak dihasilkan. Fotosintesis hampir berhenti meskipun CO₂ dan air tersedia! ☀️ adalah kunci.",
  },
];

const Simulasi = ({ onNext, onBack }: SimulasiProps) => {
  const [phase, setPhase] = useState<Phase>("predict");
  const [currentPrediction, setCurrentPrediction] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showPredictionResult, setShowPredictionResult] = useState<Record<number, boolean>>({});
  const [predictionsDone, setPredictionsDone] = useState(false);

  const [lightIntensity, setLightIntensity] = useState(50);
  const [co2Level, setCo2Level] = useState(50);
  const [waterLevel, setWaterLevel] = useState(70);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [o2Produced, setO2Produced] = useState(0);
  const [glucoseProduced, setGlucoseProduced] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [observations, setObservations] = useState<string[]>([]);
  const [chartData, setChartData] = useState<DataPoint[]>([{ time: 0, o2: 0, glucose: 0 }]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bubbleIdRef = useRef(0);

  const rate = Math.min(lightIntensity, co2Level, waterLevel) / 100;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(t => {
          const newT = t + 1;
          setO2Produced(prev => {
            const newO2 = +(prev + rate * 0.8).toFixed(1);
            setGlucoseProduced(prevG => {
              const newGlc = +(prevG + rate * 0.3).toFixed(1);
              setChartData(cd => {
                const next = [...cd, { time: newT, o2: newO2, glucose: newGlc }];
                return next.length > 60 ? next.slice(-60) : next;
              });
              return newGlc;
            });
            return newO2;
          });
          return newT;
        });

        if (rate > 0.1) {
          const count = Math.ceil(rate * 3);
          const newBubbles: Bubble[] = Array.from({ length: count }, () => ({
            id: bubbleIdRef.current++,
            x: 35 + Math.random() * 30,
            delay: Math.random() * 0.5,
            size: 4 + Math.random() * 6,
          }));
          setBubbles(prev => [...prev.slice(-20), ...newBubbles]);
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, rate]);

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setO2Produced(0);
    setGlucoseProduced(0);
    setBubbles([]);
    setObservations([]);
    setChartData([{ time: 0, o2: 0, glucose: 0 }]);
  };

  const addObservation = () => {
    const obs = `t=${elapsedTime}s | ☀️${lightIntensity}% | 💨${co2Level}% | 💧${waterLevel}% → O₂: ${o2Produced}mL | Glukosa: ${glucoseProduced}mg`;
    setObservations(prev => [...prev, obs]);
  };

  const getLightColor = () => {
    if (lightIntensity < 20) return "from-background to-background";
    if (lightIntensity < 50) return "from-sunlight/10 to-sunlight/5";
    if (lightIntensity < 80) return "from-sunlight/25 to-sunlight/10";
    return "from-sunlight/40 to-sunlight/15";
  };

  const getPlantHealth = () => {
    if (rate < 0.15) return { emoji: "🥀", label: "Fotosintesis sangat rendah" };
    if (rate < 0.4) return { emoji: "🌱", label: "Fotosintesis rendah" };
    if (rate < 0.7) return { emoji: "🌿", label: "Fotosintesis sedang" };
    return { emoji: "🌳", label: "Fotosintesis optimal!" };
  };

  const plant = getPlantHealth();

  const handleSelectPrediction = (predIdx: number, value: string) => {
    if (showPredictionResult[predIdx]) return;
    setSelectedAnswers(prev => ({ ...prev, [predIdx]: value }));
  };

  const handleCheckPrediction = (predIdx: number) => {
    setShowPredictionResult(prev => ({ ...prev, [predIdx]: true }));
  };

  const handleNextPrediction = () => {
    if (currentPrediction < predictions.length - 1) {
      setCurrentPrediction(currentPrediction + 1);
    } else {
      setPredictionsDone(true);
    }
  };

  const correctCount = predictions.filter((p, i) => selectedAnswers[i] === p.correctValue).length;

  // ─── PREDICTION PHASE ───
  if (phase === "predict") {
    const pred = predictions[currentPrediction];
    const selected = selectedAnswers[currentPrediction];
    const revealed = showPredictionResult[currentPrediction];
    const isCorrect = selected === pred.correctValue;

    return (
      <SceneLayout
        title="Simulasi Fotosintesis"
        subtitle="Prediksi dulu sebelum bereksperimen!"
        currentScene={5}
        totalScenes={8}
        onBack={onBack}
        onNext={predictionsDone ? () => setPhase("simulate") : undefined}
        nextLabel="Mulai Simulasi →"
      >
        <div className="max-w-2xl mx-auto py-4 space-y-4">
          {/* Phase indicator */}
          <div className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
              <span className="text-sm font-semibold text-primary">Prediksi</span>
            </div>
            <div className="flex-1 h-0.5 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-sm font-semibold text-muted-foreground">Simulasi</span>
            </div>
          </div>

          {/* Intro */}
          {!predictionsDone && (
            <div className="bg-sunlight/15 rounded-xl p-4 border border-sunlight/40">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-sunlight mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Berpikir Dulu! 🧠</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sebelum menjalankan simulasi, coba prediksi apa yang akan terjadi. Ini membantu melatih kemampuan berpikir ilmiahmu!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="flex gap-1">
            {predictions.map((_, i) => (
              <div key={i} className={`flex-1 h-2 rounded-full transition-colors ${
                i < currentPrediction ? "bg-primary" : i === currentPrediction && !predictionsDone ? "bg-primary/50" : "bg-muted"
              }`} />
            ))}
          </div>

          {!predictionsDone ? (
            <AnimatePresence mode="wait">
              <motion.div key={currentPrediction} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="bg-card rounded-xl p-5 border border-border space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Skenario {currentPrediction + 1}/{predictions.length}</p>
                    <h3 className="font-bold text-foreground">{pred.scenario}</h3>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3 border border-border">
                    <p className="text-sm font-semibold text-foreground">{pred.question}</p>
                  </div>

                  {/* Options */}
                  <div className="grid gap-2">
                    {pred.options.map(opt => {
                      const isSelected = selected === opt.value;
                      const isRight = revealed && opt.value === pred.correctValue;
                      const isWrong = revealed && isSelected && !isCorrect;

                      return (
                        <motion.button
                          key={opt.value}
                          whileHover={!revealed ? { scale: 1.02 } : {}}
                          whileTap={!revealed ? { scale: 0.98 } : {}}
                          onClick={() => handleSelectPrediction(currentPrediction, opt.value)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                            isRight
                              ? "border-primary bg-primary/22"
                              : isWrong
                              ? "border-destructive bg-destructive/22"
                              : isSelected
                              ? "border-primary/50 bg-primary/15"
                              : "border-border bg-background hover:border-primary/50"
                          }`}
                        >
                          <span className="text-2xl">{opt.emoji}</span>
                          <span className="text-sm font-medium text-foreground flex-1">{opt.label}</span>
                          {isRight && <CheckCircle className="w-5 h-5 text-primary" />}
                          {isWrong && <span className="text-destructive text-sm">✗</span>}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Check / Result */}
                  {!revealed ? (
                    <Button
                      onClick={() => handleCheckPrediction(currentPrediction)}
                      disabled={!selected}
                      className="w-full"
                    >
                      Cek Jawaban
                    </Button>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div className={`rounded-lg p-3 text-sm ${isCorrect ? "bg-primary/22 border border-primary/40" : "bg-destructive/15 border border-destructive/40"}`}>
                        <p className="font-semibold mb-1">{isCorrect ? "✅ Benar!" : "❌ Belum tepat"}</p>
                        <p className="text-foreground/80 text-xs">{pred.explanation}</p>
                      </div>
                      <Button onClick={handleNextPrediction} className="w-full">
                        {currentPrediction < predictions.length - 1 ? "Skenario Berikutnya →" : "Lihat Hasil Prediksi"}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-xl p-6 border border-border text-center space-y-4">
              <h3 className="text-xl font-bold text-foreground">🧠 Hasil Prediksi</h3>
              <p className="text-3xl font-bold text-primary">{correctCount} / {predictions.length}</p>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(correctCount / predictions.length) * 100}%` }} transition={{ duration: 0.8 }} className="h-full bg-primary rounded-full" />
              </div>
              <p className="text-sm text-muted-foreground">
                {correctCount === predictions.length
                  ? "Sempurna! Kamu sudah memahami konsep fotosintesis dengan baik! 🌟"
                  : correctCount >= 2
                  ? "Bagus! Sekarang coba buktikan prediksimu dengan simulasi. 🔬"
                  : "Tidak apa-apa! Simulasi akan membantumu memahami lebih baik. 💪"}
              </p>
              <Button onClick={() => setPhase("simulate")} size="lg" className="gap-2">
                <Play className="w-4 h-4" />
                Mulai Simulasi
              </Button>
            </motion.div>
          )}
        </div>
      </SceneLayout>
    );
  }

  // ─── SIMULATION PHASE ───
  return (
    <SceneLayout
      title="Simulasi Fotosintesis"
      subtitle="Atur variabel dan amati hasilnya secara real-time"
      currentScene={5}
      totalScenes={8}
      onBack={onBack}
      onNext={onNext}
      nextLabel="Ke Rangkuman"
    >
      <div className="max-w-3xl mx-auto py-4 space-y-4">
        {/* Phase indicator */}
        <div className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/30 text-primary flex items-center justify-center text-sm font-bold">✓</div>
            <span className="text-sm font-semibold text-primary/60">Prediksi</span>
          </div>
          <div className="flex-1 h-0.5 bg-primary/30" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-sm font-semibold text-primary">Simulasi</span>
          </div>
        </div>

        {/* Simulation viewport */}
        <div className={`relative rounded-2xl overflow-hidden border-2 border-border bg-gradient-to-b ${getLightColor()} h-64 md:h-72`}>
          <motion.div animate={{ opacity: lightIntensity / 100, scale: 0.6 + (lightIntensity / 100) * 0.6 }} className="absolute top-3 left-4">
            <div className="text-4xl">☀️</div>
            {lightIntensity > 30 && (
              <div className="absolute inset-0 flex items-center justify-center">
                {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                  <motion.div key={deg} animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: deg / 360 }} className="absolute w-0.5 h-8 bg-sunlight/40 origin-bottom" style={{ transform: `rotate(${deg}deg) translateY(-24px)` }} />
                ))}
              </div>
            )}
          </motion.div>

          {co2Level > 10 && (
            <div className="absolute top-4 right-4 flex flex-col gap-1">
              {Array.from({ length: Math.ceil(co2Level / 25) }, (_, i) => (
                <motion.div key={i} animate={{ x: [0, -8, 0], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }} className="px-1.5 py-0.5 bg-co2/30 text-co2 text-[10px] font-bold rounded border border-co2/50">
                  CO₂
                </motion.div>
              ))}
            </div>
          )}

          <motion.div animate={{ height: `${waterLevel * 0.4}%` }} className="absolute bottom-0 left-0 right-0 bg-water/28 border-t border-water/50">
            <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-0 left-0 right-0 h-1 bg-water/30" />
          </motion.div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <motion.div animate={isRunning && rate > 0.2 ? { scaleY: [1, 1.03, 1], scaleX: [1, 0.98, 1] } : {}} transition={{ duration: 2, repeat: Infinity }} className="text-5xl">
              {plant.emoji}
            </motion.div>
            <div className="mt-1 px-2 py-0.5 bg-card/80 rounded text-[10px] font-medium text-foreground">Tanaman Air (Elodea)</div>
          </div>

          <AnimatePresence>
            {bubbles.map(bubble => (
              <motion.div key={bubble.id} initial={{ opacity: 0.7, y: 0, x: `${bubble.x}%` }} animate={{ opacity: 0, y: -200 }} exit={{ opacity: 0 }} transition={{ duration: 2.5, delay: bubble.delay, ease: "easeOut" }} className="absolute bottom-16 rounded-full bg-oxygen/50 border border-oxygen/40" style={{ width: bubble.size, height: bubble.size }} />
            ))}
          </AnimatePresence>

          {isRunning && rate > 0.3 && (
            <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-glucose/30 rounded-full text-[9px] text-glucose font-bold border border-glucose/50">
              Glukosa terbentuk...
            </motion.div>
          )}

          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-card/90 rounded-lg px-3 py-1.5 border border-border flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">Laju:</span>
            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div animate={{ width: `${rate * 100}%` }} className="h-full bg-primary rounded-full" />
            </div>
            <span className="text-xs font-bold text-primary">{Math.round(rate * 100)}%</span>
          </div>

          <div className="absolute bottom-3 right-3 bg-card/90 rounded-lg px-2 py-1 border border-border text-[10px] text-foreground">
            {plant.label}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-card rounded-xl p-5 border border-border space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-lg">🎛️ Kontrol Variabel</h3>
            <div className="flex gap-2">
              <Button size="sm" variant={isRunning ? "destructive" : "default"} onClick={() => setIsRunning(!isRunning)} className="gap-1">
                {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {isRunning ? "Jeda" : "Mulai"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleReset} className="gap-1">
                <RotateCcw className="w-3 h-3" />
                Reset
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-foreground">☀️ Intensitas Cahaya</label>
              <span className="text-sm font-bold text-sunlight">{lightIntensity}%</span>
            </div>
            <Slider value={[lightIntensity]} onValueChange={([v]) => setLightIntensity(v)} min={0} max={100} step={5} className="cursor-pointer" />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Gelap</span><span>Redup</span><span>Terang</span><span>Sangat Terang</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-foreground">💨 Konsentrasi CO₂</label>
              <span className="text-sm font-bold text-co2">{co2Level}%</span>
            </div>
            <Slider value={[co2Level]} onValueChange={([v]) => setCo2Level(v)} min={0} max={100} step={5} className="cursor-pointer" />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0 ppm</span><span>200 ppm</span><span>400 ppm</span><span>800 ppm</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-foreground">💧 Ketersediaan Air</label>
              <span className="text-sm font-bold text-water">{waterLevel}%</span>
            </div>
            <Slider value={[waterLevel]} onValueChange={([v]) => setWaterLevel(v)} min={0} max={100} step={5} className="cursor-pointer" />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Kering</span><span>Sedikit</span><span>Cukup</span><span>Banyak</span>
            </div>
          </div>
        </div>

        {/* Real-time data cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-3 border border-border text-center">
            <div className="text-2xl mb-1">⏱️</div>
            <div className="text-lg font-bold text-foreground">{elapsedTime}s</div>
            <div className="text-[10px] text-muted-foreground">Waktu</div>
          </div>
          <div className="bg-oxygen/22 rounded-xl p-3 border border-oxygen/50 text-center">
            <div className="text-2xl mb-1">🫧</div>
            <div className="text-lg font-bold text-oxygen">{o2Produced}</div>
            <div className="text-[10px] text-muted-foreground">O₂ (mL)</div>
          </div>
          <div className="bg-glucose/22 rounded-xl p-3 border border-glucose/50 text-center">
            <div className="text-2xl mb-1">🍬</div>
            <div className="text-lg font-bold text-glucose">{glucoseProduced}</div>
            <div className="text-[10px] text-muted-foreground">Glukosa (mg)</div>
          </div>
        </div>

        {/* Real-time Chart */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h4 className="font-semibold text-sm text-foreground mb-3">📊 Grafik Produksi Real-Time</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} label={{ value: "Waktu (s)", position: "insideBottom", offset: -2, fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="o2" name="O₂ (mL)" stroke="hsl(195 60% 50%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="glucose" name="Glukosa (mg)" stroke="hsl(35 90% 55%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Record observation */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addObservation} disabled={!isRunning && elapsedTime === 0} className="flex-1">
            📝 Catat Pengamatan
          </Button>
        </div>

        {observations.length > 0 && (
          <div className="bg-card rounded-xl p-4 border border-border">
            <h4 className="font-semibold text-sm text-foreground mb-2">📋 Catatan Pengamatan</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {observations.map((obs, i) => (
                <div key={i} className="text-[11px] text-foreground/80 bg-muted/50 rounded px-2 py-1 font-mono">
                  {i + 1}. {obs}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guiding questions */}
        <div className="bg-primary/15 rounded-xl p-4 border border-primary/40">
          <h4 className="font-semibold text-sm text-primary mb-2">🤔 Pertanyaan Panduan</h4>
          <ol className="space-y-1.5 text-xs text-foreground/80 list-decimal pl-4">
            <li>Apa yang terjadi jika intensitas cahaya dinaikkan tapi CO₂ tetap rendah?</li>
            <li>Mengapa ada batas maksimal laju fotosintesis meskipun cahaya sangat terang?</li>
            <li>Variabel mana yang paling membatasi laju fotosintesis? (Faktor pembatas)</li>
            <li>Bagaimana hubungan antara jumlah O₂ dan glukosa yang dihasilkan?</li>
          </ol>
        </div>
      </div>
    </SceneLayout>
  );
};

export default Simulasi;
