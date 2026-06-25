import React, { useEffect, useState } from "react";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import FeatureCard from "@/components/FeatureCard";
import { useDispatch, useSelector } from "react-redux";
import {
  AppState,
  CartAction,
  ICartItemResquest,
  UpdateQuantityType,
} from "@/utils/types";
import Router, { useRouter } from "next/router";
import Cart from "./components/Cart";
import { DECREMENT_CART, INCREMENT_CART } from "@/redux/slices/cartSlice";
import { useUpdateCartMutation } from "@/redux/api/cartApi";
import toast from "react-hot-toast";
import { rerdirectTo } from "@/utils/appUtils";

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const [cartUpdate] = useUpdateCartMutation();
  const cartState = useSelector((state: AppState) => state.cart);

  const handleUpdateQuantity = async (id: number, type: UpdateQuantityType) => {
    try {
      if (type === UpdateQuantityType.INCREMENT) {
        dispatch(INCREMENT_CART(id));
      } else if (type === UpdateQuantityType.DECREMENT) {
        dispatch(DECREMENT_CART(id));
      }

      // Lấy trạng thái mới nhất sau khi Redux đã cập nhật
      const updatedState = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(getProductById(id));
        }, 1000); // Giảm thời gian chờ tối đa nếu cần
      });
      const productUpdate = updatedState as ICartItemResquest; // Đảm bảo kiểu dữ liệu
      console.log(productUpdate);

      const cartUpdateBody: ICartItemResquest = {
        action: CartAction.UPDATE,
        product_id: id,
        price: productUpdate?.price || 0,
        quantity:
          type === UpdateQuantityType.INCREMENT
            ? productUpdate?.quantity + 1
            : productUpdate?.quantity - 1 || 0,
      };

      const result = await cartUpdate(cartUpdateBody).unwrap();
      toast.success(result.message || "Cart updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update cart");
      }
    }
  };

  const getProductById = (id: number) => {
    return cartState.items.find((item) => item.id === id);
  };

  const handleRemoveItem = (id: number) => {};

  const handleCheckout = () => {
    console.log("Proceeding to checkout...");
  };
  const auth = useSelector((state: AppState) => state.auth);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      Router.push("/auth/login");
    }
  }, [auth.isAuthenticated]);
  const route = useRouter();
  return (
    <>
      <Header />
      <Cart
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => rerdirectTo("/checkout")}
      />
      <FeatureCard />
      <Footer />
    </>
  );
};

export default CartPage;
