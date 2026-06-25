import CustomerProfile from "./components/CustomerProfile";
import OrderHistory from "./components/OrderHistory";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { useEffect } from "react";
import { useCheckTokenQuery } from "@/redux/api/authApi";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";
import { useGetOrdersQuery } from "@/redux/api/orderApi";

const AccountPage = () => {
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/auth/login";
    }
  }, [token]);

  const { data: userData, isLoading, isError } = useCheckTokenQuery(undefined, { skip: !token });
  const { data: orderData, isLoading: orderLoading } = useGetOrdersQuery(undefined, { skip: !token });

  useEffect(() => {
    if (isError) {
      Cookies.remove("token");
      window.location.href = "/auth/login";
    }
  }, [isError]);

  if (!token || isLoading || orderLoading) return <Loading />;

  if (isError || !userData || !orderData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Phiên đăng nhập hết hạn hoặc xảy ra lỗi. Đang chuyển hướng...
      </div>
    );
  }

  const orderHistory = orderData?.data || [];
  return (
    <>
      <Header />
      <CustomerProfile customer={userData?.customer} />
      <OrderHistory orders={orderHistory} />
      <Footer />
    </>
  );
};

export default AccountPage;
