import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { Forget } from "./pages/Forget";
import { Dashboard } from "./pages/Dashboard";
import { ChangePassword } from "./pages/ChangePassword";
import { Toast } from "./components/Toast";
import { Comparision } from "./pages/Comparision";
import { ReportChart } from "./components/ReportChart";
import { Signup } from "./pages/Signup";
import { Reports } from "./pages/Reports";
import {
  DeleteUser,
  Division,
  EditProfile,
  Halqa,
  Ilaqa,
  LoadingScreen,
  Locations,
  Maqam,
  PersonalReportsDashboard,
  Province,
} from "./pages";
import { useEffect, useRef, useState } from "react";
import instance from "./api/instrance";
import {
  CompileReportContext,
  DistrictContext,
  DivisionContext,
  DivisionReportContext,
  HalqaContext,
  HalqaReportContext,
  HalqaReportTabContext,
  IlaqaContext,
  IlaqaReportContext,
  IsMuntakhib,
  MaqamContext,
  MaqamReportContext,
  MarkazReportContext,
  MeContext,
  ProvinceContext,
  ProvinceReportContext,
  TehsilContext,
  ViewDetails,
  useToastState,
} from "./context";
import { UIContext } from "./context/ui";
import { DoubleScrollLeftRefresh, Loader, ReportUmeedwar } from "./components";
import { ArkanReport } from "./pages/ArkanReport";
import { ProvinceReport } from "./pages/ProvinceReport";
import { DivisionReport } from "./pages/DivisionReport";
import { HalqaReport } from "./pages/HalqaReport";
import { ResetPassword } from "./pages/ResetPassword";
import { MuntakhibMaqamReports } from "./pages/MuntakhibMaqamReports";
import { MarkazReport } from "./pages/MarkazReport";
import { IlaqaReport } from "./pages/IlaqaReport";
import { MuntakhibMaqamReport } from "./pages/MuntakhibMaqamReport";
import { MaqamReport } from "./pages/MaqamReport";
import { MarkazReportPrint } from "./pages/MarkazReportPrint";
import { Page404 } from "./pages/PageNotFound/Page404";
import { Compile } from "./pages/Compilaton/Compile";
import { CompileReports, MaqamCompile, Markaz } from "./pages/Compilaton";
import { HalqaCompileReport } from "./pages/Compilaton/HalqaCompileReport";
import { IlaqaCompileReport } from "./pages/Compilaton/IlaqaCompileReport";
import { DivisionCompileReport } from "./pages/Compilaton/DivisionCompileReport";
import { ProvinceReportCompile } from "./pages/Compilaton/ProvinceReportCompile";
import { MarkazReportCompilePrint } from "./pages/Compilaton/MarkazReportCompilePrint";
import { MuntakhibMaqamCompileReport } from "./pages/Compilaton/MuntakhibMaqamCompileReport";
// import { SpiderChart } from "./pages/SpiderChart";

function App() {
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState(null);
  const { dispatch } = useToastState();
  const [provinces, setProvinces] = useState([]);
  const [maqams, setMaqams] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [halqas, setHalqas] = useState([]);
  const [ilaqas, setIlaqas] = useState([]);
  const [nazim, setNazim] = useState([]);
  const [markazReport, setMarkazReport] = useState([]);
  const [provinceReports, setProvinceReports] = useState([]);
  const [maqamReports, setMaqamReports] = useState([]);
  const [ilaqaReports, setIlaqaReports] = useState([]);
  const [divisionReports, setDivisionReports] = useState([]);
  const [halqaReports, setHalqaReports] = useState({ reports: [], length: 0 });
  const [halqaReportsTab, setHalqaReportsTab] = useState({
    reports: [],
    length: 0,
  });

  const [userRequests, setUserRequests] = useState([]);
  const [value, setValue] = useState(null);
  const [active, setActive] = useState("province");
  const [count, setCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(true);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [reports, setReports] = useState([]);
  const [muntakhibMaqam, setMuntakhibMaqam] = useState(false);
  const [areaDetails, setAreaDetails] = useState({});
  const [compileReports, setCompileReports] = useState({});
  const location = useLocation();
  let r = [];
  const [authenticated, setAuthenticaated] = useState(
    localStorage.getItem("@token")
  );
  let length;
  let dis;
  // const data2023 = [
  //   1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 34, 4, 35, 5, 44, 12, 43, 42, 43, 41,
  //   43, 4, 45, 34, 6, 14, 24, 26,
  // ];
  // const data2024 = [
  //   3, 5, 2, 8, 14, 22, 11, 5, 8, 13, 14, 19, 22, 25, 14, 12, 9, 11, 15, 18, 17,
  //   14, 12, 10, 11, 14, 16, 19, 23, 25,
  // ];
  // const labels = [
  //   "A",
  //   "B",
  //   "C",
  //   "D",
  //   "E",
  //   "F",
  //   "G",
  //   "H",
  //   "I",
  //   "J",
  //   "K",
  //   "L",
  //   "M",
  //   "N",
  //   "O",
  //   "P",
  //   "Q",
  //   "R",
  //   "S",
  //   "T",
  //   "U",
  //   "V",
  //   "W",
  //   "X",
  //   "Y",
  //   "Z",
  //   "AA",
  //   "BB",
  //   "CC",
  //   "DD",
  // ];
  const getMe = async () => {
    try {
      sessionStorage.removeItem("storedData");
      setValue("Fetching user info");
      const req = await instance.get("/user/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("@token")}` },
      });
      if (req) {
        const meData = req.data.data;
        [
          "email",
          "fatherName",
          "name",
          "age",
          "dob",
          "address",
          "qualification",
          "subject",
          "semester",
          "institution",
          "phoneNumber",
          "whatsAppNumber",
        ].forEach((i) => {
          if (!meData?.[i]) {
            setIsCompleted(true);
          }
        });
        if (isCompleted) {
          if (
            req?.data?.data?.isDeleted ||
            req?.data?.data?.userAreaId?.disabled
          ) {
            alert(
              "Your account will be logged out as admin has updated your rights"
            );
            localStorage.clear();
            navigate("/login");
          }
          if (
            localStorage?.getItem("@nazimType") &&
            localStorage?.getItem("@type")
          ) {
            if (
              localStorage?.getItem("@nazimType") !==
                req?.data?.data?.nazimType ||
              localStorage?.getItem("@type") !== req?.data?.data?.nazim
            ) {
              alert(
                "Your account will be logged out as admin has updated your rights"
              );
              localStorage.clear();
              navigate("/login");
            }
          }
          setMe(req.data.data);
        } else {
          setIsCompleted(true);
        }
      }
    } catch (err) {
      console.log(err);
      localStorage.removeItem("@token");
      window.location.reload();
      dispatch({
        type: "ERROR",
        payload: err?.response?.data?.message || err?.message,
      });
    }
  };
  const getProvinces = async () => {
    if (me?.userAreaType === "Province") {
      try {
        setLoading(true);

        const req = await instance.get(
          `/locations/province/${me?.userAreaId?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          }
        );
        if (req) {
          setProvinces([req.data?.data]);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);

        console.log(err);
        dispatch({
          type: "ERROR",
          payload: err?.response?.data?.message || err?.message,
        });
      }
    } else {
      if (me?.userAreaType === "Country") {
        try {
          setLoading(true);
          const req = await instance.get(`/locations/province`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          });
          if (req) {
            setProvinces(req.data?.data);
            setLoading(false);
          }
        } catch (err) {
          console.log(err);
          setLoading(false);
          dispatch({
            type: "ERROR",
            payload: err?.response?.data?.message || err?.message,
          });
        }
      }
    }
  };
  const getIlaqas = async () => {
    if (me?.userAreaType !== "Halqa" && me?.userAreaType !== "Division") {
      try {
        setLoading(true);
        let req;
        if (me?.userAreaType === "Ilaqa") {
          req = await instance.get(`/locations/ilaqa/${me?.userAreaId?._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          });
          if (req) {
            setLoading(false);

            setIlaqas([req?.data?.data]);
          } else {
            setLoading(false);

            dispatch({
              type: "ERROR",
              payload: req?.response?.data?.message,
            });
          }
        } else {
          setLoading(true);
          req = await instance.get("/locations/ilaqa", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          });
          if (req?.data?.data.length > 1) {
            setIlaqas(req?.data?.data);
            setLoading(false);
          } else {
            setLoading(false);
            dispatch({
              type: "ERROR",
              payload: req?.response?.data?.message,
            });
          }
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        dispatch({
          type: "ERROR",
          payload: err?.response?.data?.message || err?.message,
        });
      }
    } else {
      return;
    }
  };
  const getMaqams = async () => {
    if (
      me?.userAreaType !== "Halqa" &&
      me?.userAreaType !== "Division" &&
      me?.userAreaType !== "Ilaqa"
    ) {
      try {
        setLoading(true);

        let req;
        if (me?.userAreaType === "Maqam") {
          req = await instance.get(`/locations/maqam/${me?.userAreaId?._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          });
          if (req) {
            setMaqams([req?.data?.data]);
            setLoading(false);
          }
        } else {
          setLoading(true);
          req = await instance.get("/locations/maqam", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          });
          setMaqams(req?.data?.data);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        dispatch({
          type: "ERROR",
          payload: err?.response?.data?.message || err?.message,
        });
      }
    } else {
      return;
    }
  };
  const getDivisions = async () => {
    if (
      me?.userAreaType !== "Halqa" &&
      me?.userAreaType !== "Maqam" &&
      me?.userAreaType !== "Ilaqa"
    ) {
      let req;
      try {
        setLoading(true);
        if (me?.userAreaType === "Province" || me?.userAreaType === "Country") {
          req = await instance.get("/locations/division", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          });
          if (req) {
            setDivisions(req?.data?.data);
            setLoading(false);
          } else {
            setLoading(false);

            dispatch({
              type: "ERROR",
              payload: req?.response?.data?.message,
            });
          }
        } else if (me?.userAreaType === "Division") {
          setLoading(true);
          req = await instance.get(
            `/locations/division/${me?.userAreaId?._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("@token")}`,
              },
            }
          );
          if (req) {
            setDivisions([req?.data?.data]);
            setLoading(false);
          } else {
            setLoading(false);
            dispatch({
              type: "ERROR",
              payload: req?.response?.data?.message,
            });
          }
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        dispatch({
          type: "ERROR",
          payload: err?.response?.data?.message || err?.message,
        });
      }
    } else {
      return;
    }
  };
  const getTehsils = async () => {
    if (
      me?.userAreaType !== "Halqa" &&
      me?.userAreaType !== "Maqam" &&
      me?.userAreaType !== "Ilaqa"
    ) {
      try {
        setLoading(true);
        const req = await instance.get("/locations/tehsil", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        });
        if (req) {
          const allData = req.data.data;
          const validTehsils = allData.filter(
            (i) =>
              i?.district?.division?._id === me?.userAreaId?._id ||
              i?.district?.division?.province?._id === me?.userAreaId?._id ||
              i?.district?.division?.province?.country === me?.userAreaId?._id
          );
          setLoading(false);
          setTehsils(validTehsils);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        dispatch({
          type: "ERROR",
          payload: err?.response?.data?.message || err?.message,
        });
      }
    } else {
      return;
    }
  };
  const getDistricts = async () => {
    if (
      me?.userAreaType !== "Halqa" &&
      me?.userAreaType !== "Maqam" &&
      me?.userAreaType !== "Ilaqa"
    ) {
      try {
        setLoading(true);
        const req = await instance.get("/locations/district", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        });
        if (req) {
          const allData = req.data.data;
          const validDistricts = allData.filter(
            (i) =>
              i?.division?._id === me?.userAreaId?._id ||
              i?.division?.province?._id === me?.userAreaId?._id ||
              i?.division?.province?.country === me?.userAreaId?._id
          );
          setDistricts(validDistricts);
          setLoading(false);
          dis = validDistricts;
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        dispatch({
          type: "ERROR",
          payload: err?.response?.data?.message || err?.message,
        });
      }
    } else {
      return;
    }
  };
  const getHalqas = async () => {
    try {
      let req;
      if (me && me?.userAreaType === "Halqa") {
        setLoading(true);

        req = await instance.get(`/locations/halqa/${me?.userAreaId?._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        });
        if (req) {
          setHalqas([req?.data?.data]);
          setLoading(false);
        } else {
          setLoading(false);
          dispatch({
            type: "ERROR",
            payload: req?.response?.data?.message,
          });
        }
      } else {
        if (me && me.userAreaType !== "Halqa") {
          setLoading(true);
          req = await instance.get("/locations/halqa", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          });
          if (req) {
            setHalqas(req?.data?.data);
            setLoading(false);
          }
        }
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      dispatch({
        type: "ERROR",
        payload: err?.response?.data?.message || err?.message,
      });
    }
  };
  const filterMuntakhib = (id) => {
    const mT = ilaqas.filter((ilaqa) => ilaqa?.maqam?._id == id);
    if (mT?.length > 0) {
      setMuntakhibMaqam(true);
    } else {
      setMuntakhibMaqam(false);
    }
  };
  useEffect(() => {}, [muntakhibMaqam]);
  let provinceR, maqamR, divisionR, halqaR, ilaqaR, markazR, halqaT;
  const getMarkazReport = async (inset, offset) => {
    if (me?.userAreaType === "Country")
      try {
        setLoading(true);
        const req = await instance.get(
          `/reports/markaz?inset=${inset}&offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          }
        );
        if (req) {
          markazR = req.data?.data?.data;
          let length = req?.data?.data?.length;
          setMarkazReport((prevData) => {
            const reports = Array.isArray(prevData.reports)
              ? prevData.reports
              : [];
            const newReports = Array.isArray(markazR) ? markazR : [];

            return {
              reports: [...reports, ...newReports],
              length: length,
            };
          });
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        dispatch({
          type: "ERROR",
          payload: err?.response?.data?.message || err?.message,
        });
      }
    return;
  };
  const getProvinceReports = async (inset, offset) => {
    if (me?.userAreaType === "Country" || me?.userAreaType === "Province")
      try {
        setLoading(true);
        const req = await instance.get(
          `/reports/province?inset=${inset}&offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          }
        );
        if (req) {
          provinceR = req.data?.data?.data;
          let length = req?.data?.data?.length;
          setProvinceReports((prevData) => {
            const reports = Array.isArray(prevData.reports)
              ? prevData.reports
              : [];
            const newReports = Array.isArray(provinceR) ? provinceR : [];

            return {
              reports: [...reports, ...newReports],
              length: length,
            };
          });
          setLoading(false);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        dispatch({
          type: "ERROR",
          payload: err?.response?.data?.message || err?.message,
        });
      }
    return;
  };
  const getMaqamReports = async (inset, offset) => {
    if (
      me?.userAreaType === "Country" ||
      me?.userAreaType === "Province" ||
      me?.userAreaType === "Maqam"
    )
      try {
        setLoading(true);
        const req = await instance.get(
          `/reports/maqam?inset=${inset}&offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          }
        );
        if (req) {
          maqamR = req.data.data?.data;
          let length = req?.data?.data?.length;
          setMaqamReports((prevData) => {
            const reports = Array.isArray(prevData.reports)
              ? prevData.reports
              : [];
            const newReports = Array.isArray(maqamR) ? maqamR : [];

            return {
              reports: [...reports, ...newReports],
              length: length,
            };
          });
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        dispatch({
          type: "ERROR",
          payload: err?.response?.data?.message || err?.message,
        });
      }
    return;
  };
  const getIlaqaReports = async (inset, offset) => {
    if (me?.userAreaType !== "Halqa" && me?.userAreaType !== "Division")
      try {
        setLoading(true);
        const req = await instance.get(
          `/reports/ilaqa?inset=${inset}&offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          }
        );
        if (req) {
          ilaqaR = req.data.data?.data;
          let length = req?.data?.data?.length;
          setIlaqaReports((prevData) => {
            const reports = Array.isArray(prevData.reports)
              ? prevData.reports
              : [];
            const newReports = Array.isArray(ilaqaR) ? ilaqaR : [];

            return {
              reports: [...reports, ...newReports],
              length: length,
            };
          });
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        dispatch({
          type: "ERROR",
          payload: err?.response?.data?.message || err?.message,
        });
      }
    return;
  };
  const getDivisionReports = async (inset, offset) => {
    if (
      me?.userAreaType === "Country" ||
      me?.userAreaType === "Province" ||
      me?.userAreaType === "Division"
    )
      try {
        setLoading(true);
        const req = await instance.get(
          `/reports/division?inset=${inset}&offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          }
        );
        if (req) {
          divisionR = req.data.data.data;
          let length = req?.data?.data?.length;
          setDivisionReports((prevData) => {
            const reports = Array.isArray(prevData.reports)
              ? prevData.reports
              : [];
            const newReports = Array.isArray(divisionR) ? divisionR : [];

            return {
              reports: [...reports, ...newReports],
              length: length,
            };
          });
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        dispatch({
          type: "ERROR",
          payload: err?.response?.data?.message || err?.message,
        });
      }
    return;
  };
  const getHalqaReports = async (inset, offset) => {
    try {
      setLoading(true);
      const req = await instance.get(
        `/reports/halqa?inset=${inset}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        }
      );
      if (req) {
        halqaR = req.data.data?.data;
        let length = req?.data?.data?.length;
        setHalqaReports((prevData) => {
          const reports = Array.isArray(prevData.reports)
            ? prevData.reports
            : [];
          const newReports = Array.isArray(halqaR) ? halqaR : [];

          return {
            reports: [...reports, ...newReports],
            length: length,
          };
        });
        setLoading(false);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      dispatch({
        type: "ERROR",
        payload: err?.response?.data?.message || err?.message,
      });
    }
  };
  const getHalqaReportsTab = async (inset, offset, tab) => {
    if (tab) {
      try {
        setLoading(true);
        const req = await instance.get(
          `/reports/halqa?inset=${inset}&offset=${offset}&tab=${tab}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          }
        );
        if (req) {
          halqaT = req.data.data;
          let length = req?.data?.data?.length;
          setHalqaReportsTab((prevData) => {
            const reports = Array.isArray(prevData.reports)
              ? prevData.reports
              : [];
            const newReports = Array.isArray(halqaT) ? halqaT : [];

            return {
              reports: [...reports, ...newReports],
              length: length,
            };
          });
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        dispatch({
          type: "ERROR",
          payload: err?.response?.data?.message || err?.message,
        });
      }
    }
  };

  const getNazim = async () => {
    try {
      setLoading(true);
      const req = await instance.get("/user/nazim", {
        headers: { Authorization: `Bearer ${localStorage.getItem("@token")}` },
      });
      if (req) setNazim(req?.data?.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      dispatch({
        type: "ERROR",
        payload: err?.response?.data?.message || err?.message,
      });
      console.log(err);
    }
  };
  const getAllRequests = async () => {
    if (localStorage.getItem("@token") && me?.userAreaType !== "Halqa") {
      try {
        const req = await instance.get("/user/user-requests", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        });
        setUserRequests(req.data?.data);
      } catch (err) {
        console.log(err);
        dispatch({
          type: "ERROR",
          payload: err?.response?.data?.message || err?.message,
        });
      }
    }
  };

  // NOTiFICATIONS CODE
  const getAllReports = async () => {
    if (
      localStorage.getItem("@token") &&
      localStorage.getItem("@type") !== "country"
    ) {
      try {
        let req;
        switch (localStorage.getItem("@type")) {
          case "country":
            req = markazR;
            break;
          case "province":
            req = provinceR;
            break;
          case "maqam":
            req = maqamR;
            break;
          case "ilaqa":
            req = ilaqaR;
            break;
          case "division":
            req = divisionR;
            break;
          case "halqa":
            req = halqaR;
            break;
          default:
            req = [];
            break;
        }
        r = req;
        setReports(req);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const getAllNotifications = async () => {
    if (localStorage.getItem("@token") && me?.userAreaType !== "Halqa") {
      try {
        const req = await instance.get(
          "/notifications?type=" + localStorage.getItem("@type").toLowerCase(),
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          }
        );
        setNotifications(
          req.data?.data.filter((i) => {
            const months = r?.map((_) =>
              _.month.split("-").slice(0, 2).join("-")
            );
            return !months?.includes(
              i?.createdAt.split("-").slice(0, 2).join("-")
            );
          })
        );
      } catch (err) {
        console.log(err);
      }
    }
  };
  const getAreaDetails = async (obj) => {
    const getPath = (parentId) => {
      switch (parentId) {
        case "Ilaqa":
          return "halqa";

        case "Maqam":
          return "halqa";

        case "Division":
          return "halqa";

        case "Tehsil":
          return "halqa";

        case "halqa":
          return "halqa";

        default:
          return "invalid path";
      }
    };
    let res;
    try {
      if (obj?.parentType) {
        res = await instance.get(
          `/locations/${getPath(obj?.parentType)}/${obj?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          }
        );
      } else if (!obj?.parentType && obj?.maqam) {
        res = await instance.get(`/locations/ilaqa/${obj?._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        });
      } else if (!obj?.parentType && obj?.country) {
        res = await instance.get(`/locations/province/${obj?._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        });
      } else {
        res = await instance.get(`/locations/maqam/${obj?._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        });
      }
      if (res) {
        setAreaDetails(res?.data?.data);
      } else {
        setAreaDetails(obj);
      }
    } catch (error) {
      console.log(error);
    }

    document.getElementById("area_details").showModal();
  };
  const getCompileReports = async (startDate, endDate, areaType, areaId) => {
    try {
      setLoading(true);
      const req = await instance.get(
        `/compilation/${areaId}?startDate=${startDate}&endDate=${endDate}&areaType=${areaType}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        }
      );

      if (req) {
        setCompileReports(req.data.data);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      dispatch({
        type: "ERROR",
        payload: err?.response?.data?.message || err?.message,
      });
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (me) {
        getAllRequests();
        getAllReports();
      }
    }, 5000); // 5000 milliseconds = 5 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (reports?.length > 0) getAllNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports]);

  // NOTiFICATIONS CODE END
  const hasMounted = useRef(false);
  useEffect(() => {
    if (!hasMounted.current) {
      if (authenticated) {
        getMe();
        hasMounted.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);
  useEffect(() => {
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const fetchData = async () => {
      setCount((100 / 16) * 1);
      setValue("Fetching provinces");
      await getProvinces();
      setCount((100 / 16) * 2);
      setValue("Fetching maqams");
      await getMaqams();
      setCount((100 / 16) * 3);
      setValue("Fetching Ilaqas");
      await getIlaqas();
      setCount((100 / 16) * 4);
      setValue("Fetching divisions");
      await getDivisions();
      setCount((100 / 16) * 5);
      setValue("Fetching districts");
      await getDistricts();
      setCount((100 / 16) * 6);
      setValue("Fetching tehsils");
      await getTehsils();
      setCount((100 / 16) * 7);
      setValue("Fetching halqas");
      await getHalqas();
      setCount((100 / 16) * 13);
      setValue(null);
      await getNazim();
      setCount((100 / 16) * 14);
      setValue("Fetching user requests");
      await getAllRequests();
      setCount((100 / 16) * 15);
      setValue(null);
      setValue("Fetching all notifications");
      await getAllNotifications();
      setCount((100 / 16) * 16);
      setValue(null);

      if (
        location.pathname?.split("/")[2] === "view" ||
        location.pathname?.split("/")[2] === "edit"
      ) {
        navigate("/reports");
      } else if (
        location.pathname?.includes("reports") ||
        location.pathname?.includes("user-switch") ||
        location.pathname?.includes("locations")
      ) {
        navigate("/");
      }
    };
    if (me) {
      fetchData();
      setActive(localStorage.getItem("@type"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);
  useEffect(() => {
    if (me) {
      if (!isCompleted) {
        dispatch({ type: "ERROR", payload: "Please complete your profile." });
        navigate("/profile");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, isCompleted, navigate]);

  return (
    <MeContext.Provider value={me}>
      <DoubleScrollLeftRefresh />
      <MarkazReportContext.Provider value={markazReport}>
        <ProvinceContext.Provider value={provinces}>
          <ProvinceReportContext.Provider value={provinceReports}>
            <MaqamContext.Provider value={maqams}>
              <MaqamReportContext.Provider value={maqamReports}>
                <IlaqaContext.Provider value={ilaqas}>
                  <DivisionContext.Provider value={divisions}>
                    <DivisionReportContext.Provider value={divisionReports}>
                      <DistrictContext.Provider value={districts}>
                        <TehsilContext.Provider value={tehsils}>
                          <HalqaContext.Provider value={halqas}>
                            <IlaqaReportContext.Provider value={ilaqaReports}>
                              <HalqaReportContext.Provider value={halqaReports}>
                                <HalqaReportTabContext.Provider
                                  value={halqaReportsTab}
                                >
                                  <CompileReportContext.Provider
                                    value={compileReports}
                                  >
                                    <ViewDetails.Provider value={areaDetails}>
                                      <IsMuntakhib.Provider
                                        value={muntakhibMaqam}
                                      >
                                        <UIContext.Provider
                                          value={{
                                            userRequests,
                                            nazim,
                                            loading,
                                            notifications,
                                            reports,
                                            active,
                                            isCompleted,
                                            setLoading,
                                            getMe,
                                            getProvinces,
                                            getMaqams,
                                            getDivisions,
                                            getCompileReports,
                                            getDistricts,
                                            getTehsils,
                                            getHalqas,
                                            getIlaqas,
                                            getMarkazReport,
                                            getProvinceReports,
                                            getMaqamReports,
                                            getIlaqaReports,
                                            getDivisionReports,
                                            getHalqaReports,
                                            getAllRequests,
                                            getHalqaReportsTab,
                                            setReports,
                                            getAllNotifications,
                                            getNazim,
                                            setActive,
                                            setMe,
                                            getAreaDetails,
                                            filterMuntakhib,
                                          }}
                                        >
                                          <div className="flex flex-col">
                                            <Routes>
                                              <Route
                                                path="/signup"
                                                element={<Signup />}
                                              />
                                              <Route
                                                path="/login"
                                                element={
                                                  <Login
                                                    setAuthenticated={
                                                      setAuthenticaated
                                                    }
                                                  />
                                                }
                                              />
                                              <Route
                                                path="/"
                                                element={<Dashboard />}
                                              />
                                              <Route
                                                path="/reset-password"
                                                element={<Forget />}
                                              />
                                              <Route
                                                path="/reset"
                                                element={<ResetPassword />}
                                              />
                                              <Route
                                                path="change-password"
                                                element={<ChangePassword />}
                                              />
                                              <Route
                                                path="/comparison"
                                                element={<Comparision />}
                                              />
                                              <Route
                                                path="/chart"
                                                element={<ReportChart />}
                                              />
                                              <Route
                                                path="/reports"
                                                element={
                                                  <Reports
                                                    maqam={muntakhibMaqam}
                                                  />
                                                }
                                              />
                                              <Route
                                                path="/personalReport"
                                                element={
                                                  <PersonalReportsDashboard />
                                                }
                                              />
                                              <Route
                                                path="/reports/create"
                                                element={
                                                  localStorage.getItem(
                                                    "@type"
                                                  ) === "maqam" ? (
                                                    muntakhibMaqam ? (
                                                      <MuntakhibMaqamReports />
                                                    ) : (
                                                      <Maqam />
                                                    )
                                                  ) : localStorage.getItem(
                                                      "@type"
                                                    ) === "division" ? (
                                                    <Division />
                                                  ) : localStorage.getItem(
                                                      "@type"
                                                    ) === "province" ? (
                                                    <Province />
                                                  ) : localStorage.getItem(
                                                      "@type"
                                                    ) === "ilaqa" ? (
                                                    <Ilaqa />
                                                  ) : localStorage.getItem(
                                                      "@type"
                                                    ) === "country" ? (
                                                    <MarkazReport />
                                                  ) : (
                                                    <Halqa />
                                                  )
                                                }
                                              />
                                              <Route
                                                path="/reports/edit/:id"
                                                element={
                                                  localStorage.getItem(
                                                    "@type"
                                                  ) === "maqam" ? (
                                                    muntakhibMaqam ? (
                                                      <MuntakhibMaqamReports />
                                                    ) : (
                                                      <Maqam />
                                                    )
                                                  ) : localStorage.getItem(
                                                      "@type"
                                                    ) === "ilaqa" ? (
                                                    <Ilaqa />
                                                  ) : localStorage.getItem(
                                                      "@type"
                                                    ) === "division" ? (
                                                    <Division />
                                                  ) : localStorage.getItem(
                                                      "@type"
                                                    ) === "province" ? (
                                                    <Province />
                                                  ) : localStorage.getItem(
                                                      "@type"
                                                    ) === "country" ? (
                                                    <MarkazReport />
                                                  ) : (
                                                    <Halqa />
                                                  )
                                                }
                                              />

                                              <Route
                                                path={"/reports/view/:id"}
                                                element={
                                                  active === "maqam" ? (
                                                    muntakhibMaqam ? (
                                                      <MuntakhibMaqamReports />
                                                    ) : (
                                                      <Maqam />
                                                    )
                                                  ) : active === "ilaqa" ? (
                                                    <Ilaqa />
                                                  ) : active === "division" ? (
                                                    <Division />
                                                  ) : active === "province" ? (
                                                    <Province />
                                                  ) : active === "country" ? (
                                                    <MarkazReport />
                                                  ) : (
                                                    <Halqa />
                                                  )
                                                }
                                              />
                                              <Route
                                                path="/profile"
                                                element={<EditProfile />}
                                              />
                                              <Route
                                                path="/locations"
                                                element={<Locations />}
                                              />
                                              <Route
                                                path="/user-switch"
                                                element={<DeleteUser />}
                                              />

                                              <Route
                                                path="/personalReport/create"
                                                element={<ReportUmeedwar />}
                                              />
                                              <Route
                                                path="/personalReport/view/:id"
                                                element={<ReportUmeedwar />}
                                              />
                                              <Route
                                                path="/personalReport/edit/:id"
                                                element={<ReportUmeedwar />}
                                              />
                                              <Route
                                                path="/personalReport/print/:id"
                                                element={<ArkanReport />}
                                              />
                                              <Route
                                                path="/province-report/print/:id"
                                                element={<ProvinceReport />}
                                              />
                                              <Route
                                                path="/province-report-compile/print"
                                                element={
                                                  <ProvinceReportCompile />
                                                }
                                              />
                                              <Route
                                                path="/division-report/print/:id"
                                                element={<DivisionReport />}
                                              />
                                              <Route
                                                path="/division-report-compile/print/"
                                                element={
                                                  <DivisionCompileReport />
                                                }
                                              />
                                              <Route
                                                path="/ilaqa-report/print/:id"
                                                element={<IlaqaReport />}
                                              />
                                              <Route
                                                path="/ilaqa-report-compile/print"
                                                element={<IlaqaCompileReport />}
                                              />
                                              <Route
                                                path="*"
                                                element={<Page404 />}
                                              />
                                              <Route
                                                path="/maqam-report/print/:id"
                                                element={<MaqamReport />}
                                              />
                                              <Route
                                                path="/maqam-report-compile/print/"
                                                element={
                                                  <MuntakhibMaqamCompileReport />
                                                }
                                              />
                                              <Route
                                                path="/compile/view"
                                                element={<CompileReports />}
                                              />
                                              <Route
                                                path="/muntakhib-maqam-report/print/:id"
                                                element={
                                                  <MuntakhibMaqamReport />
                                                }
                                              />
                                              <Route
                                                path="/halqa-report/print/:id"
                                                element={<HalqaReport />}
                                              />
                                              <Route
                                                path="/halqa-report-compile/print"
                                                element={<HalqaCompileReport />}
                                              />

                                              <Route
                                                path="/markaz-report/print/:id"
                                                element={<MarkazReportPrint />}
                                              />
                                              <Route
                                                path="/markaz-report-compile/print"
                                                element={
                                                  <MarkazReportCompilePrint />
                                                }
                                              />
                                              <Route
                                                path="/compilation"
                                                element={<Compile />}
                                              />
                                              {/* <Route
                                              path="/spider"
                                              element={
                                                <SpiderChart
                                                  data2023={data2023}
                                                  data2024={data2024}
                                                  labels={labels}
                                                />
                                              }
                                            /> */}
                                   
                                            </Routes>
                                            <LoadingScreen
                                              count={count}
                                              value={value}
                                            />
                                            {loading && <Loader />}
                                            <Toast />
                                          </div>
                                        </UIContext.Provider>
                                      </IsMuntakhib.Provider>
                                    </ViewDetails.Provider>
                                  </CompileReportContext.Provider>
                                </HalqaReportTabContext.Provider>
                              </HalqaReportContext.Provider>
                            </IlaqaReportContext.Provider>
                          </HalqaContext.Provider>
                        </TehsilContext.Provider>
                      </DistrictContext.Provider>
                    </DivisionReportContext.Provider>
                  </DivisionContext.Provider>
                </IlaqaContext.Provider>
              </MaqamReportContext.Provider>
            </MaqamContext.Provider>
          </ProvinceReportContext.Provider>
        </ProvinceContext.Provider>
      </MarkazReportContext.Provider>
    </MeContext.Provider>
  );
}

export default App;
