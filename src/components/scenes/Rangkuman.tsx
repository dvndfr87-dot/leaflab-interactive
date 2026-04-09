import { motion } from "framer-motion";
import SceneLayout from "@/components/SceneLayout";

interface RangkumanProps {
  onNext: () => void;
  onBack: () => void;
}

const Rangkuman = ({ onNext, onBack }: RangkumanProps) => {
  return (
    <SceneLayout
      title="Rangkuman"
      subtitle="Ringkasan proses fotosintesis"
      currentScene={6}
      totalScenes={8}
      onBack={onBack}
      onNext={onNext}
      nextLabel="Ke Latihan"
    >
      <div className="max-w-2xl mx-auto py-4 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-5 border border-border"
        >
          <p className="text-sm text-foreground leading-relaxed">
            Fotosintesis merupakan proses pembentukan makanan (glukosa) pada tumbuhan 
            dengan bantuan cahaya matahari yang berlangsung di dalam <strong className="text-primary">kloroplas</strong>.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Proses fotosintesis terdiri dari dua tahap utama:
          </p>
        </motion.div>

        {/* Reaksi Terang */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-sunlight/10 to-primary/5 rounded-xl p-5 border border-sunlight/30"
        >
          <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
            ☀️ 1. Reaksi Terang
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm text-foreground/80">
            <li>📍 Terjadi di <strong>tilakoid</strong></li>
            <li>☀️ Membutuhkan <strong>cahaya</strong></li>
            <li>💧 Menggunakan <strong>air (H₂O)</strong></li>
            <li className="pt-1">
              <span className="font-semibold">Menghasilkan:</span>
              <div className="flex gap-2 mt-1 flex-wrap">
                <span className="px-2 py-0.5 bg-oxygen/20 text-oxygen text-xs font-medium rounded-md">O₂</span>
                <span className="px-2 py-0.5 bg-atp/20 text-atp text-xs font-medium rounded-md">ATP</span>
                <span className="px-2 py-0.5 bg-nadph/20 text-nadph text-xs font-medium rounded-md">NADPH</span>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-1 text-muted-foreground"
        >
          <span className="text-xs">ATP & NADPH</span>
          <span className="text-lg">↓</span>
        </motion.div>

        {/* Reaksi Gelap */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-primary/5 to-glucose/10 rounded-xl p-5 border border-primary/20"
        >
          <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
            🌙 2. Reaksi Gelap (Siklus Calvin)
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm text-foreground/80">
            <li>📍 Terjadi di <strong>stroma</strong></li>
            <li>🌙 Tidak membutuhkan cahaya secara langsung</li>
            <li className="pt-1">
              <span className="font-semibold">Menggunakan:</span>
              <div className="flex gap-2 mt-1 flex-wrap">
                <span className="px-2 py-0.5 bg-muted text-co2 text-xs font-medium rounded-md">CO₂</span>
                <span className="px-2 py-0.5 bg-atp/20 text-atp text-xs font-medium rounded-md">ATP</span>
                <span className="px-2 py-0.5 bg-nadph/20 text-nadph text-xs font-medium rounded-md">NADPH</span>
              </div>
            </li>
            <li className="pt-1">
              <span className="font-semibold">Menghasilkan:</span>
              <div className="flex gap-2 mt-1">
                <span className="px-2 py-0.5 bg-glucose/20 text-glucose text-xs font-medium rounded-md">Glukosa</span>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Key point */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-primary/10 rounded-xl p-4 border border-primary/20 text-sm"
        >
          <h4 className="font-bold text-primary mb-1">🔗 Hubungan Kedua Reaksi</h4>
          <p className="text-foreground/80">
            Reaksi terang menghasilkan energi dalam bentuk <strong>ATP</strong> dan <strong>NADPH</strong> yang 
            digunakan pada reaksi gelap untuk membentuk glukosa. Kedua reaksi saling berhubungan dan tidak dapat dipisahkan.
          </p>
        </motion.div>

        {/* Equation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-card rounded-xl p-4 border border-border text-center"
        >
          <p className="text-xs text-muted-foreground mb-1">Persamaan umum fotosintesis:</p>
          <p className="font-heading font-bold text-foreground">
            6CO₂ + 6H₂O <span className="text-sunlight mx-2">→ cahaya</span> C₆H₁₂O₆ + 6O₂
          </p>
        </motion.div>
      </div>
    </SceneLayout>
  );
};

export default Rangkuman;
