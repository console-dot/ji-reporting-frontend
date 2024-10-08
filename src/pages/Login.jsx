import instance from "../api/instrance";
import { useNavigate, Link } from "react-router-dom";
import { toJson } from "../utils";
import { useToastState } from "../context";
import { useContext, useState } from "react";
import { Loader } from "../components";
import { UIContext } from "../context/ui";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Powered } from "../components/consoledot";

export const Login = ({ setAuthenticated }) => {
  const navigate = useNavigate();
  const { dispatch } = useToastState();
  const { loading, setLoading } = useContext(UIContext);
  const [showPass, setShowPass] = useState(false);
  const handleClick = () => {
    window.open('https://consoledot.com', '_blank'); 
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const { email, password } = toJson(formData);
    try {
      const res = await instance.post(
        "/user/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("@token", res?.data?.data?.token);
      setAuthenticated(res?.data?.data?.token);
      localStorage.setItem("@type", res?.data?.data?.type);
      localStorage.setItem("@nazimType", res?.data?.data?.nazimType);
      if(res?.data?.data?.nazimType === 'umeedwar' || res?.data?.data?.nazimType==="rukan"){
        navigate("/personalReport");
      }
      else{
        navigate("/");

      }
    } catch (error) {
      const message = error?.response?.data?.message;
      dispatch({ type: "ERROR", payload: message });
    }
    setLoading(false);
  };
  return (
    <div className="relative flex  justify-center min-h-screen overflow-hidden">
      <div className=" w-[40%] bg-secondary h-screen p-[40px] md:flex md:flex-col md:justify-between  hidden">
        <div></div>
        <div className="flex flex-col gap-4">
          <h2 class="text-white font-inter text-2xl font-bold leading-7 text-left">
            Welcome to IJT Reporting
          </h2>
          <p class="text-white font-inter text-base font-normal leading-7 text-left">
            Get better view of your activities and manage your nazims in an easy
            way. Report your activities here.
          </p>
        </div>
      </div>
      <div className="w-full p-6 m-auto  lg:max-w-lg">
        <div className="flex flex-col gap-4 items-center justify-center w-full">
          <img
            src="/logo.png"
            className="text-center  h-[104px] w-[142px]"
            alt="LOGO"
          />
          <h2 className="text-heading text-[20px] leading-7 font-semibold font-inter">
            Login into your account
          </h2>
          <p className="font-inter font-medium text-[14px] text-center leading-4 text-secondaryText">
            Enter your email and password to access your account
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 bg-white rounded-md shadow-md p-4">
            <div>
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Email
                </span>
              </label>
              <input
                name="email"
                type="text"
                placeholder="Email Address"
                className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
              />
            </div>
            <div className="relative">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Password
                </span>
              </label>
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full text-secondaryText border border-inputBorder outline-none rounded p-2 text-[16px] leading-6 font-inter"
              />
              <span
                className="absolute right-[4%] top-[65%]"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="w-full">
              <button
                disabled={loading}
                className="text-[14px] leading-6 font-medium font-inter text-white bg-primary w-full py-2 border rounded"
                type="submit"
              >
                Login to your account
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-secondaryText text-[14px] leading-5 font-inter font-normal">
                Doesn't have an account?
              </span>
              <Link
                to="/signup"
                className="text-[14px] leading-3 font-medium text-heading font-inter underline"
              >
                Create new account
              </Link>
            </div>
            <Link
              to="/reset-password"
              className="text-[14px] leading-5 font-medium text-accentForeground font-inter underline"
            >
              Forget Password?
            </Link>
          </div>
        </form>
      
          <div
            className="w-full flex items-center justify-center mt-2 gap-2 border-t-primary cursor-pointer"
            onClick={handleClick}
          >
            <span className="text-black font-inter text-[14px]">
              Powered By:
            </span>
            <div className="flex gap-2 items-center">
              <img src="/cd.png" alt="icon" width={15} height={15} />
              <span className="text-black font-inter text-[14px]">
                ConsoleDot
              </span>
            </div>
          </div>
        
        {/* <div className="w-full flex justify-center items-start gap-3">
          <span className="text-slate-800">Powered By:</span>
          <a
            href="https://consoledot.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-start gap-1"
          >
            <img src="/cd.png" alt="CD LOGO" className="w-5 h-5" /> ConsoleDot
          </a>
        </div> */}
      </div>
      {loading && <Loader />}
    </div>
  );
};
