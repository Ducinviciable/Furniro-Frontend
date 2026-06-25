import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ICart, ICartItem } from "../../utils/types";
import { cartApi, IBackendCartItem } from "../api/cartApi";

// Định nghĩa kiểu state của giỏ hàng
interface CartState {
  items: ICartItem[];
  numberOfItems: number;
  subTotal: number;
}

const initialState: CartState = {
  items: [],
  numberOfItems: 0,
  subTotal: 0,
};

const updateCartSummary = (state: CartState) => {
  state.numberOfItems = state.items.length;
  state.subTotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Đặt lại toàn bộ giỏ hàng
    SET_CART: (state, action: PayloadAction<ICart>) => {
      state.items = action.payload.items;
      state.numberOfItems = action.payload.numberOfItems;
      state.subTotal = action.payload.subTotal;
    },

    // Thêm sản phẩm vào giỏ
    ADD_TO_CART: (state, action: PayloadAction<ICartItem>) => {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.product.id
      );

      if (!existingItem) {
        state.items.push(action.payload);
      } else {
        existingItem.quantity += action.payload.quantity;
      }

      updateCartSummary(state);
    },

    // Tăng số lượng sản phẩm
    INCREMENT_CART: (state, action: PayloadAction<number>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity = item.quantity + 1;
        updateCartSummary(state);
      }
    },
    CLEAR_CART: (state) => {
      state.items = [];
      state.numberOfItems = 0;
      state.subTotal = 0;
    },

    // Giảm số lượng sản phẩm
    DECREMENT_CART: (state, action: PayloadAction<number>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity = item.quantity - 1;
        updateCartSummary(state);
      }
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      cartApi.endpoints.updateCart.matchFulfilled,
      (state, action: PayloadAction<{ data: IBackendCartItem[]; total: number }>) => {
        state.items = action.payload.data.map((item) => ({
          id: item.id,
          product: {
            id: item.product_id,
            name: item.name,
          },
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        }));

        state.numberOfItems = action.payload.total;
        state.subTotal = action.payload.data.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      }
    );
  },
});

export default cartSlice.reducer;

export const {
  SET_CART,
  ADD_TO_CART,
  INCREMENT_CART,
  DECREMENT_CART,
  CLEAR_CART,
} = cartSlice.actions;
