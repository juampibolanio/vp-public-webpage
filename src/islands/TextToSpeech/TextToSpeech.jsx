/**
 * TextToSpeech
 * ------------
 * React component that provides a "text-to-speech" (TTS) button for reading text aloud.
 *
 * Responsibilities:
 * - Accept a string `text` prop and read it aloud using the browser's SpeechSynthesis API.
 * - Normalize text before reading (via `normalizeTextForTTS`) to improve pronunciation and clarity.
 * - Manage the TTS state (speaking / idle) and update the UI accordingly.
 * - Provide a single button to toggle between starting and stopping speech.
 *
 * Props:
 * - text: string
 *   The content to be read aloud. If empty or null, the button does nothing.
 *
 * Behavior:
 * - Clicking the button starts speech if not already speaking.
 * - Clicking the button while speaking stops speech immediately.
 * - Handles speech events (start, end, error) to maintain `isSpeaking` state.
 * - Cancels any ongoing speech when the component is unmounted.
 *
 * Accessibility:
 * - Uses `aria-label="Escuchar noticia"` to indicate the button's purpose to screen readers.
 *
 * Notes:
 * - Designed for Spanish (Argentina) locale (`es-AR`).
 * - Rate and pitch are configured for natural-sounding speech.
 */
import { useEffect, useRef, useState } from "react";
import { normalizeTextForTTS } from "../../utils/ttsTextNormalizer";
import './TextToSpeech.css';

export default function TextToSpeech({ text }) {
  const utteranceRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const speak = () => {
    if (!text) return;

    speechSynthesis.cancel();

    const normalizedText = normalizeTextForTTS(text);

    const utterance = new SpeechSynthesisUtterance(normalizedText);
    utterance.lang = "es-AR";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <button
      className="meta-button"
      aria-label="Escuchar contenido"
      onClick={isSpeaking ? stop : speak}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.84-5 6.7v2.07c4-.91 7-4.49 7-8.77s-3-7.86-7-8.77M16.5 12c0-1.77-1-3.29-2.5-4.03V16c1.5-.71 2.5-2.24 2.5-4M3 9v6h4l5 5V4L7 9z"/></svg>
      {isSpeaking ? "Detener lectura" : "Escuchar noticia"}
    </button>
  );
}