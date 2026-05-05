import { useState, useEffect, useCallback } from 'react';

interface Slide {
  src: string;
  alt: string;
}

interface Props {
  slides: Slide[];
  whatsappUrl: string;
  interval?: number;
}

export default function HeroSlider({ slides, whatsappUrl, interval = 8500 }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);
  const goTo = (i: number) => setCurrent(i);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [paused, next, interval]);

  return (
    <section
      className="relative h-[92vh] min-h-[560px] max-h-[900px] overflow-hidden bg-rexeco-dark"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Imágenes */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== current}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="w-full h-full object-cover object-center"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-rexeco-dark/60" />

      {/* Contenido hero */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <p className="text-rexeco-red font-heading font-semibold text-sm sm:text-base uppercase tracking-[0.2em] mb-4">
              RECICLAJE INTELIGENTE, CIUDAD MÁS LIMPIA
            </p>
            <h1 className="font-heading font-bold text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6">
              Transformando residuos en oportunidades
            </h1>
            <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
              En Grupo Rexeco creemos en el poder del reciclaje para construir un futuro más verde y sostenible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-rexeco-red hover:bg-red-700 text-white font-heading font-bold uppercase tracking-wide px-8 py-4 text-base transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contáctanos
              </a>
              <a
                href="/#nosotros"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white hover:text-rexeco-dark font-heading font-bold uppercase tracking-wide px-8 py-4 text-base transition-colors"
              >
                Sobre nosotros
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Flecha anterior */}
      <button
        onClick={prev}
        aria-label="Imagen anterior"
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-white/15 hover:bg-white/30 text-white backdrop-blur-sm transition-colors rounded-full"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Flecha siguiente */}
      <button
        onClick={next}
        aria-label="Imagen siguiente"
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-white/15 hover:bg-white/30 text-white backdrop-blur-sm transition-colors rounded-full"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir a imagen ${i + 1}`}
            className={`h-1 transition-all duration-300 ${i === current ? 'w-8 bg-rexeco-red' : 'w-8 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </section>
  );
}
