import { useNavigate } from "react-router-dom";

export default function ShopByGender() {
  const navigate = useNavigate();

  const categories = [
    {
      label: "Men",
      path: "/men",
      image: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/316de1b6-f526-4f5c-8683-af5420a20680/AIR+JORDAN+4+RETRO.png",
      tag: "Performance & Style",
      accent: "from-blue-900/40",
    },
    {
      label: "Women",
      path: "/women",
      image: "https://redtape.com/cdn/shop/files/RLL0308A_1_14cd7d6d-cb2b-44cd-8fa7-7e5645e52645.jpg?v=1767350707",
      tag: "Elegance Meets Edge",
      accent: "from-rose-900/40",
    },
    {
      label: "Unisex",
      path: "/products",
      image: "https://redtape.com/cdn/shop/files/RSL1282_1.jpg?v=1768196017",
      tag: "For Everyone",
      accent: "from-purple-900/40",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');
        .cat-title { font-family: 'Bebas Neue', cursive; letter-spacing: 0.04em; }
        .cat-sub { font-family: 'Outfit', sans-serif; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500; }
        .cat-cta { font-family: 'Outfit', sans-serif; font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; }
        .cat-card { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }
        .cat-card:hover { transform: translateY(-6px); }
        .cat-card:hover .cat-img { transform: scale(1.08); }
        .cat-img { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
      `}</style>

      <section className="bg-black py-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-1 h-8 bg-rose-600 rounded-full" />
            <h2 className="cat-title text-white text-4xl md:text-5xl">SHOP BY CATEGORY</h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {categories.map(({ label, path, image, tag, accent }) => (
              <div
                key={label}
                onClick={() => navigate(path)}
                className="cat-card relative h-[420px] rounded-xl overflow-hidden cursor-pointer group"
              >
                {/* Image */}
                <img
                  src={image}
                  alt={label}
                  className="cat-img w-full h-full object-cover"
                />

                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${accent} via-black/20 to-transparent`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Border glow on hover */}
                <div className="absolute inset-0 rounded-xl border border-white/0 group-hover:border-white/20 transition-all duration-300" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <span className="cat-sub text-gray-400 block mb-2">{tag}</span>
                  <h3 className="cat-title text-white text-5xl mb-4">{label}</h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="cat-cta text-white">Shop {label}</span>
                    <span className="text-rose-500">→</span>
                  </div>
                </div>

                {/* Top tag */}
                <div className="absolute top-5 left-5">
                  <span className="cat-cta text-xs text-white bg-black/50 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
