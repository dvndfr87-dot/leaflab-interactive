import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";
import { ReactNode } from "react";

export interface InfoEntry {
  id: string;
  label: string;
  title: string;
  description: string;
}

interface Props {
  entry: InfoEntry;
  children?: ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
}

/**
 * Reusable clickable info label.
 * Wraps any label / chip / button. On click, opens a popover with
 * educational explanation (title + description).
 */
const InfoLabel = ({ entry, children, className = "", side = "top" }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Info: ${entry.label}`}
          className={
            "inline-flex items-center gap-1 cursor-pointer rounded transition-colors " +
            "hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
            className
          }
        >
          {children ?? <span className="font-semibold">{entry.label}</span>}
          <Info className="w-3 h-3 text-primary/80 shrink-0" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent side={side} className="w-72 text-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              {entry.label}
            </span>
          </div>
          <h4 className="font-semibold text-foreground text-sm leading-snug">{entry.title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{entry.description}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InfoLabel;
