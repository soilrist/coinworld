const PATHS: Record<string, string> = {
  harvest: "M32 8 C40 20 40 32 32 40 M32 40 C20 40 14 50 14 58 M20 20 C26 24 28 30 26 36",
  sort: "M12 44 L52 44 M18 44 L18 24 L30 16 L46 26 L46 44 M30 16 L30 44",
  cure: "M32 10 C44 10 52 20 52 32 C52 44 44 54 32 54 C20 54 12 44 12 32 C12 20 20 10 32 10 Z M32 20 L32 44 M20 32 L44 32",
  pack: "M12 22 L32 10 L52 22 L52 46 L32 58 L12 46 Z M12 22 L32 34 L52 22 M32 34 L32 58",
  ship: "M8 40 L8 22 L36 22 L36 40 M36 28 L48 28 L54 36 L54 40 L36 40 M14 46 a4 4 0 1 0 0.1 0 M46 46 a4 4 0 1 0 0.1 0",
};

export function StepIcon({ name, className }: { name: keyof typeof PATHS; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="presentation" aria-hidden="true">
      <path d={PATHS[name]} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
