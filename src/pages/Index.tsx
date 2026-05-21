import { useState, useCallback, useEffect } from "react";
import Pembuka from "@/components/scenes/Pembuka";
import SelTumbuhan from "@/components/scenes/SelTumbuhan";
import Kloroplas from "@/components/scenes/Kloroplas";
import ReaksiTerang from "@/components/scenes/ReaksiTerang";
import ReaksiGelap from "@/components/scenes/ReaksiGelap";
import Rangkuman from "@/components/scenes/Rangkuman";
import Latihan from "@/components/scenes/Latihan";
import { AnimatePresence } from "framer-motion";
import { NavProvider } from "@/lib/navContext";

const STORAGE_KEY = "vlab_current_scene";

const Index = () => {
  const [scene, setScene] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const n = saved ? parseInt(saved, 10) : 0;
    return Number.isFinite(n) && n >= 0 && n <= 6 ? n : 0;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(scene));
    } catch {}
  }, [scene]);

  const next = useCallback(() => setScene(s => Math.min(6, s + 1)), []);
  const back = useCallback(() => setScene(s => Math.max(0, s - 1)), []);
  const goToScene = useCallback((s: number) => setScene(Math.max(0, Math.min(6, s))), []);
  const reset = useCallback(() => {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
    setScene(0);
  }, []);

  return (
    <NavProvider value={{ goToScene, reset }}>
      <AnimatePresence mode="wait">
        {scene === 0 && <Pembuka key="pembuka" onStart={next} />}
        {scene === 1 && <SelTumbuhan key="sel" onNext={next} onBack={back} />}
        {scene === 2 && <Kloroplas key="kloroplas" onNext={next} onBack={back} onGoToScene={goToScene} />}
        {scene === 3 && <ReaksiTerang key="terang" onNext={next} onBack={back} />}
        {scene === 4 && <ReaksiGelap key="gelap" onNext={next} onBack={back} />}
        {scene === 5 && <Rangkuman key="rangkuman" onNext={next} onBack={back} />}
        {scene === 6 && <Latihan key="latihan" onBack={back} onGoHome={reset} />}
      </AnimatePresence>
    </NavProvider>
  );
};

export default Index;
