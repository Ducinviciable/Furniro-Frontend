import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import Carousel from "./components/carousel";
import { useState } from "react";
import { rooms } from "@/utils/constant";
import { useRouter } from "next/router";
import { useGetProductsQuery } from "@/redux/api/productApi";
import Loading from "@/components/Loading";
import { IProductInShop } from "@/utils/types";
const HomePage = () => {
  const { data: productResponse, isLoading } = useGetProductsQuery();
  const products: IProductInShop[] =
    Array.isArray(productResponse?.data) && productResponse?.data.length > 0
      ? [...productResponse.data].sort(() => Math.random() - 0.5).slice(0, 8)
      : Array.from({ length: 8 }, (_, i) => ({
          id: i,
          name: `Product ${i + 1}`,
          type: "Sample Type",
          image: `/assets/images/products.png`,
          price: 100 + i * 10,
          sale_percent: 10 + i,
          created_at: "",
        }));

  const [roomSelected, setRoomSelected] = useState(0);
  const route = useRouter();

  if (isLoading) return <Loading />;
  return (
    <>
      {/* slideshow */}
      <section>
        <div className="relative">
          <Image
            src={"/assets/images/MaskGroup.png"}
            alt="Slideshow"
            height={716}
            width={1440}
            className="w-full"
          />
          <div className="absolute bottom-14 right-14 bg-[#FFF3E3] bg-opacity-80 p-10 mr-4 hidden md:block">
            <h6 className="font-semibold">New Arrivals</h6>
            <h4 className="text-[52px] font-bold text-[#B88E2F]">
              Discover Our <br /> New Collection
            </h4>
            <h2 className="text-[18px] font-bold">
              Lorem ipsum dolor sit amet consectetur adipisicing eligendi!
            </h2>
            <button
              className="bg-[#B88E2F] text-[16px] text-white px-12 py-4 mt-4 font-bold hover:bg-yellow-900 "
              onClick={() => {
                route.push("/products");
              }}
            >
              BUY NOW
            </button>
          </div>
        </div>
      </section>
      {/* browse the range */}
      <section className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Browse The Range</h2>
        <p className="text-gray-500 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className="flex justify-center space-x-6">
          <div className="max-w-xs">
            {/* <img src="" alt="Dining" className="rounded-lg w-full mb-4"> */}
            <Image
              src={"/assets/images/dining.png"}
              width={380}
              height={480}
              alt=""
            />
            <h3 className="text-lg font-semibold">Dining</h3>
          </div>

          <div className="max-w-xs">
            <Image
              src={"/assets/images/living-room.png"}
              width={380}
              height={480}
              alt=""
            />
            <h3 className="text-lg font-semibold">Living</h3>
          </div>

          <div className="max-w-xs">
            {/* <img src="" alt="Bedroom" className="rounded-lg w-full mb-4"> */}
            <Image
              src={"/assets/images/bed-room.png"}
              width={380}
              height={480}
              alt=""
            />
            <h3 className="text-lg font-semibold">Bedroom</h3>
          </div>
        </div>
      </section>
      {/* our products */}
      <section className="container mx-auto p-4 items-center justify-between">
        <h1 className="text-5xl font-bold mt-4 text-center items-center justify-center">
          Our Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {products.map((product) => (
            <ProductCard
              id={product.id}
              key={product.id}
              name={product.name}
              type={product.type}
              image={product.image}
              price={
                product.price - product.price * (product.sale_percent / 100)
              }
              discount_percent={product.sale_percent}
              price_before_discount={product.price}
              is_new_product={product.id % 2 === 0}
            />
          ))}
        </div>
      </section>
      {/* Room stay */}
      <section className="w-full mx-auto p-8 items-center justify-between bg-[#FCF8F3]">
        <div className="container mx-auto flex flex-col md:flex-row py-9">
          {/* Left column: text */}
          <div className="w-full md:w-1/3 px-4">
            <h1 className="text-4xl font-bold">
              50+ Beautiful Rooms <br /> Inspiration
            </h1>
            <p className="text-gray-500 mt-4">
              Our design already includes a lot of beautiful <br /> room
              prototypes to inspire you.
            </p>
            <button className="bg-yellow-400 text-white px-8 py-3 mt-4 font-bold hover:bg-yellow-600">
              Explore More
            </button>
          </div>

          {/* Center column: image */}
          <div className="w-full md:w-1/3 flex items-center justify-center relative overflow-hidden px-4">
            <div className="flex-shrink-0">
              <Image
                src={rooms[roomSelected].image}
                width={432}
                height={582}
                alt=""
                unoptimized
              />
            </div>
            {/* Overlay */}
            <div className="absolute bottom-4 left-8 bg-white bg-opacity-80 p-6 rounded-lg">
              <h4 className="text-2xl font-bold text-[#898989]">
                {rooms[roomSelected].id}-{rooms[roomSelected].name}
              </h4>
              <h2 className="text-3xl font-bold">
                {rooms[roomSelected].content}
              </h2>
            </div>
            {/* Right Arrow */}
            <div className="absolute right-4 bottom-4">
              <button
                className="bg-yellow-400 p-2 rounded-full hover:bg-yellow-600"
                onClick={() => {
                  if (roomSelected < rooms.length - 1) {
                    setRoomSelected(roomSelected + 1);
                  } else {
                    setRoomSelected(0);
                  }
                }}
              >
                <Image
                  src={"/assets/icons/right_16px.svg"}
                  width={24}
                  height={24}
                  alt="Next"
                  className="w-6 h-6 text-gray-800"
                />
              </button>
            </div>
          </div>

          {/* Right column: Carousel */}
          <div className="w-full md:w-1/3 flex items-center justify-center px-4">
            <Carousel />
          </div>
        </div>
      </section>

      {/* Stay Furniture */}
      <section className="bg-gray-50 p-8">
        <div className="text-center mb-8">
          <h1 className="text-[20px] font-bold text-gray-400">
            Share your setup with
          </h1>
          <h2 className="text-4xl text-gray-800 font-bold mt-2">
            #FuniroFurniture
          </h2>
        </div>
        <Image
          src={"/assets/images/stay.png"}
          alt=""
          width={1000}
          height={16}
          className="mx-auto"
        />
      </section>
    </>
  );
};

export default HomePage;
