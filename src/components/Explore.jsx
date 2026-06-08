import { Link, useNavigate } from "react-router-dom";

export default function ExploreProducts() {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "all-pro nitro sneakers",
      price: 5999,
      image:
        "https://www.superkicks.in/cdn/shop/files/1-2025-11-25T114717.373.png?v=1768547785&width=1946",
    },
    {
      id: 2,
      name: "PLATINUM VIOLET/SAIL-GUM DARK BROWN",
      price: 4999,
      image:
        "https://www.superkicks.in/cdn/shop/files/4_93_579162fa-2779-494f-a475-4a5602bf1b14.jpg?v=1753185906&width=1946",
    },
    {
      id: 3,
      name: "trendy&stylish Converse sneakers for men",
      price: 899,
      image:
        "https://www.superkicks.in/cdn/shop/files/1_374d80fe-d6c7-4182-9b5c-de499c5a5ae4.png?v=1764759666&width=1946",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        
        
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">
            Explore Products
          </h2>

          <button
            onClick={() => navigate("/products")}
            className="text-sm font-semibold underline hover:text-gray-600"
          >
            View All →
          </button>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden group"
            >
              
              <Link to={`/product/${product.id}`}>
                <div className="bg-gray-100 p-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-48 mx-auto object-contain group-hover:scale-110 transition duration-500"
                  />
                </div>
              </Link>

              
              <div className="p-5">
                <h3 className="font-semibold text-lg">
                  {product.name}
                </h3>

                <p className="text-gray-600 mt-1">
                  ₹{product.price}
                </p>

                <Link
                  to={`/product/${product.id}`}
                  className="inline-block mt-4 text-sm font-semibold text-black hover:underline"
                >
                  View Product →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
