import { ChangeEvent, FormEvent } from "react";

export type FormSubmit = FormEvent<HTMLFormElement>;
export type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;
// state

export type AppState = {
  auth: IAuthState;
  cart: ICart;
};
export interface IAuthState {
  user: IUser;
  isAuthenticated: boolean;
}

export interface IUser {
  id?: number;
  name: string;
  email: string;
  phone: string;
}

export interface ICart {
  total: number;
  items: ICartItem[];
  numberOfItems: number;
  subTotal: number;
}

export interface IProduct {
  created_at?: string;
  id?: number;
  name: string;
  description?: string;
  price?: number;
  products_prices?: IProducts_Prices;
  products_images?: IImage;
  categories?: ICategories;
  SKU?: string;
  products_details?: IProductDetail;
  tags?: string[];
  categories_id?: number;
  products_variants?: IProductsVariants;
}

export interface IProductsVariants {
  id?: string;
  color: string[];
  size: string[];
}
export interface IGeneral {
  sales_package: string;
  model_number: string;
  secondary_material: string;
  configuration: string;
  upholstery_material: string;
  upholstery_color: string;
}
export interface IImage {
  id?: string;
  images: string[];
}
export interface ICategories {
  id?: string;
  name: string;
  created_at?: string;
  //   sku?: string;
}

export interface IProductDetail {
  id?: string;
  sort_description: string;
  long_description: string;
  dimensions: IDimensions;
  general: IGeneral;
  warranty: IWarranty;
}

export interface IWarranty {
  warranty_summary: string;
  warranty_service_type: string;
  covered_in_warranty: string;
  not_covered_in_warranty: string;
  domestic_warranty: string;
}
export interface IProducts_Prices {
  id?: string;
  price: number;
  sale_percent: number;
  products_id?: number;
}

export interface IDimensions {
  id?: string;
  width: number;
  height: number;
  depth: number;
  weight: number;
  seat_height?: number;
  leg_height?: number;
  products_dimensions_details_id?: number;
}

export interface ICartItem {
  id?: number;
  product: IProduct;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

export interface IRegister {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IProductItem {
  _id: number;
  name?: string;
  type?: string;
  image?: string;
  price: IProductPrice;
  created_at: string;
}

export interface IProductPrice {
  price: number;
  sale_percent: number;
}

export interface IProductInShop {
  id: number;
  name: string;
  type: string;
  image: string;
  price: number;
  sale_percent: number;
  created_at: string;
}
export interface IProductBase {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

export interface IProductCompare extends IProductBase {
  general: {
    sales_package: string;
    model_number: string;
    secondary_material: string;
    configuration: string;
    upholstery_material: string;
    upholstery_color: string;
  };

  dimensions: {
    width: string;
    height: string;
    depth: string;
    weight: string;
    seat_height: string;
    leg_height: string;
  };

  warranty: {
    summary: string;
    service_type: string;
    covered_items: string;
    excluded_items: string;
    domestic_warranty: string;
  };
}

export interface IComparePageProps {
  products: IProductCompare[];
}

export interface ICartItemResquest {
  product_id: number;
  quantity: number;
  price: number;
  action: CartAction;
}

export enum UpdateQuantityType {
  INCREMENT = "increment",
  DECREMENT = "decrement",
}

export enum CartAction {
  ADD = "add",
  REMOVE = "remove",
  UPDATE = "update",
  CLEAR = "clear",
}

export enum TypePayment {
  CREDIT_CARD = "CREDIT_CARD",
  PAYPAL = "PAYPAL",
  COD = "COD",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export interface ICreateOrderDetail {
  quantity: number;
  price: number;
  product_id: number;
}

export interface ICreateOrder {
  payment_method: TypePayment;
  subtotal: number;
  addressId: number;
  orderDetails: ICreateOrderDetail[];
}

export interface ICreateAddress {
  first_name: string;
  last_name: string;
  companyName?: string;
  country: string;
  street?: string;
  city: string;
  province: string;
  zipcode: string;
  phone: string;
  email: string;
  paymentMethod?: TypePayment;
}

export interface ICustomerProfile {
  name: string;
  email: string;
  phone: string;
}

export interface IUpdateOrder {
  id?: number;
  status: OrderStatus;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface IApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
  status?: number;
}

export interface ICategoryProduct {
  id: number;
  name: string;
  price: number;
  sale_percent: number;
  products_images: string;
  categories?: {
    id: number;
    name: string;
  };
}

export interface ISearchProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

