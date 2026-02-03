/**
 * SponsorsCarousel
 * ----------------
 * Auto-playing sponsors carousel built with Embla.
 *
 * - Infinite loop
 * - Centered slides
 * - Stops autoplay on user interaction
 *
 * Props:
 * - sponsors: Array of sponsor objects:
 *   {
 *     name: string,
 *     logo: string,
 *     url: string
 *   }
 */

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import "./SponsorsCarousel.css";

export default function SponsorsCarousel({ sponsors }) {
  // initializes Embla with automatic autoplay
  const [emblaRef] = useEmblaCarousel(
    { loop: true,
      align: "center",
      containScroll: "trimSnaps",
     },
    [
      Autoplay({
        delay: 3000,             
        stopOnInteraction: true,
      }),
    ]
  );

  return (
    <div className="sponsors">
      <div className="sponsors__viewport" ref={emblaRef}>
        <div className="sponsors__container">
          {sponsors.map((item, index) => (
            <div className="sponsors__slide" key={index}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sponsors__link"
              >
                <img src={item.logo} alt={item.name} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
