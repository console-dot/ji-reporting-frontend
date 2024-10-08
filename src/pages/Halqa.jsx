import { useContext, useEffect, useState } from "react";
import instance from "../api/instrance";
import {
  Activity,
  GeneralInfo,
  GeneralLayout,
  IfradiKuwat,
  Library,
  OtherActivities,
  RozOShabDiary,
  ToseeDawat,
  calcultate,
} from "../components";
import { MeContext, useToastState } from "../context";
import { convertDataFormat, reverseDataFormat, toJson } from "../utils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { UIContext } from "../context/ui";
import { Baitulmal } from "../components/halqa/Baitulmal";
import { RxCross1 } from "react-icons/rx";
export const Halqa = () => {
  const { dispatch } = useToastState();
  const me = useContext(MeContext);
  const [id, setId] = useState(null);
  const [view, setView] = useState(false);
  const [data, setData] = useState({});
  const { setLoading } = useContext(UIContext);
  const location = useLocation();
  const { getHalqaReports } = useContext(UIContext);
  const params = useParams();
  let navigate = useNavigate();
  useEffect(() => {
    const l = location.pathname?.split("/")[2];
    setId(params?.id);
    if (l === "view" && id) {
      setView(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jsonData = convertDataFormat(toJson(formData));
    setLoading(true);
    try {
      if (id) {
        jsonData.month = data?.month;
        const req = await instance.put(`/reports/halqa/${id}`, jsonData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        });
        dispatch({ type: "SUCCESS", payload: req?.data?.message });
        navigate("/reports");
      } else {
        const req = await instance.post("/reports/halqa", jsonData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        });
        await getHalqaReports(0, 10);
        dispatch({ type: "SUCCESS", payload: req.data?.message });
        navigate("/reports");
      }
      e.target.reset();
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.response.data.message });
      // navigate('/reports');
    }
    setLoading(false);
  };

  const autoFill = () => {
    setLoading(true);
    Object.keys(data).forEach((i) => {
      const elem = document.getElementById(i);
      if (elem) {
        if (i === "month") {
          elem.value = data[i]?.split("")?.slice(0, 7)?.join("");
        } else {
          if (elem.type === "checkbox") {
            elem.defaultChecked = data[i] ? true : false;
          } else {
            elem.value = data[i] || 0;
          }
        }
      }
    });
    const afd = ["arkan", "umeedWaran", "rafaqa", "karkunan"];
    afd.forEach((i) => {
      calcultate(i);
    });
    setLoading(false);
  };
  useEffect(() => {
    autoFill();
  }, [data]);
  const getHalqaReport = async () => {
    setLoading(true);
    try {
      const req = await instance.get(`/reports/halqa/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
          "Content-Type": "application/json",
        },
      });
      const repo = req?.data?.data;
      document.getElementById("name").value = repo?.halqaAreaId?.name;
      setData(reverseDataFormat(repo));
      dispatch({ type: "SUCCESS", payload: req.data?.message });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.response?.data?.message });
    }
    setLoading(false);
  };
  useEffect(() => {
    setId(params?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  useEffect(() => {
    const l = location.pathname?.split("/")[2];
    if ((l === "view" && id) || l === "edit") {
      if (id) {
        getHalqaReport();
      }
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="reports w-full overflow-y-scroll">
      <div>
        <button
          type="button"
          className="p-2"
          onClick={() => navigate("/reports")}
        >
          <RxCross1 />
        </button>
        <h2 className="mb-2 block w-full text-center text-md md:text-2xl p-3">
          کارکردگی رپورٹ براۓ حلقہ
        </h2>
      </div>
      <form
        className="flex flex-col justify-center items-center p-4 font-notoUrdu mb-5"
        onSubmit={handleReportSubmit}
        dir="rtl"
      >
        <div className="w-full">
          <div className="mb-4">
            <GeneralInfo
              me={me}
              area={"حلقہ"}
              newMonth={data?.month}
              view={view}
            />
          </div>
          <div className="mb-4">
            <IfradiKuwat view={view} />
          </div>
          <div className="mb-4">
            <Activity view={view} />
          </div>
          <div className="mb-4">
            <OtherActivities view={view} />
          </div>
          <div className="mb-4">
            <ToseeDawat view={view} />
          </div>
          <div className="mb-4">
            <Library view={view} />
          </div>
          <div className="mb-4">
            <Baitulmal view={view} />
          </div>
          <div className="mb-4">
            <RozOShabDiary view={view} />
          </div>
          <div className="w-full flex p-2">
            <label htmlFor="comments">تبصرہ</label>
            <input
              required
              type="text"
              name="comments"
              maxLength={150}
              className="border-b-2 border-dashed w-full"
              id="comments"
              readOnly={view}
            />
          </div>
          {!view && (
            <div className="w-full flex flex-col items-end gap-3 p-2">
              <div>
                <label htmlFor="nazim">نام ناظمِ:</label>
                <input
                  required
                  type="text"
                  className="border-b-2 border-dashed text-center"
                  id="nazim"
                  defaultValue={me?.name || ""}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
        {!view && (
          <button type="submit" className="btn">
            {id ? "UPDATE" : "Submit"}
          </button>
        )}
      </form>
    </div>
  );
};
