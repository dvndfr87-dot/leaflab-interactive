import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const READ_KEY = "vlab_petunjuk_read";

const Pembuka = ({ onStart }: PembukaProps) => {
  const [open, setOpen] = useState(false);
  const [hasRead, setHasRead] = useState(false);

  useEffect(() => {
    try {
      setHasRead(window.localStorage.getItem(READ_KEY) === "1");
    } catch {}
  }, []);

  const markRead = () => {
    try {
      window.localStorage.setItem(READ_KEY, "1");
    } catch {}
    setHasRead(true);
    sounds.success?.();
    setOpen(false);
  };

  const openPetunjuk = () => {
    sounds.popup();
    setOpen(true);
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
        <p className="text-muted-foreground mb-6 text-sm md:text-base">
          Modul simulasi yang memvisualisasikan mekanisme fotosintesis pada
          tingkat seluler — meliputi reaksi terang di membran tilakoid dan
          reaksi gelap (Siklus Calvin) di stroma kloroplas.
        </p>

        {/* Status indicator */}
        <AnimatePresence mode="wait">
          <motion.div
            key={hasRead ? "ok" : "wait"}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className={`inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-xs font-mono border ${
              hasRead
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }`}
          >
            {hasRead ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Petunjuk sudah dibaca
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                Silakan baca petunjuk terlebih dahulu
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            disabled={!hasRead}
            onClick={() => {
              if (!hasRead) return;
              sounds.start();
              onStart();
            }}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            Mulai
          </Button>

          <Button size="lg" variant="outline" className="gap-2" onClick={openPetunjuk}>
            <BookOpen className="w-5 h-5" />
            Petunjuk
            {hasRead && <CheckCircle2 className="w-4 h-4 text-primary" />}
          </Button>
        </div>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cara Menggunakan Media</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-foreground max-h-[60vh] overflow-y-auto pr-1">
            <p className="font-semibold">Cara Menggunakan Media:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                Klik tombol <strong>"Mulai"</strong> untuk memulai simulasi.
              </li>
              <li>Ikuti setiap tahapan pembelajaran secara berurutan.</li>
              <li>Klik objek atau bagian yang ditunjuk untuk melihat penjelasannya.</li>
              <li>Perhatikan animasi yang ditampilkan pada setiap proses.</li>
              <li>
                Gunakan tombol <strong>"Next"</strong> untuk melanjutkan dan{" "}
                <strong>"Back"</strong> untuk kembali ke tahap sebelumnya.
              </li>
            </ol>
            <hr className="border-border" />
            <p className="font-semibold">Saat Mengamati Simulasi:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Perhatikan lokasi terjadinya reaksi terang dan reaksi gelap.</li>
              <li>Amati proses pada setiap tahap fotosintesis.</li>
              <li>Fokus pada perubahan yang ditunjukkan dalam animasi.</li>
            </ul>
            <hr className="border-border" />
            <p className="font-semibold">Pengerjaan Latihan:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Bacalah setiap soal dengan teliti.</li>
              <li>Pilih atau seret jawaban sesuai instruksi.</li>
              <li>Periksa kembali jawaban sebelum melanjutkan.</li>
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={markRead} className="w-full sm:w-auto gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Saya Mengerti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pembuka;
