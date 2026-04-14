import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sounds } from "@/lib/sounds";

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
  totalScenes,
  onNext,
  onBack,
  showNav = true,
  nextLabel = "Selanjutnya",
  backLabel = "Kembali",
}: SceneLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Progress bar */}
      {currentScene > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-1 px-4 py-2">
            {sceneNames.map((name, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`h-1.5 w-full rounded-full transition-colors duration-500 ${
                    i <= currentScene
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
                <span className={`text-[10px] mt-1 hidden sm:block ${
                  i === currentScene ? "text-primary font-semibold" : "text-muted-foreground"
                }`}>
                  {name}
                </span>
              </div>
            ))}
          </div>
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

        <div className="flex-1 px-4 md:px-8 pb-24">
          {children}
        </div>
      </motion.div>

      {/* Navigation */}
      {showNav && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t border-border p-4">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            {onBack ? (
              <Button
                variant="outline"
                onClick={onBack}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                {backLabel}
              </Button>
            ) : (
              <div />
            )}
            {onNext && (
              <Button onClick={onNext} className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
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
