import Footer from "@/pages/layouts/Footer";
import Header from "@/pages/layouts/Header";
import Image from "next/image";
import React from "react";
import Button from "@/components/Button";
import HeadImage from "@/components/HeadImage";
import FeatureCard from "@/components/FeatureCard";
import { useRouter } from "next/router";
import { useGetProductsForComparisonQuery } from "@/redux/api/productcompare";

const ComparePage: React.FC = () => {
  const router = useRouter();
  const { productId1, productId2 } = router.query;

  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsForComparisonQuery(
    {
      productId1: productId1 as string,
      productId2: productId2 as string,
    },
    { skip: !productId1 || !productId2 }
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading comparison</div>;
  if (!products || products.length < 2) return <div>Not enough products</div>;
  return (
    <>
      <Header />
      <HeadImage title="Compare Products" link="Home / Compare" />
      <div className="w-[90%] h-3/4 p-4 mx-auto my-auto flex flex-col">
        <div className="flex justify-between items-start mb-8 w-full">
          {/* Left Section - 25% */}
          <div className="w-full lg:w-1/4 px-2 mb-4 lg:mb-0">
            <h2 className="text-lg font-semibold">
              Go to Product page for more Products
            </h2>
            <button className="text-yellow-600 mt-2 underline">
              View More
            </button>
          </div>

          {/* Product 1 - 25% */}
          <div className="w-full lg:w-1/4 px-2 mb-4 lg:mb-0">
            {products[0] ? (
              <div className="bg-[#FAF6F3] p-4 rounded-lg shadow-sm flex flex-col items-center">
                <Image
                  src={products[0].image}
                  alt={products[0].name}
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
                <h3 className="text-lg font-semibold mt-2">
                  {products[0].name}
                </h3>
                <p className="text-gray-600">$ {products[0].price}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500 text-lg">
                    ★ {products[0].rating}
                  </span>
                  <p className="text-gray-500 ml-2">
                    | {products[0].reviews} Reviews
                  </p>
                </div>
              </div>
            ) : (
              <div>Loading product 1...</div>
            )}
          </div>

          {/* Product 2 - 25% */}
          <div className="w-full lg:w-1/4 px-2 mb-4 lg:mb-0">
            {products[1] ? (
              <div className="bg-[#FAF6F3] p-4 rounded-lg shadow-sm flex flex-col items-center">
                <Image
                  src={products[1].image}
                  alt={products[1].name}
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
                <h3 className="text-lg font-semibold mt-2">
                  {products[1].name}
                </h3>
                <p className="text-gray-600">$ {products[1].price}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500 text-lg">
                    ★ {products[1].rating}
                  </span>
                  <p className="text-gray-500 ml-2">
                    | {products[1].reviews} Reviews
                  </p>
                </div>
              </div>
            ) : (
              <div>Loading product 2...</div>
            )}
          </div>

          {/* Add Product Section - 25% */}
          <div className="w-full lg:w-1/4 px-2">
            <h2 className="text-lg font-semibold mb-2">Add A Product</h2>
            <button className="bg-[#B88E2F] text-white px-4 py-2 rounded-md hover:bg-yellow-700">
              Choose a Product
            </button>
          </div>
        </div>

        {/* table in mobile */}
        <div className="bg-white rounded-lg shadow-md p-4 flex-grow overflow-x-auto">
          <table className="table-auto text-left w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 w-1/4">General</th>
                <th className="p-2 w-1/4">Asgaard Sofa</th>
                <th className="p-2 w-1/4">Outdoor Sofa Set</th>
                <th className="p-2 w-1/4"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">Sales Package</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2">Model Number</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr>
                <td className="p-2">Secondary Material</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2">Configuration</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr>
                <td className="p-2">Upholstery Materia</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2">Upholstery Color</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
            </tbody>

            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Product</th>
                <th className="p-2"></th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">Filling Material</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2">Adjustable Headrest</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr>
                <td className="p-2">Adjustable Headrest</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2">Maximum Load Capacity</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr>
                <td className="p-2">Origin of Manufacture</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
            </tbody>

            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Dimensions</th>
                <th className="p-2"></th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">Width</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2">Height</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr>
                <td className="p-2">Depth</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2">Weight</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr>
                <td className="p-2">Seat Height</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2">Leg Height</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
            </tbody>

            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Warranty</th>
                <th className="p-2"></th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">Warranty Summary</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2">Warranty Service Type</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr>
                <td className="p-2">Covered in Warranty</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2">Not Covered in Warranty</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr>
                <td className="p-2">Domestic Warranty</td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
                <td className="p-2 max-w-xs break-words">
                  1 sectional sofa with cushions and extra padding
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2"></td>
                <td className="p-2 max-w-xs break-words">
                  <div className="flex justify-center items-center p-4">
                    <Button
                      text="Add To Cart"
                      onClick={() => alert("Added to cart")}
                    />
                  </div>
                </td>
                <td className="p-2 max-w-xs break-words">
                  <div className="flex justify-center items-center p-4">
                    <Button
                      text="Add To Cart"
                      onClick={() => alert("Added to cart")}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <FeatureCard />
      <Footer />
    </>
  );
};

export default ComparePage;
