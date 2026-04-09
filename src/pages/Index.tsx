import { useState, useCallback } from "react";
import Pembuka from "@/components/scenes/Pembuka";
import SelTumbuhan from "@/components/scenes/SelTumbuhan";
import Kloroplas from "@/components/scenes/Kloroplas";
import ReaksiTerang from "@/components/scenes/ReaksiTerang";
import ReaksiGelap from "@/components/scenes/ReaksiGelap";
import Simulasi from "@/components/scenes/Simulasi";
import Rangkuman from "@/components/scenes/Rangkuman";
import Latihan from "@/components/scenes/Latihan";
import { AnimatePresence } from "framer-motion";

const Index = () => {
  const [scene, setScene] = useState(0);

  const next = useCallback(() => setScene(s => Math.min(7, s + 1)), []);
  const back = useCallback(() => setScene(s => Math.max(0, s - 1)), []);
  const goTo = useCallback((s: number) => setScene(s), []);

  return (
    <AnimatePresence mode="wait">
      {scene === 0 && <Pembuka key="pembuka" onStart={next} />}
      {scene === 1 && <SelTumbuhan key="sel" onNext={next} onBack={back} />}
      {scene === 2 && <Kloroplas key="kloroplas" onNext={next} onBack={back} onGoToScene={goTo} />}
      {scene === 3 && <ReaksiTerang key="terang" onNext={next} onBack={back} />}
      {scene === 4 && <ReaksiGelap key="gelap" onNext={next} onBack={back} />}
      {scene === 5 && <Simulasi key="simulasi" onNext={next} onBack={back} />}
      {scene === 6 && <Rangkuman key="rangkuman" onNext={next} onBack={back} />}
      {scene === 7 && <Latihan key="latihan" onBack={back} />}
    </AnimatePresence>
  );
};

export default Index;
