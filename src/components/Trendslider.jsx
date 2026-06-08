import { useEffect, useState } from "react";

export default function TrendingSlider() {
  const images = [
    {
      img: "https://redtape.com/cdn/shop/files/RSO3424B_5.jpg?v=1766753059",
      title: "Nike Air Max",
    },
    {
      img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
      title: "Adidas Ultraboost",
    },
    {
      img: "https://redtape.com/cdn/shop/files/RSO4293A_6_ddc52bb4-c316-4c16-a064-c1b48477659e.jpg?v=1766753029",
      title: "Puma RS-X",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 px-6">
      <h2 className="text-3xl font-bold mb-6">
        Trending Sneakers
      </h2>

      


      <div className="relative w-full h-[700px] overflow-hidden rounded-xl shadow-lg">

        {images.map((item, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out`}
            style={{
              transform: `translateX(${(index - current) * 100}%)`,
            }}
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover"
            />

            
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <h3 className="text-white text-3xl font-bold p-6">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
