import { useEffect, useRef, useState } from "react";
import { normalizeTextForTTS } from "../../utils/ttsTextNormalizer";
import './TextToSpeech.css';

export default function TextToSpeech({ title, excerpt, contentHtml, contentBlocks }) {
  const utteranceRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (typeof window === "undefined") return null;

  useEffect(() => {
    const killSpeech = () => {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    };

    window.addEventListener("beforeunload", killSpeech);

    document.addEventListener("astro:before-preparation", killSpeech);
    document.addEventListener("astro:before-swap", killSpeech);

    return () => {
      killSpeech();
      window.removeEventListener("beforeunload", killSpeech);
      document.removeEventListener("astro:before-preparation", killSpeech);
      document.removeEventListener("astro:before-swap", killSpeech);
    };
  }, []);

  // Jodit 
  const parseHtmlContent = (htmlString) => {
    if (!htmlString) return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    let result = "";

    const walkDOM = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        result += node.textContent + " ";
      } else if (node.nodeName === 'IMG') {
        const altText = node.getAttribute('alt');
        const description = altText ? altText : "imagen sin descripción";
        result += `. Imagen: ${description}. `;
      } else if (node.nodeName === 'VIDEO' || node.nodeName === 'IFRAME') {
        result += `. Contenido multimedia incrustado. `;
      } else {
        node.childNodes.forEach(walkDOM);
      }
    };

    walkDOM(doc.body);
    return result;
  };

  // Strapi Blocks
  const parseBlocksContent = (blocks) => {
    if (!Array.isArray(blocks)) return "";
    let result = "";

    blocks.forEach((block) => {
      if (block.type === 'image') {
        const alt = block.image?.alternativeText || "imagen sin descripción";
        result += `. Imagen: ${alt}. `;
      } else if (block.children) {
        result += block.children.map(child => child.text).join(" ") + ". ";
      }
    });

    return result;
  };

  const speak = () => {
    speechSynthesis.cancel();

    let bodyContent = "";
    if (contentHtml) {
      bodyContent = parseHtmlContent(contentHtml);
    } else if (contentBlocks) {
      bodyContent = parseBlocksContent(contentBlocks);
    }

    const fullScript = `${title || ""}. ${excerpt || ""}. ${bodyContent}`;

    if (!fullScript.trim()) return;

    const normalizedText = normalizeTextForTTS(fullScript);
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
      aria-label={isSpeaking ? "Detener lectura de la noticia" : "Escuchar noticia"}
      onClick={isSpeaking ? stop : speak}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.84-5 6.7v2.07c4-.91 7-4.49 7-8.77s-3-7.86-7-8.77M16.5 12c0-1.77-1-3.29-2.5-4.03V16c1.5-.71 2.5-2.24 2.5-4M3 9v6h4l5 5V4L7 9z" /></svg>
      {isSpeaking ? "Detener lectura" : "Escuchar noticia"}
    </button>
  );
}