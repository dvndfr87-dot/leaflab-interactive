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
      currentScene={5}
      totalScenes={7}
      onBack={onBack}
      onNext={onNext}
      nextLabel="Ke Latihan"
    >
      <div className="max-w-2xl mx-auto py-4 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lab-panel p-5"
        >
          <div className="lab-label mb-2">Abstrak</div>
          <p className="text-sm text-foreground leading-relaxed">
            Fotosintesis adalah proses anabolik yang berlangsung di dalam <strong className="text-primary">kloroplas</strong>, mengubah energi cahaya menjadi energi kimia yang tersimpan dalam molekul glukosa. Proses ini terdiri atas dua tahap yang saling berkesinambungan:
          </p>
        </motion.div>

        {/* Reaksi Terang */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lab-panel p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="specimen-chip">PHASE-1</span>
            <h3 className="font-bold text-foreground text-lg">Reaksi Terang</h3>
          </div>
          <ul className="space-y-1.5 text-sm text-foreground/80 font-mono">
            <li><span className="lab-label">Lokasi:</span> Membran tilakoid</li>
            <li><span className="lab-label">Input:</span> H₂O · foton (hν)</li>
            <li><span className="lab-label">Proses:</span> Fotolisis air, transpor elektron, fotofosforilasi</li>
            <li className="pt-1">
              <span className="lab-label">Output:</span>
              <div className="flex gap-2 mt-1 flex-wrap">
                <span className="specimen-chip">O₂</span>
                <span className="specimen-chip">ATP</span>
                <span className="specimen-chip">NADPH</span>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-1 text-muted-foreground font-mono"
        >
          <span className="text-[10px] uppercase tracking-widest">Transfer ATP &amp; NADPH</span>
          <span className="text-lg">↓</span>
        </motion.div>

        {/* Reaksi Gelap */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lab-panel p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="specimen-chip">PHASE-2</span>
            <h3 className="font-bold text-foreground text-lg">Reaksi Gelap — Siklus Calvin</h3>
          </div>
          <ul className="space-y-1.5 text-sm text-foreground/80 font-mono">
            <li><span className="lab-label">Lokasi:</span> Stroma kloroplas</li>
            <li><span className="lab-label">Input:</span> CO₂ · ATP · NADPH</li>
            <li><span className="lab-label">Proses:</span> Fiksasi (RuBisCO) → Reduksi → Regenerasi RuBP</li>
            <li className="pt-1">
              <span className="lab-label">Output:</span>
              <div className="flex gap-2 mt-1">
                <span className="specimen-chip">C₆H₁₂O₆</span>
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
          <div className="lab-label text-primary mb-1">Keterhubungan Reaksi</div>
          <p className="text-foreground/80">
            Reaksi terang memasok <strong>ATP</strong> dan <strong>NADPH</strong> sebagai sumber energi dan daya reduksi yang dimanfaatkan Siklus Calvin untuk mereduksi CO₂ menjadi karbohidrat. Kedua reaksi bersifat saling bergantung (interdependen).
          </p>
        </motion.div>

        {/* Equation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="lab-panel p-4 text-center"
        >
          <div className="lab-label mb-1">Persamaan netto fotosintesis</div>
          <p className="font-mono font-bold text-foreground">
            6 CO₂ + 6 H₂O <span className="text-primary mx-1">—hν→</span> C₆H₁₂O₆ + 6 O₂
          </p>
        </motion.div>
      </div>
    </SceneLayout>
  );
};

export default Rangkuman;
