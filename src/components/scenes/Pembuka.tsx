import { motion } from "framer-motion";
import { Play, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import heroImg from "@/assets/hero-photosynthesis.jpg";
import { sounds } from "@/lib/sounds";

interface PembukaProps {
  onStart: () => void;
}

const Pembuka = ({ onStart }: PembukaProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-lg"
      >
        {/* Module identifier */}
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

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            onClick={() => {
              sounds.start();
              onStart();
            }}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          >
            <Play className="w-5 h-5" />
            Mulai
          </Button>

          <Dialog onOpenChange={(open) => open && sounds.popup()}>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline" className="gap-2">
                <BookOpen className="w-5 h-5" />
                Petunjuk
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Cara Menggunakan Media</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm text-foreground">
                <p className="font-semibold">Cara Menggunakan Media:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>
                    Klik tombol <strong>"Mulai"</strong> untuk memulai simulasi.
                  </li>
                  <li>Ikuti setiap tahapan pembelajaran secara berurutan.</li>
                  <li>
                    Klik objek atau bagian yang ditunjuk untuk melihat
                    penjelasan lebih lanjut.
                  </li>
                  <li>
                    Perhatikan animasi yang ditampilkan pada setiap proses.
                  </li>
                  <li>
                    Gunakan tombol <strong>"Next"</strong> untuk melanjutkan dan{" "}
                    <strong>"Back"</strong> untuk kembali ke tahap sebelumnya.
                  </li>
                </ol>
                <hr className="border-border" />
                <p className="font-semibold">Saat Mengamati Simulasi:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Perhatikan lokasi terjadinya reaksi terang dan reaksi gelap.
                  </li>
                  <li>
                    Amati proses yang terjadi pada setiap tahap fotosintesis.
                  </li>
                  <li>Fokus pada perubahan yang ditunjukkan dalam animasi.</li>
                </ul>
                <hr className="border-border" />
                <p className="font-semibold">Pengerjaan Latihan:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bacalah setiap soal dengan teliti.</li>
                  <li>Pilih atau seret jawaban sesuai instruksi.</li>
                  <li>Periksa kembali jawaban sebelum melanjutkan.</li>
                </ul>
                <hr className="border-border" />
                <p className="font-semibold">Tujuan Penggunaan:</p>
                <p>
                  Media ini bertujuan membantu siswa memahami hubungan antara
                  reaksi terang dan reaksi gelap dalam proses fotosintesis.
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog onOpenChange={(open) => open && sounds.popup()}>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline" className="gap-2">
                <Target className="w-5 h-5" />
                Tujuan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tujuan Pembelajaran</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm text-foreground">
                <p>Setelah menggunakan media ini, siswa diharapkan mampu:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Mengidentifikasi lokasi reaksi terang dan reaksi gelap dalam
                    kloroplas
                  </li>
                  <li>
                    Menjelaskan proses reaksi terang (input, proses, output)
                  </li>
                  <li>
                    Menjelaskan proses reaksi gelap (input, proses, output)
                  </li>
                  <li>
                    Menjelaskan hubungan antara reaksi terang dan reaksi gelap
                  </li>
                </ol>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
    </div>
  );
};

export default Pembuka;
