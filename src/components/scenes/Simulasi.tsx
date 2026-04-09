import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneLayout from "@/components/SceneLayout";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
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

const Simulasi = ({ onNext, onBack }: SimulasiProps) => {
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
    const obs = `t=${elapsedTime}s | Cahaya: ${lightIntensity}% | CO₂: ${co2Level}% | Air: ${waterLevel}% → O₂: ${o2Produced} | Glukosa: ${glucoseProduced}`;
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
                <motion.div key={i} animate={{ x: [0, -8, 0], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }} className="px-1.5 py-0.5 bg-co2/20 text-co2 text-[10px] font-bold rounded border border-co2/30">
                  CO₂
                </motion.div>
              ))}
            </div>
          )}

          <motion.div animate={{ height: `${waterLevel * 0.4}%` }} className="absolute bottom-0 left-0 right-0 bg-water/15 border-t border-water/30">
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
            <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-glucose/20 rounded-full text-[9px] text-glucose font-bold border border-glucose/30">
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
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">☀️ Intensitas Cahaya</label>
              <span className="text-sm font-bold text-sunlight">{lightIntensity}%</span>
            </div>
            <Slider value={[lightIntensity]} onValueChange={([v]) => setLightIntensity(v)} min={0} max={100} step={5} className="cursor-pointer" />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Gelap</span><span>Redup</span><span>Terang</span><span>Sangat Terang</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">💨 Konsentrasi CO₂</label>
              <span className="text-sm font-bold text-co2">{co2Level}%</span>
            </div>
            <Slider value={[co2Level]} onValueChange={([v]) => setCo2Level(v)} min={0} max={100} step={5} className="cursor-pointer" />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0 ppm</span><span>200 ppm</span><span>400 ppm</span><span>800 ppm</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">💧 Ketersediaan Air</label>
              <span className="text-sm font-bold text-water">{waterLevel}%</span>
            </div>
            <Slider value={[waterLevel]} onValueChange={([v]) => setWaterLevel(v)} min={0} max={100} step={5} className="cursor-pointer" />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Kering</span><span>Sedikit</span><span>Cukup</span><span>Banyak</span>
            </div>
          </div>
        </div>

        {/* Real-time data */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-3 border border-border text-center">
            <div className="text-2xl mb-1">⏱️</div>
            <div className="text-lg font-bold text-foreground">{elapsedTime}s</div>
            <div className="text-[10px] text-muted-foreground">Waktu</div>
          </div>
          <div className="bg-oxygen/10 rounded-xl p-3 border border-oxygen/30 text-center">
            <div className="text-2xl mb-1">🫧</div>
            <div className="text-lg font-bold text-oxygen">{o2Produced}</div>
            <div className="text-[10px] text-muted-foreground">O₂ (mL)</div>
          </div>
          <div className="bg-glucose/10 rounded-xl p-3 border border-glucose/30 text-center">
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
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
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
