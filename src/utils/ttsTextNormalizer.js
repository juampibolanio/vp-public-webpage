/**
 * Normalizes text for Text-to-Speech (Spanish – Argentina).
 * Transforms dates, numbers, and symbols into speech-friendly text.
 * Visual content is not affected.
 */
export function normalizeTextForTTS(rawText) {
  if (!rawText) return "";

  let text = rawText;

  // Numeric dates: 14/01/2026 or 14-01-2026 → 14 de enero de 2026
  text = text.replace(
    /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/g,
    (_, d, m, y) => {
      const date = new Date(`${y}-${m}-${d}`);
      return date.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  );

  // textual dates normalization (case consistency)
  text = text.replace(
    /\b(\d{1,2}) de ([a-záéíóúñ]+) de (\d{4})\b/gi,
    (_, d, m, y) => `${d} de ${m.toLowerCase()} de ${y}`
  );

  // thousands separator: 15.000 → 15000
  text = text.replace(/\b\d{1,3}(\.\d{3})+\b/g, (match) =>
    match.replace(/\./g, "")
  );

  // decimal numbers (Spanish format): 3,5 → 3 coma 5
  text = text.replace(
    /\b(\d+),(\d+)\b/g,
    (_, int, dec) => `${int} coma ${dec}`
  );

  // percentages: 25% -> 25 por ciento
  text = text.replace(/\b(\d+)\s?%\b/g, (_, n) => `${n} por ciento`);

  // currency: $15.000 -> 15000 pesos
  text = text.replace(
    /\$\s?(\d+(\.\d{3})*)/g,
    (_, n) => `${n.replace(/\./g, "")} pesos`
  );

  // cegrees: 30° -> 30 grados
  text = text.replace(/\b(\d+)\s?°\b/g, (_, n) => `${n} grados`);

  // normalize whitespace
  return text.replace(/\s+/g, " ").trim();
}
