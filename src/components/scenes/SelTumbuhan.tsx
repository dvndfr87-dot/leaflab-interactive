import { motion } from "framer-motion";
import plantCellImg from "@/assets/plant-cell.jpg";
import SceneLayout from "@/components/SceneLayout";

interface SelTumbuhanProps {
  onNext: () => void;
  onBack: () => void;
}

const SelTumbuhan = ({ onNext, onBack }: SelTumbuhanProps) => {
  return (
    <SceneLayout
      title="Sel Tumbuhan"
      subtitle="Temukan lokasi fotosintesis di dalam sel tumbuhan"
      currentScene={1}
      totalScenes={7}
      onBack={onBack}
      showNav={true}
      onNext={undefined}
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 py-4">
        <p className="text-center text-sm text-muted-foreground">
          Fotosintesis terjadi di dalam <strong className="text-primary">kloroplas</strong>. 
          Klik pada kloroplas (organel hijau kecil) untuk melanjutkan!
        </p>

        <div className="relative">
          <motion.img
            src={plantCellImg}
            alt="Sel Tumbuhan"
            className="rounded-xl shadow-lg max-w-full w-[400px]"
            width={400}
            height={400}
          />
          
          {/* Clickable chloroplast hotspots */}
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{ boxShadow: ["0 0 8px hsl(142 45% 38% / 0.3)", "0 0 20px hsl(142 45% 38% / 0.6)", "0 0 8px hsl(142 45% 38% / 0.3)"] }}
            transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
            className="absolute top-[18%] left-[35%] w-14 h-8 rounded-full bg-primary/30 border-2 border-primary cursor-pointer"
            title="Kloroplas"
          />
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{ boxShadow: ["0 0 8px hsl(142 45% 38% / 0.3)", "0 0 20px hsl(142 45% 38% / 0.6)", "0 0 8px hsl(142 45% 38% / 0.3)"] }}
            transition={{ boxShadow: { duration: 2, repeat: Infinity, delay: 0.5 } }}
            className="absolute top-[30%] left-[18%] w-12 h-7 rounded-full bg-primary/30 border-2 border-primary cursor-pointer"
            title="Kloroplas"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-card rounded-lg p-4 border border-border max-w-md text-sm"
        >
          <h3 className="font-semibold text-foreground mb-2">📖 Tahukah kamu?</h3>
          <p className="text-muted-foreground">
            Sel tumbuhan memiliki organel khusus bernama <strong className="text-primary">kloroplas</strong> yang 
            berisi pigmen hijau (klorofil). Di sinilah proses fotosintesis berlangsung — mengubah cahaya matahari, air, 
            dan CO₂ menjadi glukosa dan oksigen.
          </p>
        </motion.div>
      </div>
    </SceneLayout>
  );
};

export default SelTumbuhan;
