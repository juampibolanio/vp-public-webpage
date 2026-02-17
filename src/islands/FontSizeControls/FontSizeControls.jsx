/**
 * FontSizeControls
 *
 * Accessibility component that allows users to adjust the global
 * font size of the site using a scale factor.
 *
 * - Applies the scale via a CSS custom property (`--reader-font-scale`)
 *   on the root HTML element.
 * - Persists the user preference in `localStorage` to keep it across sessions.
 * - Enforces minimum and maximum limits to prevent layout or readability issues.
 * - Provides accessible controls with proper `aria-labels` and disabled states
 *   based on the current scale value.
 *
 * Designed to improve readability, especially for older users,
 * without altering the core layout structure.
 */
import { useEffect, useState } from "react";
import './FontSizeControls.css';

const DEFAULT = 1.2;
const MIN = 0.85;
const MAX = 1.6;
const STEP = 0.1;

export default function FontSizeControls() {
    const [scale, setScale] = useState(DEFAULT);

    useEffect(() => {
        const stored = localStorage.getItem("reader-font-scale");
        const value = stored ? Number(stored) : DEFAULT;

        setScale(value);
        document.documentElement.style.setProperty(
            "--reader-font-scale",
            value
        );
    }, []);

    const applyScale = (value) => {
        const clamped = Math.min(MAX, Math.max(MIN, value));

        setScale(clamped);
        document.documentElement.style.setProperty(
            "--reader-font-scale",
            clamped
        );
        localStorage.setItem("reader-font-scale", clamped);
    };

    const increase = () => applyScale(scale + STEP);
    const decrease = () => applyScale(scale - STEP);
    const reset = () => applyScale(DEFAULT);

    return (
        <div className="font-size-controls" aria-label="Controles de tamaño de texto">
            <button
                type="button"
                className="font-size-controls__button"
                onClick={increase}
                disabled={scale >= MAX}
                aria-label="Aumentar tamaño de letra"
            >
                A+
            </button>

            <button
                type="button"
                className="font-size-controls__button"
                onClick={decrease}
                disabled={scale <= MIN}
                aria-label="Disminuir tamaño de letra"
            >
                A-
            </button>

            <button
                type="button"
                className="font-size-controls__button"
                onClick={reset}
                disabled={scale === DEFAULT}
                aria-label="Restablecer tamaño de letra"
            >
                A
            </button>
        </div>
    );
}
