import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sounds } from "@/lib/sounds";
import { useNav } from "@/lib/navContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SceneLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  currentScene: number;
  totalScenes: number;
  onNext?: () => void;
  onBack?: () => void;
  showNav?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

const sceneNames = [
  "Pembuka",
  "Sel Tumbuhan",
  "Kloroplas",
  "Reaksi Terang",
  "Reaksi Gelap",
  "Rangkuman",
  "Latihan",
];

const SceneLayout = ({
  children,
  title,
  subtitle,
  currentScene,
  onNext,
  onBack,
  showNav = true,
  nextLabel = "Selanjutnya",
  backLabel = "Kembali",
}: SceneLayoutProps) => {
  const { goToScene, reset } = useNav();
  const [showSaved, setShowSaved] = useState(false);

  const handleJump = (i: number) => {
    if (i === currentScene) return;
    sounds.click?.();
    goToScene(i);
    setShowSaved(true);
    window.setTimeout(() => setShowSaved(false), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Progress bar */}
      {currentScene > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-1 px-4 py-2">
            {sceneNames.map((name, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleJump(i)}
                className="flex-1 flex flex-col items-center group cursor-pointer focus:outline-none"
                aria-label={`Pergi ke ${name}`}
                title={`Pergi ke ${name}`}
              >
                <div
                  className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                    i === currentScene
                      ? "bg-primary ring-2 ring-primary/40"
                      : i < currentScene
                      ? "bg-primary/80 group-hover:bg-primary"
                      : "bg-muted group-hover:bg-muted-foreground/40"
                  }`}
                />
                <span
                  className={`text-[10px] mt-1 hidden sm:block transition-colors ${
                    i === currentScene
                      ? "text-primary font-semibold"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {name}
                </span>
              </button>
            ))}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  onClick={() => sounds.popup?.()}
                  className="ml-2 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Reset progress"
                  title="Reset progress"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Progress pembelajaran kamu akan dihapus dan kembali ke awal.
                    Apakah yakin ingin melanjutkan?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      sounds.click?.();
                      reset();
                    }}
                  >
                    Ya, Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {showSaved && (
            <div className="absolute right-3 -bottom-6 text-[10px] font-mono text-primary bg-card border border-primary/30 rounded px-2 py-0.5 shadow-sm">
              ✓ Progress tersimpan
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <motion.div
        key={currentScene}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`flex-1 flex flex-col ${currentScene > 0 ? "pt-14" : ""}`}
      >
        {title && (
          <div className="text-center px-6 pt-6 pb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground mt-1 text-sm md:text-base">{subtitle}</p>
            )}
          </div>
        )}

        <div className="flex-1 px-4 md:px-8 pb-24">{children}</div>
      </motion.div>

      {/* Navigation */}
      {showNav && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t border-border p-4">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            {onBack ? (
              <Button
                variant="outline"
                onClick={() => {
                  sounds.back();
                  onBack();
                }}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                {backLabel}
              </Button>
            ) : (
              <div />
            )}
            {onNext && (
              <Button
                onClick={() => {
                  sounds.next();
                  onNext();
                }}
                className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {nextLabel}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SceneLayout;
