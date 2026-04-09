import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import chloroplastClean from "@/assets/chloroplast-clean.png";
import SceneLayout from "@/components/SceneLayout";

interface KloroplasProps {
  onNext: () => void;
  onBack: () => void;
  onGoToScene: (scene: number) => void;
}

const Kloroplas = ({ onNext, onBack, onGoToScene }: KloroplasProps) => {
  const [showInner, setShowInner] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  return (
    <SceneLayout
      title="Kloroplas"
      subtitle="Kenali struktur dalam kloroplas"
      currentScene={2}
      totalScenes={8}
      onBack={onBack}
      onNext={onNext}
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 py-4">
        <AnimatePresence mode="wait">
          {!showInner ? (
            <motion.div
              key="outer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-center text-sm text-muted-foreground">
                Ini adalah kloroplas utuh. Klik tombol di bawah untuk melihat bagian dalamnya.
              </p>
              <img
                src={chloroplastClean}
                alt="Kloroplas"
                className="rounded-xl max-w-full w-[400px]"
                loading="lazy"
                width={800}
                height={600}
              />
              <button
                onClick={() => setShowInner(true)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                🔍 Lihat Bagian Dalam
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="inner"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4 w-full"
            >
              <p className="text-center text-sm text-muted-foreground">
                Kloroplas memiliki dua bagian utama. Klik pada masing-masing bagian untuk mempelajari lebih lanjut!
              </p>

              <div className="relative bg-gradient-to-br from-primary/5 to-primary/15 rounded-2xl p-8 w-full max-w-md">
                <div className="flex flex-col items-center gap-8">
                  {/* Tilakoid */}
                  <motion.button
                    onClick={() => setSelectedPart("tilakoid")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedPart === "tilakoid"
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-0.5">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-16 h-2 bg-primary/60 rounded-full" />
                        ))}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-left">Tilakoid</h3>
                        <p className="text-xs text-muted-foreground text-left">Tempat Reaksi Terang</p>
                      </div>
                    </div>
                  </motion.button>

                  <div className="text-muted-foreground">↕</div>

                  {/* Stroma */}
                  <motion.button
                    onClick={() => setSelectedPart("stroma")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedPart === "stroma"
                        ? "border-sunlight bg-sunlight/10 shadow-lg"
                        : "border-border bg-card hover:border-sunlight/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 bg-sunlight/30 rounded-lg flex items-center justify-center text-xs font-medium text-foreground">
                        Cairan
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-left">Stroma</h3>
                        <p className="text-xs text-muted-foreground text-left">Tempat Reaksi Gelap (Siklus Calvin)</p>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Info panel */}
              <AnimatePresence mode="wait">
                {selectedPart && (
                  <motion.div
                    key={selectedPart}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-card rounded-lg p-4 border border-border max-w-md text-sm w-full"
                  >
                    {selectedPart === "tilakoid" ? (
                      <>
                        <h3 className="font-semibold text-primary mb-2">☀️ Tilakoid</h3>
                        <p className="text-muted-foreground mb-3">
                          Tilakoid adalah membran berbentuk cakram yang tersusun bertumpuk (grana). Di sinilah 
                          <strong> reaksi terang</strong> terjadi — cahaya diserap oleh klorofil dan diubah menjadi energi kimia (ATP & NADPH).
                        </p>
                        <button
                          onClick={() => onGoToScene(3)}
                          className="text-primary font-semibold text-xs hover:underline"
                        >
                          ➜ Pelajari Reaksi Terang
                        </button>
                      </>
                    ) : (
                      <>
                        <h3 className="font-semibold text-foreground mb-2">🌙 Stroma</h3>
                        <p className="text-muted-foreground mb-3">
                          Stroma adalah cairan yang mengisi ruang dalam kloroplas. Di sinilah 
                          <strong> reaksi gelap (Siklus Calvin)</strong> berlangsung — CO₂ diubah menjadi glukosa menggunakan ATP dan NADPH.
                        </p>
                        <button
                          onClick={() => onGoToScene(4)}
                          className="text-primary font-semibold text-xs hover:underline"
                        >
                          ➜ Pelajari Reaksi Gelap
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setShowInner(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Kembali ke tampilan luar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneLayout>
  );
};

export default Kloroplas;
