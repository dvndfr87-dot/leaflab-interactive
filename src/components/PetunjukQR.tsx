import { QRCodeCanvas } from "qrcode.react";
import { QrCode, ExternalLink } from "lucide-react";

export const PETUNJUK_URL =
  "https://docs.google.com/document/d/1i8D2HKoFX0eNQFwUJvBy4qboz6gpFFNE/edit?usp=sharing";

interface PetunjukQRProps {
  size?: number;
  className?: string;
  caption?: string;
}

const PetunjukQR = ({
  size = 108,
  className = "",
  caption = "Pindai untuk membuka petunjuk penggunaan lengkap",
}: PetunjukQRProps) => {
  return (
    <figure
      className={`lab-panel flex items-center gap-3 p-3 rounded-md ${className}`}
    >
      <a
        href={PETUNJUK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-sm bg-white p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Buka dokumen petunjuk penggunaan media"
      >
        <QRCodeCanvas
          value={PETUNJUK_URL}
          size={size}
          level="M"
          marginSize={0}
          bgColor="#ffffff"
          fgColor="#0b1220"
        />
      </a>
      <figcaption className="text-left space-y-1">
        <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-primary">
          <QrCode className="w-3 h-3" />
          QR · PETUNJUK PENGGUNAAN
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{caption}</p>
        <a
          href={PETUNJUK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Buka dokumen <ExternalLink className="w-3 h-3" />
        </a>
      </figcaption>
    </figure>
  );
};

export default PetunjukQR;
