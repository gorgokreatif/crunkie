import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  separator?: string;
  className?: string;
  itemClassName?: string;
  speed?: "normal" | "slow" | "reverse";
  variant?: "light" | "dark" | "red";
}

const variantClasses = {
  light: "bg-crunkie-softcream text-crunkie-dark",
  dark: "bg-crunkie-dark text-crunkie-cream",
  red: "bg-crunkie-red text-crunkie-white",
};

const speedClasses = {
  normal: "animate-marquee",
  slow: "animate-marquee-slow",
  reverse: "animate-marquee-reverse",
};

export function Marquee({
  items,
  separator = "·",
  className,
  itemClassName,
  speed = "normal",
  variant = "light",
}: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div
      className={cn(
        "overflow-hidden py-4",
        variantClasses[variant],
        className
      )}
    >
      <div className={cn("flex w-max gap-0", speedClasses[speed])}>
        {doubled.map((item, i) => (
          <span
            key={i}
            className={cn(
              "flex items-center gap-6 px-6 font-sans text-sm font-semibold uppercase tracking-widest whitespace-nowrap",
              itemClassName
            )}
          >
            {item}
            <span className="opacity-40">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
