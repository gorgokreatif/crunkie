export function CookieMarquee({ names }: { names: string[] }) {
  const doubled = [...names, ...names];

  return (
    <div className="overflow-hidden bg-crunkie-red py-5">
      <div className="flex w-max animate-marquee items-center gap-0">
        {doubled.map((name, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap px-8 font-display font-black italic text-crunkie-white/90"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)", lineHeight: 1 }}
          >
            {name}
            <span className="text-crunkie-white/35" style={{ fontSize: "0.5em" }}>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
