import { useEffect, useState } from "react";
import Image from "next/image";
import { useGetCartQuery } from "@/redux/api/cartApi";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/utils/types";
import { SET_CART } from "@/redux/slices/cartSlice";
import Link from "next/link";
import { rerdirectTo } from "@/utils/appUtils";

const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: cartResponse, isLoading } = useGetCartQuery();
  const dispatch = useDispatch();
  const cartState = useSelector((state: AppState) => state.cart);
  const authState = useSelector((state: AppState) => state.auth);

  useEffect(() => {
    if (cartResponse && Array.isArray(cartResponse.data)) {
      dispatch(
        SET_CART({
          items: cartResponse.data.map((item) => ({
            id: item.id,
            product: {
              id: item.product_id,
              name: item.name,
            },
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
          numberOfItems: cartResponse.total,
          subTotal: cartResponse.data.reduce(
            (total: number, item: { price: number; quantity: number }) =>
              total + item.price * item.quantity,
            0
          ),
          total: 0,
        })
      );
    }
  }, [cartResponse, dispatch]);

  if (isLoading) return <Loading />;
  if (authState.isAuthenticated === undefined) return null;

  const toggleCart = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="relative" onClick={toggleCart}>
        <Image
          src={"/assets/icons/ant-design_shopping-cart-outlined.svg"}
          width={28}
          height={28}
          unoptimized
          alt="cart"
          priority
        />
        {cartState.numberOfItems > 0 && cartState.items.length > 0 && (
          <span className="absolute top-[-10px] right-[-10px] w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {cartState.numberOfItems}
          </span>
        )}
      </div>

      <div
        className={`fixed top-0 right-0 h-auto max-h-[90vh] w-80 bg-white shadow-lg z-50 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 flex flex-col`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button onClick={toggleCart} className="text-gray-600 text-2xl">
            &times;
          </button>
        </div>

        {authState.isAuthenticated === false && (
          <p className="text-gray-600">
            Please log in to view your cart.{" "}
            <Link className="text-blue-600" href={"/auth/login"}>
              Login
            </Link>
          </p>
        )}
        {cartState.numberOfItems === 0 && authState.isAuthenticated ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            {cartState.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-lg shadow-sm"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name ?? "Product"}
                    width={64}
                    height={64}
                    unoptimized
                    className="w-16 h-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-md bg-gray-200" />
                )}
                <div className="flex-1 px-3">
                  <h3 className="font-semibold text-gray-700">{item.name}</h3>
                  <p className="text-gray-500">
                    {item.quantity} x ${item.price.toLocaleString()}
                  </p>
                </div>
                <button className="text-red-500 hover:text-red-700">
                  &times;
                </button>
              </div>
            ))}
          </>
        )}

        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold text-lg">
              ${cartState.subTotal.toLocaleString()}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              className="flex-1 border border-gray-500 text-gray-700 py-2 rounded-lg hover:bg-gray-100"
              onClick={() => rerdirectTo("/cart")}
            >
              Cart
            </button>
            <button
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              onClick={() => rerdirectTo("/checkout")}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
