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
        <div className="font-size-controls">
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
