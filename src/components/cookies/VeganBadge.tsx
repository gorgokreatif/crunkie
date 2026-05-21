import { cn } from "@/lib/utils";

interface VeganBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function VeganBadge({ className, size = "md" }: VeganBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-sans font-bold uppercase tracking-wider text-crunkie-white",
        size === "sm" && "px-2 py-0.5 text-[9px]",
        size === "md" && "px-3 py-1 text-xs",
        size === "lg" && "px-4 py-1.5 text-sm",
        className
      )}
      style={{ backgroundColor: "#4A8C5C" }}
    >
      <span
        className={cn(
          "rounded-full bg-white/40",
          size === "sm" && "h-1.5 w-1.5",
          size === "md" && "h-2 w-2",
          size === "lg" && "h-2.5 w-2.5"
        )}
      />
      Vegan
    </span>
  );
}
