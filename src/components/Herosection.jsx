import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

        .hero-title {
          font-family: 'Bebas Neue', cursive;
          line-height: 0.9;
          letter-spacing: 0.02em;
        }
        .hero-sub {
          font-family: 'Outfit', sans-serif;
        }
        .hero-btn {
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.75rem;
        }
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.25s; }
        .delay-3 { transition-delay: 0.4s; }
        .delay-4 { transition-delay: 0.55s; }
        .hero-tag {
          font-family: 'Outfit', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .grain-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
        }
      `}</style>

      <section className="relative h-screen min-h-[600px] overflow-hidden bg-black">

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[10s] ease-out"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600)",
            transform: loaded ? "scale(1)" : "scale(1.05)",
          }}
        />

        {/* Dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Grain texture */}
        <div className="grain-overlay absolute inset-0 pointer-events-none" />

        {/* Red accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-600" />

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-8 flex flex-col justify-center">
          <div className="max-w-2xl">

            {/* Tag */}
            <div className={`fade-up delay-1 ${loaded ? "visible" : ""} flex items-center gap-3 mb-6`}>
              <div className="w-6 h-px bg-rose-600" />
              <span className="hero-tag text-rose-500">New Season Collection</span>
            </div>

            {/* Title */}
            <h1 className={`fade-up delay-2 ${loaded ? "visible" : ""} hero-title text-white`}>
              <span className="block text-[clamp(4rem,12vw,8rem)]">STEP</span>
              <span className="block text-[clamp(4rem,12vw,8rem)] text-rose-600" style={{ WebkitTextStroke: "2px #e11d48", color: "transparent" }}>
                INTO
              </span>
              <span className="block text-[clamp(4rem,12vw,8rem)]">STYLE</span>
            </h1>

            {/* Subtitle */}
            <p className={`fade-up delay-3 ${loaded ? "visible" : ""} hero-sub text-gray-400 text-base md:text-lg mt-4 mb-10 max-w-md`}>
              Premium sneakers crafted for those who move with purpose.
              Exclusive drops. Iconic silhouettes.
            </p>

            {/* CTA Buttons */}
            <div className={`fade-up delay-4 ${loaded ? "visible" : ""} flex flex-wrap gap-4`}>
              <Link to="/products">
                <button className="hero-btn bg-white text-black px-8 py-3.5 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95">
                  Shop Now
                </button>
              </Link>
              <Link to="/men">
                <button className="hero-btn border border-white/30 text-white px-8 py-3.5 rounded-full hover:bg-white/10 transition-all duration-200">
                  Men's Edit
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className={`fade-up delay-4 ${loaded ? "visible" : ""} flex gap-8 mt-14 border-t border-white/10 pt-8`}>
              {[
                { value: "200+", label: "Products" },
                { value: "5K+", label: "Happy Customers" },
                { value: "Free", label: "Returns" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="hero-title text-white text-2xl md:text-3xl">{value}</div>
                  <div className="hero-tag text-gray-500 mt-1">{label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-white animate-pulse" />
          <span className="hero-tag text-white">Scroll</span>
        </div>

      </section>
    </>
  );
}
