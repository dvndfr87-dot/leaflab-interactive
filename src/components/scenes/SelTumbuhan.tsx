import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import plantCellImg from "@/assets/plant-cell.jpg";
import SceneLayout from "@/components/SceneLayout";
import { sounds } from "@/lib/sounds";

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
    emoji: "CHL",
    desc: "Organel plastida bermembran ganda yang mengandung klorofil. Tempat berlangsungnya fotosintesis — mengubah energi cahaya menjadi energi kimia (ATP, NADPH) dan akhirnya glukosa.",
    top: "18%",
    left: "35%",
    w: "w-14",
    h: "h-8",
    isTarget: true,
  },
  {
    id: "nukleus",
    name: "Nukleus",
    emoji: "NUC",
    desc: "Inti sel yang menyimpan materi genetik (DNA) dan mengatur ekspresi gen serta seluruh aktivitas metabolik sel.",
    top: "45%",
    left: "50%",
    w: "w-12",
    h: "h-12",
  },
  {
    id: "vakuola",
    name: "Vakuola Sentral",
    emoji: "VAC",
    desc: "Organel besar berisi cairan sel (getah vakuola). Mengatur tekanan turgor, menyimpan air, ion, dan metabolit sekunder.",
    top: "55%",
    left: "30%",
    w: "w-20",
    h: "h-14",
  },
  {
    id: "dinding",
    name: "Dinding Sel",
    emoji: "CW",
    desc: "Lapisan kaku tersusun dari selulosa di luar membran plasma. Memberi bentuk, dukungan mekanik, dan proteksi sel tumbuhan.",
    top: "5%",
    left: "50%",
    w: "w-10",
    h: "h-6",
  },
  {
    id: "mitokondria",
    name: "Mitokondria",
    emoji: "MIT",
    desc: "Organel respirasi seluler. Mengoksidasi glukosa menjadi ATP melalui siklus Krebs dan rantai transpor elektron.",
    top: "70%",
    left: "60%",
    w: "w-10",
    h: "h-6",
  },
];

const SelTumbuhan = ({ onNext, onBack }: SelTumbuhanProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(new Set());

  const handleSelect = (org: Organelle) => {
    sounds.click();
    setSelectedId(org.id);
    setDiscoveredIds((prev) => new Set(prev).add(org.id));
  };

  const selected = organelles.find((o) => o.id === selectedId);
  const activeId = hoverId ?? selectedId;
  const discoveredCount = discoveredIds.size;
  const targetFound = discoveredIds.has("kloroplas1");

  return (
    <SceneLayout
      title="Sel Tumbuhan"
      subtitle="Temukan lokasi fotosintesis di dalam sel tumbuhan"
      currentScene={1}
      totalScenes={7}
      onBack={onBack}
      showNav={true}
      onNext={targetFound ? onNext : undefined}
      nextLabel="Lanjut ke Kloroplas"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-4 py-4">
        <p className="text-center text-sm text-muted-foreground max-w-lg">
          Pilih nama organel di panel kiri untuk menyorot lokasinya pada preparat.
          Temukan <strong className="text-primary">Kloroplas</strong> untuk melanjutkan.
        </p>

        {/* Checklist progress */}
        <div
          className="lab-panel w-full max-w-md p-4"
          role="region"
          aria-label="Daftar organel ditemukan"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="lab-label">Organel Ditemukan</span>
            <span className="lcd-readout" aria-live="polite" aria-atomic="true">
              {discoveredCount.toString().padStart(2, "0")}/
              {organelles.length.toString().padStart(2, "0")}
            </span>
          </div>
          <div
            className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-3"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={organelles.length}
            aria-valuenow={discoveredCount}
            aria-label={`${discoveredCount} dari ${organelles.length} organel ditemukan`}
          >
            <motion.div
              className="h-full bg-primary"
              initial={false}
              animate={{ width: `${(discoveredCount / organelles.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <ul className="grid grid-cols-2 gap-1.5 text-xs">
            {organelles.map((org) => {
              const found = discoveredIds.has(org.id);
              return (
                <li
                  key={org.id}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-colors ${
                    found
                      ? "bg-primary/10 border-primary/30 text-foreground"
                      : "bg-muted/40 border-border text-muted-foreground"
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 ${
                      found ? "text-primary" : "text-muted-foreground/40"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{org.name}</span>
                  <span className="sr-only">
                    {found ? "ditemukan" : "belum ditemukan"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5 w-full items-start">
          {/* Organelle name list */}
          <div className="lab-panel p-3 flex flex-col gap-1.5">
            <div className="lab-label mb-1">Organel</div>
            {organelles.map((org) => {
              const isActive = activeId === org.id;
              const isFound = discoveredIds.has(org.id);
              return (
                <button
                  key={org.id}
                  onClick={() => handleSelect(org)}
                  onMouseEnter={() => setHoverId(org.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onFocus={() => setHoverId(org.id)}
                  onBlur={() => setHoverId(null)}
                  aria-pressed={selectedId === org.id}
                  aria-label={`${org.name}${isFound ? " (sudah ditemukan)" : ""}`}
                  className={`group flex items-center justify-between gap-2 text-left px-2.5 py-2 rounded-md border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive
                      ? "bg-primary/15 border-primary text-foreground shadow-[0_0_0_2px_hsl(var(--primary)/0.25)]"
                      : "bg-card/40 border-border hover:border-primary/60 hover:bg-primary/5"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      aria-hidden="true"
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {org.emoji}
                    </span>
                    <span className="text-sm truncate">{org.name}</span>
                  </div>
                  {isFound && (
                    <CheckCircle2
                      className="w-3.5 h-3.5 text-primary shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Image with highlights */}
          <div className="relative justify-self-center">
            <motion.img
              src={plantCellImg}
              alt="Mikrograf sel tumbuhan dengan organel-organel yang dapat dipilih"
              className="rounded-xl shadow-lg max-w-full w-[400px]"
              width={400}
              height={400}
            />

            {/* Dim overlay when something is highlighted */}
            <AnimatePresence>
              {activeId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-xl bg-background/45 pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Highlight rings */}
            {organelles.map((org) => {
              const isActive = activeId === org.id;
              const isFound = discoveredIds.has(org.id);
              if (!isActive && !isFound) return null;
              return (
                <motion.div
                  key={org.id}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={
                    isActive
                      ? {
                          opacity: 1,
                          scale: [1, 1.18, 1],
                          boxShadow: [
                            "0 0 0 3px hsl(var(--primary)/0.9), 0 0 22px 6px hsl(var(--primary)/0.7)",
                            "0 0 0 3px hsl(var(--primary)/1), 0 0 38px 14px hsl(var(--primary)/0.9)",
                            "0 0 0 3px hsl(var(--primary)/0.9), 0 0 22px 6px hsl(var(--primary)/0.7)",
                          ],
                        }
                      : { opacity: 0.55, scale: 1 }
                  }
                  transition={
                    isActive
                      ? {
                          scale: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
                          boxShadow: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
                        }
                      : { duration: 0.3 }
                  }
                  className={`absolute ${org.w} ${org.h} rounded-full pointer-events-none border-2 ${
                    isActive
                      ? "border-primary bg-primary/25"
                      : "border-primary/50 bg-primary/10"
                  }`}
                  style={{ top: org.top, left: org.left }}
                />
              );
            })}

            {/* Floating label for active */}
            <AnimatePresence>
              {activeId && (
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-mono px-2.5 py-1 rounded shadow-lg whitespace-nowrap"
                >
                  {organelles.find((o) => o.id === activeId)?.name}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
              <div className="flex items-center gap-2 mb-2">
                <span className="specimen-chip">{selected.emoji}</span>
                <h3 className="font-semibold text-foreground">{selected.name}</h3>
                <span className="ml-auto text-[10px] font-mono text-primary flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ditemukan
                </span>
              </div>
              <p className="text-muted-foreground">{selected.desc}</p>
              {selected.isTarget && (
                <p className="mt-2 text-primary text-xs font-mono uppercase tracking-wider">
                  → Target organel teridentifikasi. Lanjutkan ke analisis ultrastruktur kloroplas.
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lab-panel p-4 max-w-md text-sm"
            >
              <div className="lab-label mb-2">Briefing</div>
              <p className="text-muted-foreground">
                Klik nama organel di panel sebelah untuk menyorot lokasinya pada preparat.
                Sel tumbuhan memiliki organel plastida bernama{" "}
                <strong className="text-primary">kloroplas</strong> yang mengandung klorofil.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneLayout>
  );
};

export default SelTumbuhan;
