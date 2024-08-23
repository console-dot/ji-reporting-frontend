import { useEffect, useState, useMemo } from "react";
import { BottomNav } from "../BottomNav";
import { Navbar } from "./Navbar";
import { useNavigate } from "react-router-dom";

export const GeneralLayout = ({ children, active, title }) => {
  const navigate = useNavigate();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("@token");
    if (!token || token === "undefined" || token === "null") {
      navigate("/login");
    }
  }, [navigate]);

  const sidebarClasses = useMemo(
    () =>

      `md:w-[20%] ${
        isSideBarOpen ? "block w-[80%] z-50 absolute top-0 left-0" : "hidden"
      } md:block`,

    [isSideBarOpen]
  );
useEffect(()=>{setIsSideBarOpen(false)},[])
  return (
    <>
      <Navbar title={title} setIsSideBarOpen={setIsSideBarOpen} isSideBarOpen={isSideBarOpen} />
      <div className="flex w-full">
        <div className={sidebarClasses}>
          <BottomNav active={active} />
        </div>
        <div className={`md:w-[80%] w-[100%] overflow-hidden ${isSideBarOpen && 'opacity-50'}`}>{children}</div>
      </div>
    </>
  );
};
