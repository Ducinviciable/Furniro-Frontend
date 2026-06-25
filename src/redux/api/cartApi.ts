import { ICartItemResquest } from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export interface IBackendCartItem {
  id: number;
  product_id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ICartResponse {
  data: IBackendCartItem[];
  total: number;
  message?: string;
}

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}cart`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  }),
  endpoints: (builder) => ({
    getCart: builder.query<ICartResponse, void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),

    updateCart: builder.mutation<ICartResponse, ICartItemResquest>({
      query: (body) => ({
        url: "/",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const { useGetCartQuery, useUpdateCartMutation } = cartApi;
