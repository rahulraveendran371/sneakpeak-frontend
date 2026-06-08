import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section
      className="h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1542291026-7eec264c27ff)",
      }}
    >
      <div className="bg-black/60 p-10 rounded text-center">
        <h1 className="text-white text-5xl font-extrabold mb-4">
          Step Into Style
        </h1>

        <p className="text-gray-200 mb-6">
          Premium Sneakers for Every Move
        </p>

        
        <Link to="/products">
          <button className="bg-white text-black px-6 py-3 font-semibold rounded hover:bg-gray-200 transition">
            Shop Now
          </button>
        </Link>
      </div>
    </section>
  );
}
