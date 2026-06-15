import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import chloroplastClean from "@/assets/chloroplast-clean.png";
import SceneLayout from "@/components/SceneLayout";
import { sounds } from "@/lib/sounds";

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
      totalScenes={7}
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
                Spesimen: kloroplas utuh dengan membran ganda. Lakukan diseksi optik untuk mengamati ultrastruktur internal.
              </p>
              <figure className="m-0">
                <img
                  src={chloroplastClean}
                  alt="Ilustrasi kloroplas dengan membran ganda dan tumpukan grana"
                  className="rounded-xl max-w-full w-[400px]"
                  loading="lazy"
                  width={800}
                  height={600}
                />
                <figcaption className="mt-1.5 text-[11px] text-muted-foreground text-center italic">
                  Sumber: Ilustrasi Virtual Lab Fotosintesis (2026)
                </figcaption>
              </figure>
              <button
                onClick={() => { sounds.popup(); setShowInner(true); }}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-mono text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
              >
                Diseksi Ultrastruktur →
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
                Kloroplas terbagi menjadi dua kompartemen fungsional. Pilih komponen untuk meninjau peranannya dalam fotosintesis.
              </p>

              <div className="relative bg-gradient-to-br from-primary/5 to-primary/15 rounded-2xl p-8 w-full max-w-md">
                <div className="flex flex-col items-center gap-8">
                  {/* Tilakoid */}
                  <motion.button
                    onClick={() => { sounds.click(); setSelectedPart("tilakoid"); }}
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
                    onClick={() => { sounds.click(); setSelectedPart("stroma"); }}
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
                        <div className="flex items-center gap-2 mb-2">
                          <span className="specimen-chip">THY</span>
                          <h3 className="font-semibold text-primary">Membran Tilakoid</h3>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          Sistem membran berbentuk cakram yang tersusun bertumpuk membentuk grana. Mengandung fotosistem I & II tempat berlangsungnya <strong>reaksi terang</strong>: penyerapan foton oleh klorofil, fotolisis H₂O, serta sintesis ATP dan NADPH.
                        </p>
                        <button
                          onClick={() => { sounds.next(); onGoToScene(3); }}
                          className="text-primary font-mono text-[11px] uppercase tracking-wider hover:underline"
                        >
                          → Tinjau Reaksi Terang
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="specimen-chip">STR</span>
                          <h3 className="font-semibold text-foreground">Stroma</h3>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          Matriks cair di dalam membran kloroplas yang mengandung enzim RuBisCO. Tempat berlangsungnya <strong>Siklus Calvin (reaksi gelap)</strong>: fiksasi CO₂ menjadi G3P, kemudian disintesis menjadi glukosa menggunakan ATP dan NADPH.
                        </p>
                        <button
                          onClick={() => { sounds.next(); onGoToScene(4); }}
                          className="text-primary font-mono text-[11px] uppercase tracking-wider hover:underline"
                        >
                          → Tinjau Siklus Calvin
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => { sounds.back(); setShowInner(false); }}
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Tampilan eksternal
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneLayout>
  );
};

export default Kloroplas;
