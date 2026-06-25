import Footer from "@/pages/layouts/Footer";
import Header from "@/pages/layouts/Header";
import Button from "@mui/material/Button";
import Image from "next/image";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import React, { useEffect, useState } from "react";
import Router from "next/router";
import { AppState, ILogin, InputChange } from "@/utils/types";
import { useLoginMutation } from "@/redux/api/authApi";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_SUCCESS, LOGOUT } from "@/redux/slices/authSlice";
import TextField from "@mui/material/TextField";

const LoginPage = () => {
  const initalState: ILogin = {
    email: "",
    password: "",
  };

  const [loginParams, setloginParams] = useState<ILogin>(initalState);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginResponse] = useLoginMutation();
  const auth = useSelector((state: AppState) => state.auth);
  const dispatch = useDispatch();

  const handleOnChange = (e: InputChange) => {
    const { name, value } = e.target;
    setloginParams({ ...loginParams, [name]: value });
  };

  const validEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    // console.log(loginParams);
    e.preventDefault();
    let valid = true;

    if (!validEmail(loginParams.email)) {
      setEmailError("Email không hợp lệ");
      valid = false;
    } else {
      setEmailError("");
    }

    if (loginParams.password.length < 6) {
      setPasswordError("Pass không được ít hơn 6 kí tự");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (valid) {
      loginResponse(loginParams)
        .unwrap()
        .then((res) => {
          if (res.status == 200) {
            toast.success("Login successfully");
            Cookies.set("token", res.data.access_token);
            dispatch(
              LOGIN_SUCCESS({
                ...res.data,
                isAuthenticated: true,
              })
            );
            // Go to homepage
            Router.push("/");
          } else {
            toast.error(res.message || "Login failed");
          }
        })
        .catch((error) => {
          toast.error(error.data.message);
        });
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (auth.isAuthenticated && token) {
      Router.push("/");
    } else if (auth.isAuthenticated && !token) {
      dispatch(LOGOUT());
    }
  }, [auth.isAuthenticated, dispatch]);

  return (
    <>
      <Header />
      <section>
        <div className="p-8">
          <div className="min-h-screen flex items-center justify-center ">
            <div className="bg-white rounded-lg flex space-x-10">
              {/* Left Section with Image */}
              <div className="hidden md:flex items-center justify-center w-full">
                <div className="">
                  {/* Replace with your image */}
                  <Image
                    src={"/assets/images/sideimage.png"}
                    width={805}
                    height={781}
                    unoptimized
                    alt=""
                    className="w-full h-full rounded-lg object-contain"
                  />
                </div>
              </div>

              {/* Right Section with Form */}
              <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                <h2 className="text-2xl font-semibold mb-6">
                  Login to Exclusive{" "}
                </h2>
                <p className="text-gray-600 mb-4">Enter your details below</p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="relative">
                    <TextField
                      required
                      label="Email"
                      type="text"
                      name="email"
                      onChange={handleOnChange}
                      error={!!emailError}
                      className="w-full mt-2 p-2 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                      <AccountCircleOutlinedIcon fontSize="large" />
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-sm mt-1">{emailError}</p>
                    )}
                  </div>
                  <div className="relative">
                    <TextField
                      required
                      label="Password"
                      type="password"
                      name="password"
                      error={!!passwordError}
                      onChange={handleOnChange}
                      id="password"
                      className="w-full mt-2 p-2 border border-white rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    {passwordError && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordError}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-red-500 text-white py-2 rounded-md mt-4 hover:bg-red-600 transition"
                    variant="contained"
                    color="error"
                  >
                    Login
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <p>
                    <a
                      href="#"
                      className="text-sm text-red-500 hover:underline pr-2"
                    >
                      Forget a Password.
                    </a>
                    Create an account{" "}
                    <a
                      onClick={() => {
                        Router.push("/auth/sign-up");
                      }}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Sign up
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default LoginPage;

// function setEmailError(arg0: string) {
//   throw new Error("Function not implemented.");
// }
