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
 * 22 organel sesuai diagram Bioearthworm/Encyclopaedia Britannica (2008).
 * Nama semua dalam Bahasa Indonesia. Banyak penanda klik tersebar di seluruh sel.
 */
const organelles: Organelle[] = [
  { id: "membran-inti",   name: "Membran Inti",        short: "MI",  desc: "Selaput ganda yang membungkus inti sel. Memiliki pori-pori untuk mengatur keluar-masuknya RNA dan protein antara inti dan sitoplasma.", top: "12%", left: "60%" },
  { id: "kromatin",       name: "Kromatin",            short: "KR",  desc: "Untaian DNA + protein histon di dalam inti. Sumber informasi genetik yang akan diekspresikan menjadi protein.", top: "18%", left: "62%" },
  { id: "nukleolus",      name: "Nukleolus",           short: "NL",  desc: "Bagian padat di dalam inti tempat sintesis RNA ribosom (rRNA) dan perakitan subunit ribosom.", top: "23%", left: "60%" },
  { id: "inti-sel",       name: "Inti Sel (Nukleus)",  short: "IS",  desc: "Pusat kendali sel. Menyimpan materi genetik (DNA) dan mengatur ekspresi gen, pembelahan sel, serta seluruh aktivitas metabolik.", top: "29%", left: "58%", size: "w-16 h-16" },
  { id: "nukleoplasma",   name: "Nukleoplasma",        short: "NP",  desc: "Cairan kental di dalam inti sel tempat kromatin dan nukleolus berada.", top: "33%", left: "62%" },
  { id: "re-halus",       name: "RE Halus",            short: "RH",  desc: "Retikulum endoplasma halus — jaringan membran tanpa ribosom. Berperan dalam sintesis lipid dan detoksifikasi.", top: "40%", left: "70%" },
  { id: "re-kasar",       name: "RE Kasar",            short: "RK",  desc: "Retikulum endoplasma kasar — ditempeli ribosom. Tempat sintesis protein untuk diekspor atau dimasukkan ke organel.", top: "46%", left: "70%" },
  { id: "kloroplas",      name: "Kloroplas",           short: "KL",  desc: "Plastida hijau bermembran ganda yang mengandung klorofil. TEMPAT BERLANGSUNGNYA FOTOSINTESIS — mengubah energi cahaya menjadi glukosa.", top: "53%", left: "58%", size: "w-12 h-10", markerClass: "border-[hsl(var(--glucose))] bg-[hsl(var(--glucose)/0.25)] shadow-[0_0_0_3px_hsl(var(--glucose)/0.9),0_0_22px_6px_hsl(var(--glucose)/0.7)]", isTarget: true },
  { id: "plastida",       name: "Plastida",            short: "PL",  desc: "Kelompok organel pada tumbuhan (kloroplas, kromoplas, leukoplas) yang menyimpan pigmen atau cadangan makanan.", top: "59%", left: "72%" },
  { id: "dinding-sel",    name: "Dinding Sel",         short: "DS",  desc: "Lapisan kaku di luar membran plasma. Tersusun dari selulosa, memberi bentuk dan proteksi sel tumbuhan.", top: "63%", left: "80%", size: "w-12 h-8" },
  { id: "selulosa",       name: "Selulosa",            short: "SL",  desc: "Polisakarida penyusun utama dinding sel tumbuhan. Memberikan kekuatan struktural seperti rangka.", top: "73%", left: "72%" },
  { id: "sitoskeleton",   name: "Sitoskeleton",        short: "SK",  desc: "Jaringan filamen protein (mikrotubulus, mikrofilamen) yang menopang bentuk sel dan membantu pergerakan organel.", top: "76%", left: "74%" },
  { id: "plasmodesmata",  name: "Plasmodesmata",       short: "PM",  desc: "Saluran sitoplasma kecil yang menghubungkan dua sel tumbuhan bersebelahan melalui dinding sel — jalur komunikasi antar sel.", top: "82%", left: "62%" },
  { id: "membran-plasma", name: "Membran Plasma",      short: "MP",  desc: "Lapisan tipis fosfolipid di dalam dinding sel. Mengatur lalu lintas molekul keluar-masuk sel secara selektif.", top: "84%", left: "48%" },
  { id: "sitosol",        name: "Protoplasma / Sitosol", short: "ST", desc: "Cairan sel tempat organel berada. Medium tempat berlangsungnya banyak reaksi metabolik.", top: "78%", left: "44%" },
  { id: "peroksisom",     name: "Peroksisom",          short: "PR",  desc: "Organel kecil bermembran tunggal. Mengurai asam lemak dan menetralkan hidrogen peroksida (H₂O₂) berbahaya.", top: "72%", left: "38%" },
  { id: "mitokondria",    name: "Mitokondria",         short: "MT",  desc: "Pembangkit energi sel. Mengoksidasi glukosa menjadi ATP melalui respirasi seluler (siklus Krebs + rantai transpor elektron).", top: "65%", left: "30%" },
  { id: "lamella-tengah", name: "Lamella Tengah",      short: "LT",  desc: "Lapisan pektin di antara dinding dua sel bersebelahan yang merekatkan keduanya.", top: "57%", left: "27%" },
  { id: "vakuola-tengah", name: "Vakuola Tengah",      short: "VT",  desc: "Vakuola besar berisi getah sel. Mengatur tekanan turgor, menyimpan air, ion, dan metabolit sekunder pada sel tumbuhan dewasa.", top: "46%", left: "30%", size: "w-14 h-12" },
  { id: "badan-golgi",    name: "Badan Golgi",         short: "BG",  desc: "Tumpukan kantung membran yang memodifikasi, menyortir, dan mengemas protein/lipid hasil dari RE sebelum dikirim ke tujuannya.", top: "39%", left: "27%" },
  { id: "ribosom",        name: "Ribosom",             short: "RB",  desc: "Mesin pembuat protein. Menerjemahkan mRNA menjadi rantai asam amino — bisa bebas di sitosol atau menempel pada RE Kasar.", top: "33%", left: "27%" },
  { id: "vakuola-vesikel",name: "Vakuola / Vesikel",   short: "VV",  desc: "Kantung kecil bermembran untuk transpor zat di dalam sel atau menyimpan cadangan jangka pendek.", top: "25%", left: "30%" },
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
                const size = org.size ?? "w-7 h-7";
                const customMarker = org.markerClass;
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
                      isActive
                        ? customMarker ??
                          "border-primary bg-primary/30 shadow-[0_0_0_3px_hsl(var(--primary)/0.85),0_0_22px_6px_hsl(var(--primary)/0.6)] animate-pulse"
                        : isFound
                        ? customMarker
                          ? "border-[hsl(var(--glucose))]/70 bg-[hsl(var(--glucose)/0.2)]"
                          : "border-primary/60 bg-primary/15"
                        : "border-white/80 bg-white/20 backdrop-blur-[1px] hover:border-primary hover:bg-primary/30"
                    }`}
                  >
                    <span
                      className={`font-mono text-[8px] font-bold pointer-events-none ${
                        isActive || isFound ? (org.isTarget ? "text-[hsl(var(--glucose-foreground,0_0%_100%))] text-white" : "text-primary-foreground") : "text-foreground/80"
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
              Sumber: Encyclopaedia Britannica, Inc. (2008) — diadaptasi via bioearthworm.wordpress.com (label Bahasa Indonesia).
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
