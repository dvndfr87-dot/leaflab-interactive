import { motion } from "framer-motion";
import { Play, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import heroImg from "@/assets/hero-photosynthesis.jpg";

interface PembukaProps {
  onStart: () => void;
}

const Pembuka = ({ onStart }: PembukaProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background */}
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
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 mb-6"
        >
          <span className="text-4xl">🌿</span>
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Virtual Laboratorium
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">
          Fotosintesis
        </h2>
        <p className="text-muted-foreground mb-8 text-sm md:text-base">
          Jelajahi dunia fotosintesis melalui simulasi interaktif. Pelajari bagaimana tumbuhan mengubah cahaya matahari menjadi energi!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            onClick={onStart}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          >
            <Play className="w-5 h-5" />
            Mulai
          </Button>

          <Dialog>
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
                  <li>Klik tombol <strong>"Mulai"</strong> untuk memulai simulasi.</li>
                  <li>Ikuti setiap tahapan pembelajaran secara berurutan.</li>
                  <li>Klik objek atau bagian yang ditunjuk untuk melihat penjelasan lebih lanjut.</li>
                  <li>Perhatikan animasi yang ditampilkan pada setiap proses.</li>
                  <li>Gunakan tombol <strong>"Next"</strong> untuk melanjutkan dan <strong>"Back"</strong> untuk kembali ke tahap sebelumnya.</li>
                </ol>
                <hr className="border-border" />
                <p className="font-semibold">Saat Mengamati Simulasi:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Perhatikan lokasi terjadinya reaksi terang dan reaksi gelap.</li>
                  <li>Amati proses yang terjadi pada setiap tahap fotosintesis.</li>
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
                <p>Media ini bertujuan membantu siswa memahami hubungan antara reaksi terang dan reaksi gelap dalam proses fotosintesis.</p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
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
                  <li>Mengidentifikasi lokasi reaksi terang dan reaksi gelap dalam kloroplas</li>
                  <li>Menjelaskan proses reaksi terang (input, proses, output)</li>
                  <li>Menjelaskan proses reaksi gelap (input, proses, output)</li>
                  <li>Menjelaskan hubungan antara reaksi terang dan reaksi gelap</li>
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
