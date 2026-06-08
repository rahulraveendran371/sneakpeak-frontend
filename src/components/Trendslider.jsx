import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TrendingSlider() {
  const slides = [
    {
      img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1400",
      title: "Nike Air Max",
      subtitle: "Iconic comfort, reimagined",
      tag: "Best Seller",
    },
    {
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400",
      title: "Adidas Ultraboost",
      subtitle: "Energy return with every stride",
      tag: "New Arrival",
    },
    {
      img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1400",
      title: "Puma RS-X",
      subtitle: "Street culture meets performance",
      tag: "Trending",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = (index) => {
    if (transitioning || index === current) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');
        .slide-title { font-family: 'Bebas Neue', cursive; letter-spacing: 0.02em; }
        .slide-sub { font-family: 'Outfit', sans-serif; }
        .slide-tag { font-family: 'Outfit', sans-serif; font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
      `}</style>

      <section className="bg-neutral-950 py-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-rose-600 rounded-full" />
              <h2 className="slide-title text-white text-4xl md:text-5xl">TRENDING NOW</h2>
            </div>
            <Link
              to="/products"
              className="slide-sub text-xs font-medium text-gray-500 hover:text-white transition-colors tracking-widest uppercase border-b border-gray-700 hover:border-white pb-0.5"
            >
              View All
            </Link>
          </div>

          {/* Slider */}
          <div className="relative w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden">

            {/* Slides */}
            {slides.map((slide, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: index === current ? 1 : 0, pointerEvents: index === current ? "auto" : "none" }}
              >
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-8 md:p-12">
                  <span
                    className="slide-tag inline-block text-rose-500 border border-rose-600/50 px-3 py-1 rounded-full mb-4"
                    style={{ opacity: index === current && !transitioning ? 1 : 0, transition: "opacity 0.5s ease 0.2s" }}
                  >
                    {slide.tag}
                  </span>
                  <h3
                    className="slide-title text-white text-5xl md:text-7xl mb-2"
                    style={{ opacity: index === current && !transitioning ? 1 : 0, transform: index === current && !transitioning ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s ease 0.3s" }}
                  >
                    {slide.title}
                  </h3>
                  <p
                    className="slide-sub text-gray-400 text-sm md:text-base"
                    style={{ opacity: index === current && !transitioning ? 1 : 0, transition: "opacity 0.5s ease 0.4s" }}
                  >
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            ))}

            {/* Dots */}
            <div className="absolute bottom-8 right-8 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: index === current ? "24px" : "6px",
                    height: "6px",
                    background: index === current ? "#e11d48" : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
              <div
                key={current}
                className="h-full bg-rose-600"
                style={{ animation: "progress 4s linear forwards" }}
              />
            </div>
          </div>

          <style>{`
            @keyframes progress {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>

        </div>
      </section>
    </>
  );
}
