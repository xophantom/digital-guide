"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/src/components/atoms/Icon";
import type { PropertyImage } from "@/src/domain/property";

// Uma foto → hero simples. Duas ou mais → carrossel: cada foto em largura cheia
// (scroll-snap, swipe no mobile) + dots de posição. As setas (desktop) são uma
// dica transitória: aparecem no render e a cada troca de foto, e somem sozinhas;
// o hover as mantém visíveis para dar tempo de clicar.
export function PhotoGallery({ images }: { images: PropertyImage[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [active, setActive] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);

  const isCarousel = images.length > 1;

  function flashArrows() {
    setHintVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setHintVisible(false), 1400);
  }

  useEffect(() => {
    if (!isCarousel) return;
    // hintVisible já começa true: o efeito só arma o fade inicial. O setState fica
    // no callback do timer (deferido), não no corpo do efeito.
    hideTimer.current = setTimeout(() => setHintVisible(false), 1400);
    return () => clearTimeout(hideTimer.current);
  }, [isCarousel]);

  if (images.length === 0) return null;

  if (!isCarousel) {
    const only = images[0];
    return (
      <div className="relative h-56 w-full overflow-hidden rounded-2xl sm:h-72">
        <Image
          src={only.url}
          alt={only.alt}
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover"
          preload
        />
      </div>
    );
  }

  function goTo(index: number) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const clamped = Math.max(0, Math.min(index, images.length - 1));
    scroller.scrollTo({ left: clamped * scroller.clientWidth, behavior: "smooth" });
    setActive(clamped);
  }

  function onScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setActive(Math.round(scroller.scrollLeft / scroller.clientWidth));
    flashArrows();
  }

  const arrowState = hintVisible
    ? "opacity-100"
    : "opacity-0 pointer-events-none";

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        clearTimeout(hideTimer.current);
        setHintVisible(true);
      }}
      onMouseLeave={flashArrows}
    >
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex h-56 snap-x snap-mandatory overflow-x-auto rounded-2xl sm:h-72 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img, i) => (
          <div key={img.position} className="relative h-full w-full shrink-0 snap-center">
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
              preload={i === 0}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Foto anterior"
        onClick={() => goTo(active - 1)}
        disabled={active === 0}
        className={`absolute top-1/2 left-2 flex -translate-y-1/2 items-center justify-center rounded-full bg-black/25 p-2 text-white backdrop-blur-sm transition-opacity duration-300 hover:bg-black/45 disabled:opacity-0 ${arrowState}`}
      >
        <Icon name="chevron-left" size={18} />
      </button>
      <button
        type="button"
        aria-label="Próxima foto"
        onClick={() => goTo(active + 1)}
        disabled={active === images.length - 1}
        className={`absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-center rounded-full bg-black/25 p-2 text-white backdrop-blur-sm transition-opacity duration-300 hover:bg-black/45 disabled:opacity-0 ${arrowState}`}
      >
        <Icon name="chevron-right" size={18} />
      </button>
    </div>
  );
}
