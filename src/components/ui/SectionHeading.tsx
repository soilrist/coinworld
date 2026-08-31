interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
}

export function SectionHeading({ eyebrow, title, description, align = "left", tone = "dark" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2
        className={`text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.25] font-serif font-semibold text-balance ${
          tone === "light" ? "text-ivory-100" : "text-soil-700"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base md:text-lg leading-relaxed ${tone === "light" ? "text-ivory-300" : "text-charcoal-500"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
