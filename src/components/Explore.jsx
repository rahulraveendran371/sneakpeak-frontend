import { Link, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import api from "../services/api";

export default function ExploreProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);


 useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await api.get(
        "/products?limit=3&isActive=true"
      );

      const data = res.data;

      if (
        data.products &&
        Array.isArray(data.products)
      ) {
        setProducts(data.products);
      } else if (
        Array.isArray(data)
      ) {
        setProducts(
          data.slice(0, 3)
        );
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error(
        "Error fetching products:",
        error
      );
    }
  };

  fetchProducts();
}, []);


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');
        .exp-title { font-family: 'Bebas Neue', cursive; letter-spacing: 0.02em; }
        .exp-body { font-family: 'Outfit', sans-serif; }
        .exp-tag { font-family: 'Outfit', sans-serif; font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700; }
        .prod-card { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }
        .prod-card:hover { transform: translateY(-8px); }
        .prod-img-wrap { overflow: hidden; }
        .prod-img { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); filter: drop-shadow(0 18px 22px rgba(0,0,0,0.55)); }
        .prod-card:hover .prod-img { transform: scale(1.08) rotate(-1deg); }
        .prod-glow { background: radial-gradient(circle at 50% 45%, rgba(255,255,255,0.07), transparent 65%); }
      `}</style>

      <section className="bg-neutral-950 py-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-rose-600 rounded-full" />
              <h2 className="exp-title text-white text-4xl md:text-5xl">EXPLORE PICKS</h2>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="exp-body text-xs font-semibold text-gray-500 hover:text-white transition-colors tracking-widest uppercase border-b border-gray-700 hover:border-white pb-0.5"
            >
              View All →
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => {
              const discount = Math.round((1 - product.price / product.originalPrice) * 100);
              const hasDiscount = discount > 0;

              return (
                <div
                  key={product._id}
                  className="prod-card group bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] transition-all duration-300"
                >
                  {/* Image */}
                  <Link to={`/product/${product._id}`}>
                    <div className="prod-img-wrap prod-glow relative bg-gradient-to-b from-neutral-800 to-neutral-900 h-72 flex items-center justify-center p-8">
                      {/* Category tag */}
                      <span className="exp-tag absolute top-4 left-4 text-gray-300 bg-black/60 backdrop-blur border border-white/10 px-2.5 py-1 rounded-full z-10">
                        {product.category}
                      </span>

                      {/* Discount badge */}
                      {hasDiscount && (
                        <span className="exp-tag absolute top-4 right-4 text-rose-400 bg-rose-950/60 backdrop-blur border border-rose-600/30 px-2.5 py-1 rounded-full z-10">
                          {discount}% OFF
                        </span>
                      )}

                      <img
                        src={product.image}
                        alt={product.name}
                        className="prod-img relative h-full max-h-52 w-auto object-contain"
                      />

                      {/* Ground shadow under shoe */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/40 blur-xl rounded-full" />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="exp-body font-semibold text-white text-base mb-1 line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-3 mt-1 mb-5">
                      <span className="exp-title text-white text-2xl">₹{product.price.toLocaleString()}</span>
                      {hasDiscount && (
                        <>
                          <span className="exp-body text-gray-600 text-sm line-through">₹{product.originalPrice.toLocaleString()}</span>
                          <span className="exp-tag text-green-500 text-xs">
                            {discount}% off
                          </span>
                        </>
                      )}
                    </div>

                    <Link
                      to={`/product/${product._id}`}
                      className="exp-body inline-flex items-center gap-2 text-xs font-semibold text-white bg-white/10 hover:bg-white hover:text-black px-4 py-2.5 rounded-full transition-all duration-200 tracking-widest uppercase"
                    >
                      View Product
                      <span className="text-rose-500 group-hover:text-black">→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-12 relative rounded-2xl overflow-hidden bg-linear-to-r from-rose-950 to-black border border-rose-900/30 p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="exp-title text-white text-3xl md:text-4xl mb-2">EXCLUSIVE DROPS EVERY WEEK</h3>
              <p className="exp-body text-gray-400 text-sm">New arrivals, limited editions, and rare finds — all in one place.</p>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="exp-body font-semibold text-sm bg-white text-black px-8 py-3.5 rounded-full hover:bg-gray-100 transition-all shrink-0 tracking-widest uppercase"
            >
              Shop All
            </button>
          </div>

        </div>
      </section>
    </>
  );
}