import { ILogin, IRegister, IUser, IApiResponse } from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export interface ICheckTokenResponse {
  status: number;
  message: string;
  customer: IUser;
}

export interface IRegisterResponse {
  result: {
    id: number;
    email: string;
    customer_id: number;
  };
  access_token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}auth`,
    headers: {
      "Content-Type": "application/json",
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<IApiResponse<{ access_token: string } & IUser>, ILogin>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<IApiResponse<IRegisterResponse>, IRegister>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),

    checkToken: builder.query<ICheckTokenResponse, any>({
      query: () => ({
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        url: "/check-token",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useCheckTokenQuery } =
  authApi;
