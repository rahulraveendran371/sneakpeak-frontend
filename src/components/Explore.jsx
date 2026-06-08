import { Link, useNavigate } from "react-router-dom";

export default function ExploreProducts() {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "All-Pro Nitro Sneakers",
      price: 5999,
      originalPrice: 7999,
      tag: "New Drop",
      image: "https://www.superkicks.in/cdn/shop/files/1-2025-11-25T114717.373.png?v=1768547785&width=1946",
    },
    {
      id: 2,
      name: "Platinum Violet Sail",
      price: 4999,
      originalPrice: 6499,
      tag: "Limited",
      image: "https://www.superkicks.in/cdn/shop/files/4_93_579162fa-2779-494f-a475-4a5602bf1b14.jpg?v=1753185906&width=1946",
    },
    {
      id: 3,
      name: "Converse Classic Hi",
      price: 899,
      originalPrice: 1299,
      tag: "Best Value",
      image: "https://www.superkicks.in/cdn/shop/files/1_374d80fe-d6c7-4182-9b5c-de499c5a5ae4.png?v=1764759666&width=1946",
    },
  ];

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
        .prod-img { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .prod-card:hover .prod-img { transform: scale(1.06); }
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
            {products.map((product) => (
              <div
                key={product.id}
                className="prod-card group bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-colors duration-300"
              >
                {/* Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="prod-img-wrap relative bg-neutral-800 h-64 flex items-center justify-center p-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="prod-img h-full max-h-48 w-auto object-contain"
                    />
                    {/* Tag */}
                    <span className="exp-tag absolute top-4 left-4 text-rose-500 bg-black/70 border border-rose-600/40 px-2.5 py-1 rounded-full">
                      {product.tag}
                    </span>
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
                    <span className="exp-body text-gray-600 text-sm line-through">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="exp-tag text-green-500 text-xs">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                    </span>
                  </div>

                  <Link
                    to={`/product/${product.id}`}
                    className="exp-body inline-flex items-center gap-2 text-xs font-semibold text-white bg-white/10 hover:bg-white hover:text-black px-4 py-2.5 rounded-full transition-all duration-200 tracking-widest uppercase"
                  >
                    View Product
                    <span className="text-rose-500 group-hover:text-black">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-12 relative rounded-2xl overflow-hidden bg-gradient-to-r from-rose-950 to-black border border-rose-900/30 p-10 flex flex-col md:flex-row items-center justify-between gap-6">
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
