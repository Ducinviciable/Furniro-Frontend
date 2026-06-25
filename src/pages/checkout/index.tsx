import React, { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import PaymentMethod from "@/components/PaymentMethod";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import HeadImage from "@/components/HeadImage";
import FeatureCard from "@/components/FeatureCard";
import { useDispatch, useSelector } from "react-redux";
import {
  AppState,
  ICreateAddress,
  ICreateOrder,
  InputChange,
  TypePayment,
  ICartItem,
} from "@/utils/types";
import { formatPrice, rerdirectTo } from "@/utils/appUtils";
import toast from "react-hot-toast";
import { useCreateOrderMutation } from "@/redux/api/orderApi";
import {
  useCreateAddressMutation,
  useGetAddressByIdQuery,
} from "@/redux/api/customerApi";
import { useRouter } from "next/router";
import { CLEAR_CART } from "@/redux/slices/cartSlice";
import Loading from "@/components/Loading";
import { cartApi } from "@/redux/api/cartApi";

const Checkout: React.FC = () => {
  const InitialStateForm: ICreateAddress = {
    first_name: "",
    last_name: "",
    country: "",
    city: "",
    province: "",
    zipcode: "",
    phone: "",
    email: "",
    street: "",
    paymentMethod: TypePayment.BANK_TRANSFER,
  };
  const [formData, setFormData] = useState<ICreateAddress>(InitialStateForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [createOrderRespon] = useCreateOrderMutation();
  const [createAddressRespon] = useCreateAddressMutation();
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();
  const dispatch = useDispatch();
  const cartState = useSelector((state: AppState) => state.cart);

  const { data: addressRespon, isLoading: isLoadingAddress } =
    useGetAddressByIdQuery();

  useEffect(() => {
    const addressId = localStorage.getItem("addressId");
    if (addressId != undefined && addressRespon?.data) {
      setFormData((prev) => ({
        ...prev,
        first_name: addressRespon.data.first_name || "",
        last_name: addressRespon.data.last_name || "",
        city: addressRespon.data.city || "",
        zipcode: addressRespon.data.zipcode || "",
        email: addressRespon.data.email || "",
        phone: addressRespon.data.phone || "",
        street: addressRespon.data.street || "",
      }));
    }
  }, [addressRespon]);
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.first_name.trim())
      newErrors.firstName = "First name is required.";
    formData.first_name.replace(/[^a-zA-Z0-9\s]/g, "");
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required.";
    formData.last_name.replace(/[^a-zA-Z0-9\s]/g, "");
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.zipcode.trim()) newErrors.zipCode = "Zipcode is required.";
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Valid email is required.";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone Number is required.";
    } else if (!/^\d{10,13}$/.test(formData.phone)) {
      newErrors.phone = "Phone Number must be between 10 and 13 digits.";
    }
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Please select a payment method.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOnChange = (e: InputChange) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartState.items.length === 0) {
      toast.error("Cart is empty");
      rerdirectTo("/");
      return;
    }

    if (validateForm()) {
      const addressBody: ICreateAddress = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        // companyName: "",
        country: formData.country,
        street: formData.street,
        city: formData.city,
        province: formData.province,
        zipcode: formData.zipcode,
        phone: formData.phone,
        email: formData.email,
      };
      setIsLoading(true);
      createAddressRespon(addressBody)
        .unwrap()
        .then((res) => {
          if (res.status == 201) {
            // push order
            localStorage.setItem("addressId", res.data.id.toString());
            const orderBody: ICreateOrder = {
              addressId: res.data.id,
              payment_method:
                formData.paymentMethod ?? TypePayment.BANK_TRANSFER,
              subtotal: cartState.subTotal,
              orderDetails: cartState.items.map((item: ICartItem) => ({
                product_id: item.product.id as number,
                quantity: item.quantity,
                price: item.price,
              })),
            };
            createOrderRespon(orderBody)
              .unwrap()
              .then((res) => {
                if (res.status == 200 || res.status == 201) {
                  toast.success("Order placed successfully");
                  dispatch(CLEAR_CART());
                  dispatch(cartApi.util.resetApiState());
                  route.push("/");
                } else {
                  toast.error(res.message || "Failed to place order.");
                  setIsLoading(false);
                }
              })
              .catch(() => {
                toast.error("An error occurred. Please try again.");
                setIsLoading(false);
              });
          } else {
            toast.error("Cannot create order address");
            setIsLoading(false);
          }
        })
        .catch((error) => {
          toast.error("An error occurred. Please try again.");
          console.error(error);
          setIsLoading(false);
        });
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  if (isLoading || isLoadingAddress) return <Loading />;
  return (
    <>
      <Header />
      <HeadImage title={"Checkout"} link={"Checkout"} />
      <form action="POST" onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row p-6 space-y-6 lg:space-y-0 lg:space-x-8 max-w-5xl mx-auto">
          {/* Billing Details Section */}
          <div className="w-full lg:w-1/2 space-y-4">
            <h2 className="text-2xl font-semibold">Billing details</h2>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                onChange={handleOnChange}
                name="first_name"
                label="First Name"
                defaultValue={formData.first_name}
                error={errors.first_name}
                isRequired
              />
              <InputField
                onChange={handleOnChange}
                name="last_name"
                label="Last Name"
                defaultValue={formData.last_name}
                error={errors.last_name}
                isRequired
              />
            </div>
            <InputField
              name="companyName"
              label="Company Name (Optional)"
              onChange={handleOnChange}
            />
            <InputField
              isRequired
              onChange={handleOnChange}
              name="country"
              label="Country / Region"
              type="select"
              defaultValue={formData.country ?? "Viet Nam"}
              options={[
                "Viet Nam",
                "United States",
                "Canada",
                "Australia",
                "United Kingdom",
                "Vietnam",
              ]}
            />
            <InputField
              name="street"
              label="Street address"
              isRequired
              defaultValue={formData.street}
              onChange={handleOnChange}
            />
            <InputField
              name="city"
              label="Town / City"
              isRequired
              defaultValue={formData.city}
              onChange={handleOnChange}
            />
            <InputField
              label="Province"
              name="province"
              type="select"
              onChange={handleOnChange}
              defaultValue={formData.province ?? "Hanoi"}
              options={[
                "Hanoi",
                "Ho Chi Minh",
                "Da Nang",
                "Can Tho",
                "Binh Duong",
                "Quang Nam",
              ]}
            />
            <InputField
              name="email"
              onChange={handleOnChange}
              label="Email Address"
              defaultValue={formData.email}
              isEmail
              isRequired
            />
            <InputField
              name="zipcode"
              defaultValue={formData.zipcode}
              onChange={handleOnChange}
              label="Zip Code"
              isRequired
            />
            <InputField
              name="phone"
              defaultValue={formData.phone}
              onChange={handleOnChange}
              label="Phone Number"
              isRequired
              error={errors.phone}
            />
            <InputField
              name="additionalInfo"
              onChange={handleOnChange}
              label=" "
              placeholder="Additional information"
              className="mt-10"
            />
          </div>

          {/* Order Summary Section */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-2xl font-semibold">Product</h2>
            <div className="border-t border-b py-4">
              {cartState.items.map((item) => (
                <>
                  <div className="flex justify-between">
                    <span>
                      {item.name}&ensp;X&ensp;{item.quantity}
                    </span>
                    <span>${formatPrice(item.price * item.quantity)}</span>
                  </div>
                </>
              ))}
              {/* <hr /> */}
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-orange-500">
                  ${formatPrice(cartState.subTotal)}
                </span>
              </div>
            </div>

            {/* Payment Methods */}
            <h2 className="text-lg font-semibold">Payment Method</h2>
            <PaymentMethod
              selectedMethod={formData.paymentMethod ?? TypePayment.BANK_TRANSFER}
              onChange={(method: TypePayment) =>
                setFormData({ ...formData, paymentMethod: method })
              }
              error={errors.paymentMethod}
            />

            <p className="text-sm text-gray-600">
              Your personal data will be used to support your experience
              throughout this website, to manage access to your account, and for
              other purposes described in our{" "}
              <span className="underline">privacy policy</span>.
            </p>

            <button
              className="mt-4 w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Place order"}
            </button>
          </div>
        </div>
      </form>
      <FeatureCard />
      <Footer />
    </>
  );
};

export default Checkout;
