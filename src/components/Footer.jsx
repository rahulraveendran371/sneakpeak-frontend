import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');
        .ft-logo { font-family: 'Bebas Neue', cursive; letter-spacing: 0.05em; }
        .ft-body { font-family: 'Outfit', sans-serif; }
        .ft-heading { font-family: 'Outfit', sans-serif; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600; }
        .ft-link { font-family: 'Outfit', sans-serif; font-size: 0.85rem; transition: color 0.2s, padding-left 0.2s; }
        .ft-link:hover { color: white; padding-left: 4px; }
      `}</style>

      <footer className="bg-black border-t border-white/5">

        {/* Main footer */}
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand — takes 2 cols */}
          <div className="lg:col-span-2">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="ft-logo text-white text-4xl">SNEAK</span>
              <span className="ft-logo text-4xl" style={{ color: "#e11d48" }}>PEAK</span>
            </div>
            <p className="ft-body text-gray-500 text-sm leading-relaxed max-w-xs">
              Premium sneakers for those who move with style. Exclusive drops, iconic silhouettes, unmatched comfort.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              {["IG", "TW", "FB", "YT"].map((s) => (
                <button
                  key={s}
                  className="ft-body w-9 h-9 rounded-full border border-white/10 text-gray-500 hover:border-white/40 hover:text-white text-xs font-semibold transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="ft-heading text-gray-600 mb-5">Shop</h3>
            <ul className="space-y-3">
              {[
                { label: "All Products", path: "/products" },
                { label: "Men", path: "/men" },
                { label: "Women", path: "/women" },
                { label: "New Arrivals", path: "/products" },
              ].map(({ label, path }) => (
                <li key={label}>
                  <Link to={path} className="ft-link text-gray-500">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="ft-heading text-gray-600 mb-5">Support</h3>
            <ul className="space-y-3">
              {["Contact Us", "FAQs", "Shipping Info", "Returns", "Size Guide"].map((item) => (
                <li key={item}>
                  <span className="ft-link text-gray-500 cursor-pointer">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="ft-heading text-gray-600 mb-5">Legal</h3>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms & Conditions", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <span className="ft-link text-gray-500 cursor-pointer">{item}</span>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <h3 className="ft-heading text-gray-600 mb-3">Newsletter</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="ft-body flex-1 bg-white/5 border border-white/10 text-white text-xs px-3 py-2 rounded-full placeholder-gray-600 focus:outline-none focus:border-white/30"
                />
                <button className="ft-body bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors shrink-0">
                  Join
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 px-6 py-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="ft-body text-gray-600 text-xs">
              © 2026 SneakPeak. All rights reserved.
            </p>
            <p className="ft-body text-gray-700 text-xs">
              Built with React & Node.js
            </p>
          </div>
        </div>

      </footer>
    </>
  );
}
