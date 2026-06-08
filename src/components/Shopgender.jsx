import { useNavigate } from "react-router-dom";

export default function ShopByGender() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Shop by Gender
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        


        <div
          onClick={() => navigate("/men")}
          className="relative h-80 rounded-xl overflow-hidden cursor-pointer group"
        >
          <img
            src="https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/316de1b6-f526-4f5c-8683-af5420a20680/AIR+JORDAN+4+RETRO.png"
            alt="Men Sneakers"
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h3 className="text-white text-4xl font-extrabold tracking-wide">
              Men
            </h3>
          </div>
        </div>

        


        
        <div
          onClick={() => navigate("/women")}
          className="relative h-80 rounded-xl overflow-hidden cursor-pointer group"
        >
          <img
            src="https://redtape.com/cdn/shop/files/RLL0308A_1_14cd7d6d-cb2b-44cd-8fa7-7e5645e52645.jpg?v=1767350707"
            alt="Women Sneakers"
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h3 className="text-white text-4xl font-extrabold tracking-wide">
              Women
            </h3>
          </div>
        </div>
         

         <div
          onClick={() => navigate("/products")}
          className="relative h-80 rounded-xl overflow-hidden cursor-pointer group"
        >
          <img
            src="https://redtape.com/cdn/shop/files/RSL1282_1.jpg?v=1768196017"
            alt="unisex Sneakers"
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h3 className="text-white text-4xl font-extrabold tracking-wide">
              Unisex
            </h3>
          </div>
        </div>
  

      </div>
    </section>
  );
}
