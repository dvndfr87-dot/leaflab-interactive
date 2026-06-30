import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import plantCellImg from "@/assets/plant-cell-id.jpg";
import SceneLayout from "@/components/SceneLayout";
import { sounds } from "@/lib/sounds";

interface SelTumbuhanProps {
  onNext: () => void;
  onBack: () => void;
}

interface Organelle {
  id: string;
  name: string;
  short: string;
  desc: string;
  /** Posisi marker (persentase relatif terhadap gambar `plant-cell-id.jpg`, 640×380). */
  top: string;
  left: string;
  /** Ukuran lingkaran sorotan. */
  size?: string;
  markerClass?: string;
  isTarget?: boolean;
}

/**
 * Organel sesuai diagram sel tumbuhan (label Bahasa Indonesia).
 * Posisi marker dikalibrasi terhadap ilustrasi baru `plant-cell-id.jpg`.
 */
const organelles: Organelle[] = [
  { id: "dinding-sel",    name: "Dinding Sel",          short: "DS", desc: "Lapisan kaku terluar yang tersusun dari selulosa. Memberi bentuk dan proteksi mekanik pada sel tumbuhan.", top: "7%",  left: "28%" },
  { id: "membran-plasma", name: "Membran Plasma",       short: "MP", desc: "Selaput tipis fosfolipid di dalam dinding sel. Mengatur lalu lintas molekul keluar-masuk sel secara selektif.", top: "17%", left: "30%" },
  { id: "sitoplasma",     name: "Sitoplasma",           short: "SP", desc: "Cairan sel tempat semua organel berada. Medium berlangsungnya banyak reaksi metabolik.", top: "26%", left: "31%" },
  { id: "inti-sel",       name: "Inti Sel (Nukleus)",   short: "IS", desc: "Pusat kendali sel. Menyimpan materi genetik (DNA) dan mengatur ekspresi gen serta seluruh aktivitas sel.", top: "21%", left: "70%", size: "w-14 h-14" },
  { id: "nukleolus",      name: "Nukleolus",            short: "NL", desc: "Bagian padat di dalam inti tempat sintesis RNA ribosom (rRNA) dan perakitan subunit ribosom.", top: "26%", left: "71%" },
  { id: "membran-inti",   name: "Membran Inti",         short: "MI", desc: "Selaput ganda yang membungkus inti sel. Memiliki pori-pori untuk lalu lintas RNA dan protein.", top: "32%", left: "74%" },
  { id: "kloroplas",      name: "Kloroplas",            short: "KL", desc: "Plastida hijau bermembran ganda yang mengandung klorofil. TEMPAT BERLANGSUNGNYA FOTOSINTESIS — mengubah energi cahaya menjadi glukosa.", top: "39%", left: "31%", size: "w-12 h-10", isTarget: true },
  { id: "mitokondria",    name: "Mitokondria",          short: "MT", desc: "Pembangkit energi sel. Mengoksidasi glukosa menjadi ATP melalui respirasi seluler.", top: "47%", left: "31%" },
  { id: "re",             name: "Retikulum Endoplasma", short: "RE", desc: "Jaringan membran tempat sintesis protein (RE Kasar dengan ribosom) dan lipid (RE Halus).", top: "43%", left: "74%" },
  { id: "badan-golgi",    name: "Badan Golgi",          short: "BG", desc: "Tumpukan kantung membran yang memodifikasi, menyortir, dan mengemas protein/lipid sebelum dikirim ke tujuannya.", top: "58%", left: "74%" },
  { id: "ribosom",        name: "Ribosom",              short: "RB", desc: "Mesin pembuat protein. Menerjemahkan mRNA menjadi rantai asam amino — bisa bebas di sitosol atau menempel pada RE Kasar.", top: "67%", left: "74%" },
  { id: "vakuola-tengah", name: "Vakuola Tengah",       short: "VT", desc: "Vakuola besar berisi getah sel. Mengatur tekanan turgor, menyimpan air, ion, dan metabolit sekunder.", top: "60%", left: "46%", size: "w-14 h-12" },
  { id: "peroksisom",     name: "Peroksisom",           short: "PR", desc: "Organel kecil bermembran tunggal. Mengurai asam lemak dan menetralkan hidrogen peroksida (H₂O₂) berbahaya.", top: "72%", left: "31%" },
  { id: "plasmodesmata",  name: "Plasmodesmata",        short: "PM", desc: "Saluran sitoplasma kecil yang menembus dinding sel — jalur komunikasi antar sel tumbuhan yang bersebelahan.", top: "88%", left: "31%" },
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
  const targetFound = discoveredIds.has("kloroplas");

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
          Klik <strong className="text-primary">nama organel</strong> di daftar atau langsung pada <strong className="text-primary">marker</strong> di gambar untuk mempelajarinya. Temukan{" "}
          <strong className="text-[hsl(var(--glucose))]">Kloroplas</strong> untuk melanjutkan.
        </p>

        {/* Checklist progress */}
        <div className="lab-panel w-full max-w-md p-4" role="region" aria-label="Daftar organel ditemukan">
          <div className="flex items-center justify-between mb-2">
            <span className="lab-label">Organel Ditemukan</span>
            <span className="lcd-readout" aria-live="polite" aria-atomic="true">
              {discoveredCount.toString().padStart(2, "0")}/{organelles.length.toString().padStart(2, "0")}
            </span>
          </div>
          <div
            className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-1"
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 w-full items-start">
          {/* Organelle name list */}
          <div className="lab-panel p-3 flex flex-col gap-1 max-h-[500px] overflow-y-auto">
            <div className="lab-label mb-1 sticky top-0 bg-card pb-1">Daftar Organel</div>
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
                  className={`group flex items-center justify-between gap-2 text-left px-2 py-1.5 rounded-md border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive
                      ? org.isTarget
                        ? "bg-[hsl(var(--glucose)/0.15)] border-[hsl(var(--glucose))] text-foreground"
                        : "bg-primary/15 border-primary text-foreground"
                      : "bg-card/40 border-border hover:border-primary/60 hover:bg-primary/5"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      aria-hidden="true"
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                        isActive
                          ? org.isTarget
                            ? "bg-[hsl(var(--glucose))] text-white"
                            : "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {org.short}
                    </span>
                    <span className="text-[12px] truncate">{org.name}</span>
                  </div>
                  {isFound && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {/* Image with clickable markers */}
          <figure className="relative justify-self-center m-0">
            <div className="relative">
              <motion.img
                src={plantCellImg}
                alt="Diagram sel tumbuhan dengan label dalam Bahasa Indonesia"
                className="rounded-xl shadow-lg max-w-full w-[420px] block"
                width={420}
                height={249}
              />

              {/* Dim overlay when something is highlighted */}
              <AnimatePresence>
                {activeId && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-xl bg-background/35 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Clickable markers untuk setiap organel */}
              {organelles.map((org) => {
                const isActive = activeId === org.id;
                const isFound = discoveredIds.has(org.id);
                const size = org.size ?? "w-6 h-6";
                // Default: transparent + subtle dashed ring. Active (hover/click): kuning, kecuali kloroplas yang pakai ungu khas.
                const activeStyle = org.isTarget
                  ? "border-purple-600 bg-purple-500/70 shadow-[0_0_0_4px_rgb(168_85_247_/_0.45),0_0_22px_8px_rgb(168_85_247_/_0.55)] animate-pulse"
                  : "border-yellow-500 bg-yellow-400/80 shadow-[0_0_0_4px_rgb(250_204_21_/_0.5),0_0_18px_6px_rgb(250_204_21_/_0.55)] animate-pulse";
                const idleStyle = org.isTarget
                  ? "border-purple-500/70 border-dashed bg-transparent hover:bg-purple-400/30 hover:border-purple-600"
                  : "border-foreground/40 border-dashed bg-transparent hover:bg-yellow-300/40 hover:border-yellow-500";
                const foundIdle = org.isTarget
                  ? "border-purple-500 bg-purple-400/25"
                  : "border-yellow-500/80 bg-yellow-300/30";
                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => handleSelect(org)}
                    onMouseEnter={() => setHoverId(org.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onFocus={() => setHoverId(org.id)}
                    onBlur={() => setHoverId(null)}
                    aria-label={`Marker ${org.name}`}
                    style={{ top: org.top, left: org.left, transform: "translate(-50%, -50%)" }}
                    className={`absolute ${size} rounded-full border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center cursor-pointer ${
                      isActive ? activeStyle : isFound ? foundIdle : idleStyle
                    }`}
                  >
                    <span
                      className={`font-mono text-[9px] font-bold pointer-events-none ${
                        isActive ? "text-white" : isFound ? (org.isTarget ? "text-purple-800" : "text-yellow-800") : "text-foreground/70"
                      }`}
                      aria-hidden="true"
                    >
                      {isFound ? "✓" : "+"}
                    </span>
                  </button>
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
                    className={`absolute -bottom-3 left-1/2 -translate-x-1/2 text-xs font-mono px-2.5 py-1 rounded shadow-lg whitespace-nowrap z-10 ${
                      activeId === "kloroplas" ? "bg-[hsl(var(--glucose))] text-white" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {organelles.find((o) => o.id === activeId)?.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <figcaption className="mt-4 text-[11px] text-muted-foreground text-center italic">
              Sumber: Ilustrasi Virtual Lab Fotosintesis (2026) — label dalam Bahasa Indonesia.
            </figcaption>
          </figure>
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
                  ? "bg-[hsl(var(--glucose)/0.08)] border-[hsl(var(--glucose)/0.4)]"
                  : "bg-card border-border"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="specimen-chip">{selected.short}</span>
                <h3 className="font-semibold text-foreground">{selected.name}</h3>
                <span className="ml-auto text-[10px] font-mono text-primary flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ditemukan
                </span>
              </div>
              <p className="text-muted-foreground">{selected.desc}</p>
              {selected.isTarget && (
                <p className="mt-2 text-[hsl(var(--glucose))] text-xs font-mono uppercase tracking-wider">
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
              <div className="lab-label mb-2">Petunjuk</div>
              <p className="text-muted-foreground">
                Setiap titik bertanda <span className="font-mono">+</span> pada gambar adalah penanda organel yang dapat diklik. Cari{" "}
                <strong className="text-[hsl(var(--glucose))]">Kloroplas</strong> — organel hijau tempat berlangsungnya fotosintesis — untuk melanjutkan ke tahap berikutnya.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneLayout>
  );
};

export default SelTumbuhan;
