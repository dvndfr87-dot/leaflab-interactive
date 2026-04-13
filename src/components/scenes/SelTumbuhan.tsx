import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import plantCellImg from "@/assets/plant-cell.jpg";
import SceneLayout from "@/components/SceneLayout";

interface SelTumbuhanProps {
  onNext: () => void;
  onBack: () => void;
}

interface Organelle {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  top: string;
  left: string;
  w: string;
  h: string;
  isTarget?: boolean;
}

const organelles: Organelle[] = [
  {
    id: "kloroplas1",
    name: "Kloroplas",
    emoji: "🟢",
    desc: "Organel tempat fotosintesis berlangsung. Mengandung klorofil yang menyerap cahaya matahari.",
    top: "18%",
    left: "35%",
    w: "w-14",
    h: "h-8",
    isTarget: true,
  },
  {
    id: "kloroplas2",
    name: "Kloroplas",
    emoji: "🟢",
    desc: "Organel tempat fotosintesis berlangsung. Mengandung klorofil yang menyerap cahaya matahari.",
    top: "30%",
    left: "18%",
    w: "w-12",
    h: "h-7",
    isTarget: true,
  },
  {
    id: "nukleus",
    name: "Nukleus",
    emoji: "🔵",
    desc: "Inti sel yang menyimpan materi genetik (DNA). Mengontrol semua aktivitas sel.",
    top: "45%",
    left: "50%",
    w: "w-12",
    h: "h-12",
  },
  {
    id: "vakuola",
    name: "Vakuola Sentral",
    emoji: "🟣",
    desc: "Organel besar berisi cairan sel. Menyimpan air, nutrisi, dan menjaga tekanan turgor sel.",
    top: "55%",
    left: "30%",
    w: "w-20",
    h: "h-14",
  },
  {
    id: "dinding",
    name: "Dinding Sel",
    emoji: "🟤",
    desc: "Lapisan kaku di luar membran sel. Memberikan bentuk dan perlindungan pada sel tumbuhan.",
    top: "5%",
    left: "50%",
    w: "w-10",
    h: "h-6",
  },
  {
    id: "mitokondria",
    name: "Mitokondria",
    emoji: "🟠",
    desc: "Organel penghasil energi melalui respirasi seluler. Mengubah glukosa menjadi ATP.",
    top: "70%",
    left: "60%",
    w: "w-10",
    h: "h-6",
  },
];

const SelTumbuhan = ({ onNext, onBack }: SelTumbuhanProps) => {
  const [selectedOrganelle, setSelectedOrganelle] = useState<string | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(new Set());

  const handleClick = (org: Organelle) => {
    setSelectedOrganelle(org.id);
    setDiscoveredIds(prev => new Set(prev).add(org.id));
  };

  const selected = organelles.find(o => o.id === selectedOrganelle);
  const discoveredCount = discoveredIds.size;

  return (
    <SceneLayout
      title="Sel Tumbuhan"
      subtitle="Temukan lokasi fotosintesis di dalam sel tumbuhan"
      currentScene={1}
      totalScenes={7}
      onBack={onBack}
      showNav={true}
      onNext={discoveredIds.has("kloroplas1") || discoveredIds.has("kloroplas2") ? onNext : undefined}
      nextLabel="Lanjut ke Kloroplas"
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-4 py-4">
        <p className="text-center text-sm text-muted-foreground">
          Klik pada setiap organel untuk mempelajari fungsinya. Temukan <strong className="text-primary">kloroplas</strong> untuk melanjutkan!
        </p>

        {/* Discovery progress */}
        <div className="flex items-center gap-2 bg-card rounded-lg px-3 py-1.5 border border-border">
          <span className="text-xs text-muted-foreground">Ditemukan:</span>
          <div className="flex gap-1">
            {organelles.map(org => (
              <div
                key={org.id}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all ${
                  discoveredIds.has(org.id)
                    ? "bg-primary/20 border border-primary/40 scale-100"
                    : "bg-muted border border-border scale-90 opacity-40"
                }`}
              >
                {discoveredIds.has(org.id) ? org.emoji : "?"}
              </div>
            ))}
          </div>
          <span className="text-xs font-bold text-primary">{discoveredCount}/{organelles.length}</span>
        </div>

        <div className="relative">
          <motion.img
            src={plantCellImg}
            alt="Sel Tumbuhan"
            className="rounded-xl shadow-lg max-w-full w-[400px]"
            width={400}
            height={400}
          />

          {/* Clickable organelle hotspots */}
          {organelles.map(org => (
            <motion.button
              key={org.id}
              onClick={() => handleClick(org)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              animate={
                org.isTarget && !discoveredIds.has(org.id)
                  ? {
                      boxShadow: [
                        "0 0 8px hsl(142 45% 38% / 0.3)",
                        "0 0 20px hsl(142 45% 38% / 0.6)",
                        "0 0 8px hsl(142 45% 38% / 0.3)",
                      ],
                    }
                  : {}
              }
              transition={
                org.isTarget ? { boxShadow: { duration: 2, repeat: Infinity } } : undefined
              }
              className={`absolute ${org.w} ${org.h} rounded-full cursor-pointer transition-all ${
                selectedOrganelle === org.id
                  ? "bg-primary/40 border-2 border-primary ring-2 ring-primary/30"
                  : discoveredIds.has(org.id)
                  ? "bg-primary/20 border-2 border-primary/50"
                  : org.isTarget
                  ? "bg-primary/30 border-2 border-primary"
                  : "bg-foreground/10 border-2 border-foreground/20 hover:bg-foreground/20"
              }`}
              style={{ top: org.top, left: org.left }}
              title={discoveredIds.has(org.id) ? org.name : "Klik untuk mengetahui"}
            />
          ))}
        </div>

        {/* Info panel */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-lg p-4 border max-w-md text-sm w-full ${
                selected.isTarget
                  ? "bg-primary/5 border-primary/30"
                  : "bg-card border-border"
              }`}
            >
              <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                {selected.emoji} {selected.name}
              </h3>
              <p className="text-muted-foreground">{selected.desc}</p>
              {selected.isTarget && (
                <p className="mt-2 text-primary text-xs font-semibold">
                  ✅ Ini adalah organel utama untuk fotosintesis! Klik "Lanjut" untuk melihat lebih detail.
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-lg p-4 border border-border max-w-md text-sm"
            >
              <h3 className="font-semibold text-foreground mb-2">📖 Tahukah kamu?</h3>
              <p className="text-muted-foreground">
                Sel tumbuhan memiliki organel khusus bernama <strong className="text-primary">kloroplas</strong> yang
                berisi pigmen hijau (klorofil). Klik pada bagian-bagian sel di atas untuk menjelajah!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneLayout>
  );
};

export default SelTumbuhan;
