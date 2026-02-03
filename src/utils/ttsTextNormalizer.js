/**
 * Normalizes text for reading via Text-to-Speech in Spanish (AR)
 * Does not modify visual content.
 */
export function normalizeTextForTTS(rawText) {
  if (!rawText) return "";

  let text = rawText;

  // Numerical dates: 14/01/2026 o 14-01-2026
  text = text.replace(
    /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/g,
    (_, d, m, y) => {
      const date = new Date(`${y}-${m}-${d}`);
      return date.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
  );

  // Standardized text dates (in case they are inconsistent)
  text = text.replace(
    /\b(\d{1,2}) de ([a-záéíóúñ]+) de (\d{4})\b/gi,
    (_, d, m, y) => `${d} de ${m.toLowerCase()} de ${y}`,
  );

  // Numbers with thousands separator: 15,000 → 15000
  text = text.replace(/\b\d{1,3}(\.\d{3})+\b/g, (match) =>
    match.replace(/\./g, ""),
  );

  // Real decimals: 3.5 → 3 point 5
  text = text.replace(
    /\b(\d+),(\d+)\b/g,
    (_, int, dec) => `${int} coma ${dec}`,
  );

  // Percentages: 25% → 25 percent
  text = text.replace(/\b(\d+)\s?%\b/g, (_, n) => `${n} por ciento`);

  // Currency: $15,000 → 15,000 pesos
  text = text.replace(
    /\$\s?(\d+(\.\d{3})*)/g,
    (_, n) => `${n.replace(/\./g, "")} pesos`,
  );

  // Degrees: 30° → 30 degrees
  text = text.replace(/\b(\d+)\s?°\b/g, (_, n) => `${n} grados`);

  // Final cleaning of spaces
  return text.replace(/\s+/g, " ").trim();
}
