import {
  ICreateOrder,
  IUpdateOrder,
  IApiResponse,
  IOrder,
  IAdminOrder,
  ICreateOrderResponse,
} from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}order`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation<IApiResponse<ICreateOrderResponse>, ICreateOrder>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
    }),
    getOrders: builder.query<IApiResponse<IOrder[]>, void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
    adminGetOrders: builder.query<IApiResponse<IAdminOrder[]>, void>({
      query: () => ({
        url: "/admin",
        method: "GET",
      }),
    }),
    updateOrder: builder.mutation<IApiResponse<IOrder>, IUpdateOrder>({
      query: (body) => ({
        url: ``,
        method: "PATCH",
        body,
      }),
    }),
    deleteOrder: builder.mutation<IApiResponse<void>, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useAdminGetOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
