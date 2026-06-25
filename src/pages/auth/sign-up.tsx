import Footer from "@/pages/layouts/Footer";
import Header from "@/pages/layouts/Header";
import { useRegisterMutation } from "@/redux/api/authApi";
import { toast } from "react-hot-toast";
import { AppState, FormSubmit, IRegister, InputChange } from "@/utils/types";
import { CircularProgress, TextField } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_SUCCESS } from "@/redux/slices/authSlice";
const SignupPage = () => {
  const initalState: IRegister = {
    phone: "",
    password: "",
    email: "",
    name: "",
  };

  const [isLoading, setLoading] = useState(false);
  const [registerParams, setRegisterParams] = useState<IRegister>(initalState);
  const [registerResponse] = useRegisterMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: AppState) => state.auth);

  useEffect(() => {
    if (isAuthenticated.isAuthenticated) {
      router.push("/");
    }
  }, []);

  const validateForm = () => {
    // check valid phone
    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

    if (!registerParams.phone.match(regexPhoneNumber)) {
      toast.error("Invalid phone number");
      return false;
    }
  };

  const handleOnSubmit = (e: FormSubmit) => {
    e.preventDefault();
    setLoading(true);
    // if (!validateForm()) {
    //   toast.error("Please fill all the fields");
    //   setLoading(false);
    //   return;
    // }
    setTimeout(() => {
      registerResponse(registerParams)
        .unwrap()
        .then((data) => {
          if (data.status != 200) {
            toast.error(data.message || "Sign up failed");
          }
          if (data.status == 200) {
            Cookies.set("token", data.data.access_token);
            toast.success(data.message || "Sign up successful!");
            console.log(data);
            dispatch(
              LOGIN_SUCCESS({
                ...data.data.result,
                isAuthenticated: true,
              })
            );
            router.push("/");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.data.message);
        });
      setLoading(false);
    }, 1000);
  };

  const handleOnChange = (e: InputChange) => {
    const { name, value } = e.target;
    setRegisterParams({ ...registerParams, [name]: value });
  };

  return isLoading == true ? (
    <div className="flex items-center justify-center h-screen">
      <CircularProgress />
    </div>
  ) : (
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
                    alt="Facebook"
                    className="w-full h-full rounded-lg object-contain"
                  />
                </div>
              </div>

              {/* Right Section with Form */}
              <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                <h2 className="text-2xl font-semibold mb-6">
                  Create an account{" "}
                </h2>
                <p className="text-gray-600 mb-4">Enter your details below</p>
                <form onSubmit={handleOnSubmit} className="space-y-4">
                  <div>
                    <TextField
                      required
                      label="Name"
                      type="text"
                      id="name"
                      name="name"
                      onChange={handleOnChange}
                      className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <TextField
                      required
                      label="Phone Number"
                      type="text"
                      id="phone"
                      name="phone"
                      onChange={handleOnChange}
                      className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <TextField
                      required
                      label="Email"
                      type="text"
                      id="email"
                      name="email"
                      onChange={handleOnChange}
                      className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <TextField
                      required
                      label="Password"
                      type="password"
                      id="password"
                      name="password"
                      onChange={handleOnChange}
                      className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-red-500 text-white py-2 rounded-md mt-4 hover:bg-red-600 transition"
                  >
                    Create
                  </button>
                  <button
                    type="submit"
                    className="w-full bg-white text-black py-2 border border-gray-300 rounded-md mt-4 hover:bg-red-600 transition"
                  >
                    Sign up with Google
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <p>
                    Already have an account ?{" "}
                    <Link
                      href="/auth/login"
                      className="text-sm text-red-500 hover:underline"
                    >
                      Login
                    </Link>
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

export default SignupPage;
