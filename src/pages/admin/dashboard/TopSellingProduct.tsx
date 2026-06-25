import Image from "next/image";

interface Product {
  id: number;
  name: string;
  sales: number;
  image: string;
}

interface TopSellingProductsProps {
  products: Product[];
}

export default function TopSellingProducts(props: TopSellingProductsProps) {
  if (!props || !props.products) return null;
  const { products } = props;
  return (
    <ul className="divide-y divide-gray-200">
      {products.map((product) => (
        <li key={product.id} className="py-4 flex items-center">
          <Image
            src={product.image}
            alt={product.name}
            width={40}
            height={40}
            className="rounded-full mr-4"
          />
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900">
              {product.name}
            </h4>
            <p className="text-sm text-gray-600">Sales: {product.sales}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
