import { useState } from "react";
import { motion } from "framer-motion";
import { Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import heroImg from "@/assets/hero-photosynthesis.jpg";
import { sounds } from "@/lib/sounds";

interface PembukaProps {
  onStart: () => void;
}

const Pembuka = ({ onStart }: PembukaProps) => {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleMulai = () => {
    sounds.popup?.();
    setConfirmed(false);
    setOpen(true);
  };

  const handleLanjut = () => {
    if (!confirmed) return;
    sounds.start?.();
    setOpen(false);
    onStart();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-lg"
      >
        <div className="inline-flex flex-col items-center gap-2 mb-6">
          <div className="font-mono text-[10px] tracking-widest text-primary/80 border border-primary/30 rounded px-2 py-0.5">
            MODUL · VLAB-PHOTO-01
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Virtual Laboratorium Fotosintesis
        </h1>
        <h2 className="text-base md:text-lg font-medium text-primary mb-4 font-mono">
          6 CO₂ + 6 H₂O ⟶ C₆H₁₂O₆ + 6 O₂
        </h2>
        <p className="text-muted-foreground mb-8 text-sm md:text-base">
          Modul simulasi yang memvisualisasikan mekanisme fotosintesis pada
          tingkat seluler — meliputi reaksi terang di membran tilakoid dan
          reaksi gelap (Siklus Calvin) di stroma kloroplas.
        </p>

        <Button
          size="lg"
          onClick={handleMulai}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
        >
          <Play className="w-5 h-5" />
          Mulai
        </Button>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Petunjuk Penggunaan</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-foreground max-h-[55vh] overflow-y-auto pr-1">
            <p className="font-semibold">Cara Menggunakan Media:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Ikuti setiap tahapan pembelajaran secara berurutan.</li>
              <li>Klik objek atau bagian yang ditunjuk untuk melihat penjelasannya.</li>
              <li>Perhatikan animasi yang ditampilkan pada setiap proses.</li>
              <li>
                Gunakan tombol <strong>"Selanjutnya"</strong> untuk melanjutkan dan{" "}
                <strong>"Kembali"</strong> untuk kembali ke tahap sebelumnya.
              </li>
              <li>
                Kamu dapat melompat ke bagian tertentu (mis. Kloroplas, Latihan)
                lewat progress bar di atas.
              </li>
            </ol>
            <hr className="border-border" />
            <p className="font-semibold">Saat Mengamati Simulasi:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Perhatikan lokasi terjadinya reaksi terang dan reaksi gelap.</li>
              <li>Amati proses pada setiap tahap fotosintesis.</li>
              <li>Geser slider parameter dan amati perubahan grafik & status.</li>
            </ul>
            <hr className="border-border" />
            <p className="font-semibold">Pengerjaan Latihan:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Bacalah setiap soal dengan teliti.</li>
              <li>Pilih atau seret jawaban sesuai instruksi.</li>
              <li>Periksa kembali jawaban sebelum melanjutkan.</li>
            </ul>
          </div>

          <label className="flex items-start gap-2 p-3 rounded-md border border-border bg-muted/40 cursor-pointer">
            <Checkbox
              checked={confirmed}
              onCheckedChange={(v) => setConfirmed(v === true)}
              className="mt-0.5"
            />
            <span className="text-xs text-foreground leading-relaxed">
              Saya telah membaca dan memahami seluruh petunjuk penggunaan di atas.
            </span>
          </label>

          <DialogFooter>
            <Button
              onClick={handleLanjut}
              disabled={!confirmed}
              className="w-full sm:w-auto gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              Lanjutkan ke Simulasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pembuka;
