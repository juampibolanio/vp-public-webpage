import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import "./MediaSlider.css";

export default function MediaSlider({ items = [] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "start",
    });

    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const updateControls = useCallback(() => {
        if (!emblaApi) return;
        setCanPrev(emblaApi.canScrollPrev());
        setCanNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        updateControls();
        emblaApi.on("select", updateControls);
        emblaApi.on("reInit", updateControls);

        return () => {
            emblaApi.off("select", updateControls);
            emblaApi.off("reInit", updateControls);
        };
    }, [emblaApi, updateControls]);

    if (!items.length) return null;

    return (
        <section
            className="media-slider"
            role="region"
            aria-roledescription="carousel"
            aria-label="Galería multimedia"
        >
            <div className="media-slider__viewport" ref={emblaRef}>
                <div className="media-slider__container">
                    {items.map((item, index) => (
                        <figure className="media-slider__slide" key={item.src}>
                            {item.type === "image" && (
                                <img
                                    src={item.src}
                                    alt={item.alt || ""}
                                    loading={index === 0 ? "eager" : "lazy"}
                                    decoding="async"
                                    width={item.width}
                                    height={item.height}
                                />
                            )}

                            {item.type === "video" && item.provider === "file" && (
                                <video controls preload="metadata">
                                    <source src={item.src} type="video/mp4" />
                                </video>
                            )}

                            {item.type === "video" && item.provider === "youtube" && (
                                <iframe
                                    src={item.src}
                                    title={item.title || "Video"}
                                    loading="lazy"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            )}

                            {item.alt && item.type === "image" && (
                                <figcaption className="media-slider__caption">
                                    {item.alt}
                                </figcaption>
                            )}
                        </figure>
                    ))}
                </div>
            </div>

            <button
                type="button"
                className="media-slider__arrow media-slider__arrow--prev"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canPrev}
                aria-label="Anterior"
            >
                ‹
            </button>

            <button
                type="button"
                className="media-slider__arrow media-slider__arrow--next"
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canNext}
                aria-label="Siguiente"
            >
                ›
            </button>
        </section>
    );
}
