"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { useSearchProductQuery } from "@/redux/api/productApi";
import { useRouter } from "next/router";
import { ISearchProduct } from "@/utils/types";

interface SearchBarProps {
  onClose: () => void;
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400); // Trì hoãn 400ms
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Gọi API tìm kiếm sản phẩm
  const { data, isFetching } = useSearchProductQuery(
    debouncedQuery,
    {
      skip: debouncedQuery.trim().length <= 1,
    }
  );

  const products: ISearchProduct[] = data?.data || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div
        ref={searchRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
      >
        {/* Input tìm kiếm */}
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 text-lg border-b focus:outline-none"
            placeholder="Tìm kiếm sản phẩm..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Loading */}
        {isFetching && (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        )}

        {/* Danh sách sản phẩm gợi ý */}
        {!isFetching && products.length > 0 && (
          <ul className="max-h-96 overflow-auto">
            {products.map((product: ISearchProduct) => (
              <li
                key={product.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => {
                  router.push(`/products/${product.id}`);
                }}
              >
                {/* Hiển thị hình ảnh nếu tồn tại */}
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md mr-3"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
                    <span className="text-gray-500">Ảnh</span>
                  </div>
                )}
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    {product.description}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Khi không có sản phẩm */}
        {!isFetching && query.length > 1 && products.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            Not found product: {query}
          </div>
        )}
      </div>
    </div>
  );
}
