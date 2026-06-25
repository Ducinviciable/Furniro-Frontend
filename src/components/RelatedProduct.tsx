import { useGetProductsByCategoryQuery } from "@/redux/api/productApi";
import ProductCard from "./ProductCard";
import React from "react";
import { ICategoryProduct } from "@/utils/types";

interface RelatedProductProps {
  categoryId: string;
  productId: string;
}

const RelatedProduct: React.FC<RelatedProductProps> = ({
  categoryId,
  productId,
}) => {
  const {
    data: relatedProductsResponse,
    isLoading,
    error,
  } = useGetProductsByCategoryQuery(categoryId, {
    skip: !categoryId,
  });

  const relatedProducts = relatedProductsResponse?.data
    ?.filter((relatedProduct: ICategoryProduct) => relatedProduct.id?.toString() !== productId)
    .slice(0, 4);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading related products</div>;
  console.log("categoryId", relatedProductsResponse);
  return (
    <section className="container mx-auto p-4 items-center justify-between">
      <h1 className="text-5xl font-bold mt-4 text-center items-center justify-center">
        Related Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {relatedProducts?.map((product: ICategoryProduct) => (
          <ProductCard
            key={product.id}
            name={product.name}
            type={product.categories?.name || ""}
            image={product.products_images}
            price={product.price - (product.price * product.sale_percent) / 100}
            discount_percent={product.sale_percent}
            price_before_discount={product.price}
            id={product.id}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProduct;
