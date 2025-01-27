import { useContext, useEffect, useState } from "react";
import instance from "../api/instrance";
import { useToastState } from "../context";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "../components";
import { UIContext } from "../context/ui";

export const ResetPassword = () => {
  const { dispatch } = useToastState();
  const { loading, setLoading } = useContext(UIContext);
  const [key, setKey] = useState("");
  const [password, setPassword] = useState("");
  const [hasMinLength, setHasMinLength] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    if (queryParams.get("key")) {
      setKey(queryParams.get("key"));
    }
  }, []);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Check for a minimum length of 10 characters
    setHasMinLength(newPassword.length >= 8);
  };

  const handleReset = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await instance.post("/user/reset", {
        password1: formData.get("passwrod1"),
        password2: formData.get("passwrod1"),
        key: key,
      });
      dispatch({ type: "SUCCESS", payload: res.data?.message });
      e.target.reset();
      navigate("/login");
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.response.data.message });
    }
    setLoading(false);
  };

  return (
    <div className="relative flex justify-center min-h-screen overflow-hidden">
      <div className="w-[40%] bg-secondary h-screen p-[40px] md:flex md:flex-col md:justify-between  hidden">
        <div></div>
        <div className="flex flex-col gap-4">
          <h2 className="text-white font-inter text-2xl font-bold leading-7 text-left">
            Welcome to IJT Reporting
          </h2>
          <p className="text-white font-inter text-base font-normal leading-7 text-left">
            Get better view of your activities and manage your nazims in an easy
            way. Report your activities here.
          </p>
        </div>
      </div>
      <div className="w-full p-6 m-auto lg:max-w-lg">
        <div className="w-full flex items-center justify-center">
          <img src="/logo.png" className="h-[104px] w-[142px]" alt="LOGO" />
        </div>
        <form
          className="space-y-4 bg-white rounded-md shadow-md p-4"
          onSubmit={handleReset}
        >
          <div>
            <label className="label">
              <span className="text-heading font-inter text-[14px] leading-5">
                Password
              </span>
            </label>
            <input
              type="password"
              name="passwrod1"
              placeholder="Password"
              className="w-full focus:border-innerAlignment text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
              onChange={handlePasswordChange}
              value={password}
            />
          </div>
          <div className="flex flex-col gap-1 ml-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="minLength"
                id="minLength"
                className="custom-radio"
                checked={hasMinLength}
                readOnly
              />
              <span
                className={hasMinLength ? "text-green-800" : "text-destructive"}
              >
                8 characters
              </span>
            </div>
          </div>
          <div>
            <label className="label">
              <span className="text-heading font-inter text-[14px] leading-5">
                Confirm Password
              </span>
            </label>
            <input
              type="password"
              name="passwrod2"
              placeholder="Confirm Password"
              className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
            />
          </div>

          <div>
            <button
              disabled={loading}
              className="text-[14px] leading-6 font-medium font-inter text-white bg-primary w-full py-2 border rounded"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
      </div>
      {loading && <Loader />}
    </div>
  );
};
