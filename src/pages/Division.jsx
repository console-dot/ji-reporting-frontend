import React, { useContext } from "react";
import { GeneralLayout, Loader, GeneralInfo, calcultate } from "../components";
import { convertDataFormat, reverseDataFormat, toJson } from "../utils";
import instance from "../api/instrance";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  DivisionReportContext,
  HalqaContext,
  HalqaReportContext,
  MaqamReportContext,
  MeContext,
  useToastState,
} from "../context";
import { useEffect } from "react";
import { getData } from "./Maqam";
import { UIContext } from "../context/ui";
import { Tanzeem } from "../components/divisionReport/Tanzeem";
import { IfradiKuwat } from "../components/divisionReport/IfradiKuwat";
import { MarkaziActivities } from "../components/divisionReport/MarkaziActivities";

import { OtherActivities } from "../components/divisionReport/OtherActivities";
import { ToseeDawat } from "../components/divisionReport/ToseeDawat";
import { Library } from "../components/divisionReport/Library";
import { PaighamDigest } from "../components/divisionReport/PaighamDigest";
import { RozOShabDiary } from "../components/divisionReport/RozOShabDiary";
import { Jamiaat } from "../components/divisionReport/Jamiaat";
import { Colleges } from "../components/divisionReport/Colleges";
import { ZailiActivities } from "../components/divisionReport/ZailiActivities";
import { Baitulmal } from "../components/divisionReport/Baitulmal";
import { RxCross1 } from "react-icons/rx";
export const Division = () => {
  // EDIT CODE START
  const [createData, setCreateData] = useState();
  const [month, setMonth] = useState("");
  const params = useParams();
  const [id, setId] = useState(null);
  const { dispatch } = useToastState();
  const [data, setData] = useState({});
  const { loading, setLoading, getDivisionReports } = useContext(UIContext);
  const [view, setView] = useState(false);
  const location = useLocation();
  const halqas = useContext(HalqaContext);
  const me = useContext(MeContext);
  const navigate = useNavigate();
  const [page, setPage] = useState();
  useEffect(() => {
    const url = window.location.pathname.split("/")[2];
    setPage(url);
  }, [window.location]);
  const autoFill = () => {
    setLoading(true);
    const halq = {};

    document.getElementById("division-form").reset();

    createData?.forEach((i) => {
      const sim = reverseDataFormat(i);
      Object.keys(sim)?.forEach((j) => {
        if (halq?.[j]) {
          try {
            halq[j] += parseInt(sim[j]) || 0;
          } catch {
            halq[j] += sim[j] || 0;
          }
        } else {
          try {
            halq[j] = parseInt(sim[j]) || 0;
          } catch {
            halq[j] = sim[j] || 0;
          }
        }
      });
    });
    Object.keys(halq).forEach((i) => {
      let j;
      if (i === "studyCircle-decided") {
        j = "studyCircleMentioned-decided";
      } else if (i === "literatureDistribution") {
        j = "litrature";
      } else if (i === "studyCircle-completed") {
        j = "studyCircleMentioned-done";
      } else if (i === "studyCircle-attendance") {
        j = "studyCircleMentioned-averageAttendance";
      } else if (i === "currentSum") {
        j = "current";
      } else {
        if (i.split("-")[1] === "completed") {
          j = i.split("-")[0] + "-done";
        } else if (i.split("-")[1] === "attendance") {
          j = i.split("-")[0] + "-averageAttendance";
        } else if (i === "books") {
          j = "totalBooks";
        } else if (i === "bookRent") {
          j = "totalBookRent";
        } else if (i === "increase") {
          j = "totalIncrease";
        } else if (i === "decrease") {
          j = "totalDecrease";
        } else {
          j = i;
        }
      }
      halq.litrature = halq.literatureDistribution;

      const elem = document.getElementById(j);
      if (elem) {
        if (j === "month") {
        } else {
          if (elem.type === "checkbox") {
          }
          if (j.split("-")[1] === "attendance") {
            document.getElementById(
              `${j.split("-")[0]}-averageAttendance`
            ).value = halq[i];
          } else {
            if (i === "name" && !view) {
              elem.value = me?.userAreaId?.name;
            } else if (elem === "litrature") {
              elem.value = halq["literatureDistribution"];
            } else {
              elem.value = halq[i];
            }
          }
        }
      }
    });

    document.getElementById("studyCircle-averageAttendance").value = 0;
    document.getElementById("studyCircle-done").value = 0;
    if (!view) {
      document.getElementById("ijtRafaqa-decided").value = halqas.length;
      document.getElementById("ijtKarkunan-decided").value = halqas.length;
      document.getElementById("darseQuran-decided").value = halqas.length;
      document.getElementById("studyCircleMentioned-decided").value =
        halqas.length;
    }
    ["arkan", "umeedWaran"].forEach((i) => {
      document.getElementById(`${i}-start`).value = 0;
      document.getElementById(`${i}-end`).value = 0;
      document.getElementById(`${i}-increase`).value = 0;
      document.getElementById(`${i}-decrease`).value = 0;
      document.getElementById(`${i}-monthly`).value = 0;
    });
    [
      "paighamEvent",
      "shaheenMeeting",
      "darseQuran",
      "ijtKarkunan",
      "studyCircleMentioned",
      "ijtRafaqa",
    ]?.forEach((i) => {
      document.getElementById(`${i}-averageAttendance`).value = 0;
    });

    document.getElementById("karkunan-monthly").value = 0;
    document.getElementById("rafaqa-monthly").value = 0;
    document.getElementById("rawabitDecided").value = 0;
    document.getElementById("shabBedari").value = 0;
    if (page === "create") {
      [
        "litrature",
        "commonStudentMeetings",
        "commonLiteratureDistribution",
      ].map((i) => (document.getElementById(i).value = 0));
    }

    const afd = [
      "rehaishHalqay",
      "taleemHalqay",
      "totalHalqay",
      "subRehaishHalqay",
      "subTaleemHalqay",
      "subTotalHalqay",
      "busmSchoolUnits",
      "busmRehaishUnits",
      "busmTotalUnits",
      "arkan",
      "umeedWaran",
      "rafaqa",
      "karkunan",
      "members",
      "shaheen",
    ];
    afd.forEach((i) => {
      calcultate(i);
    });
    setLoading(false);
  };
  // GET REPORTS OF Division HALQA TO CREATE Division REPORT THE COMING REPORTS WILL BE POPULATED
  const getHalqaReports = async () => {
    setLoading(true);
    try {
      const req = await instance.get(`/reports/division`, {
        params: { areaId: me?.userAreaId?._id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
          "Content-Type": "application/json",
        },
      });
      const repo = req?.data?.data?.data;
      setCreateData(repo);
      dispatch({ type: "SUCCESS", payload: req.data?.message });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.response.data.message });
    }
    setLoading(false);
  };
  // To set values to zero when in create mode
  useEffect(() => {
    const value1 = document.getElementById("litrature");
    const value2 = document.getElementById("commonStudentMeetings");
    const value3 = document.getElementById("commonLiteratureDistribution");
    const value4 = document.getElementById("shabBedari");
    if (window.location.pathname?.split("/")[2] === "create") {
      value1.value = 0;
      value2.value = 0;
      value3.value = 0;
      value4.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getDivisionReport = async () => {
    setLoading(true);
    try {
      const req = await instance.get(`/reports/division/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
          "Content-Type": "application/json",
        },
      });
      const repo = req?.data?.data;
      setData(reverseDataFormat(repo));
      dispatch({ type: "SUCCESS", payload: req.data?.message });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.response.data.message });
    }
    setLoading(false);
  };
  useEffect(() => {
    const l = location.pathname?.split("/")[2];
    if (l === "view") {
      setView(true);
    }
    setId(params?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  useEffect(() => {
    const l = location.pathname?.split("/")[2];
    if (l === "create") {
      getHalqaReports();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  ["rafaqaFilledSum", "umeedwaranFilledSum", "currentSum", "meetingsSum"].map(
    (i) => delete data[i]
  );
  useEffect(() => {
    Object.keys(data).forEach((i) => {
      const elem = document.getElementById(i);
      if (elem) {
        if (i === "month") {
          elem.value = data[i]?.split("")?.slice(0, 7)?.join("");
        } else {
          if (elem.type === "checkbox") {
            elem.checked = data[i];
          } else {
            elem.value = data[i] || 0;
          }
        }
      }
    });
    const afd = [
      "rehaishHalqay",
      "taleemHalqay",
      "totalHalqay",
      "subRehaishHalqay",
      "subTaleemHalqay",
      "subTotalHalqay",
      "busmSchoolUnits",
      "busmRehaishUnits",
      "busmTotalUnits",
      "arkan",
      "umeedWaran",
      "rafaqa",
      "karkunan",
      "members",
      "shaheen",
    ];
    afd.forEach((i) => {
      calcultate(i);
    });
  }, [data]);
  useEffect(() => {
    if (!id) {
      autoFill();
    } else {
      getDivisionReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, createData, id]);
  // EDIT CODE END
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const jsonData = convertDataFormat(toJson(formData));
    setLoading(true);
    try {
      if (id) {
        const studyCircleDecidedValue = document.getElementById(
          "studyCircleMentioned-decided"
        ).value;
        const studyCircleDoneValue = document.getElementById(
          "studyCircleMentioned-done"
        ).value;
        const studyCircleAverageAttendanceValue = document.getElementById(
          "studyCircleMentioned-averageAttendance"
        ).value;

        const studyCircleMentioned = {
          decided: studyCircleDecidedValue,
          done: studyCircleDoneValue,
          averageAttendance: studyCircleAverageAttendanceValue,
        };

        // Add studyCircleMentioned object to jsonData
        jsonData.studyCircleMentioned = studyCircleMentioned;
        const req = await instance.put(`/reports/division/${id}`, jsonData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        });
        dispatch({ type: "SUCCESS", payload: req.data?.message });
        navigate("/reports");
      } else {
        const req = await instance.post("/reports/division", jsonData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        });
        await getDivisionReports(0, 10);
        dispatch({ type: "SUCCESS", payload: req.data?.message });
        navigate("/reports");
      }

      e.target.reset();
    } catch (error) {
      dispatch({ type: "ERROR", payload: error.response.data.message });
    }
    setLoading(false);
  };

  const totalHalqay = parseInt(
    document.getElementById("totalHalqay-end")?.value
  );
  const subTotalHalqay = parseInt(
    document.getElementById("subTotalHalqay-end")?.value
  );
  const busmTotalUnits = parseInt(
    document.getElementById("busmTotalUnits-end")?.value
  );

  useEffect(() => {
    document.getElementById("paighamEvent-decided").value = busmTotalUnits;
    document.getElementById("shaheenMeeting-decided").value = busmTotalUnits;
  }, [totalHalqay, subTotalHalqay, busmTotalUnits]);
  data.litrature = data["literatureDistribution"];

  return (
    <>
      <div className="reports  overflow-hidden overflow-y-scroll w-full">
        <div>
          <button
            type="button"
            className="p-2"
            onClick={() => navigate("/reports")}
          >
            <RxCross1 />
          </button>

          <h2 className="mb-2 block w-full text-center text-md md:text-2xl p-3">
            {" "}
            جائزہ کارکردگی رپورٹ (برائے ڈویژن){" "}
          </h2>
        </div>
        <form
          className="flex w-full flex-col justify-center items-center p-4 font-notoUrdu mb-5"
          dir="rtl"
          onSubmit={handleSubmit}
          id="division-form"
        >
          <div className="w-full">
            <div className="mb-4">
              <GeneralInfo
                month={month}
                me={me}
                newMonth={data?.month}
                setMonth={setMonth}
                area={"ڈویژن"}
                name={data?.["name"]}
              />
            </div>
            <div className="mb-4">
              <Jamiaat view={view} />
            </div>
            <div className="mb-4">
              <Colleges view={view} />
            </div>
            <div className="mb-4">
              {/* <TanzeemDivision view={view} /> */}
              <Tanzeem view={view} data={data} />
            </div>
            <div className="mb-4">
              {/* <MenTableDivision view={view} /> */}
              <IfradiKuwat view={view} data={data} />
            </div>
            <div className="mb-4">
              {/* <CentralActivitiesDivision view={view} /> */}
              <MarkaziActivities view={view} />
            </div>
            <div className="mb-4">
              {/* <ZailiActivitesDivision view={view} /> */}
              <ZailiActivities view={view} />
            </div>
            <div className=" mb-4">
              {/* <OtherActivitiesDivision arr={arr} view={view} /> */}
              <OtherActivities view={view} />
            </div>
            <div className=" mb-4">
              {/* <ExpandPartyDivision view={view} /> */}
              <ToseeDawat />
            </div>
            <div className=" mb-4">
              {/* <LibraryDivision view={view} /> */}
              <Library />
            </div>
            <div className=" mb-4">
              {/* <MessageDigestDivision view={view} /> */}
              <PaighamDigest view={view} />
            </div>
            <div className=" mb-4">
              {/* <MessageDigestDivision view={view} /> */}
              <Baitulmal view={view} />
            </div>
            <div className=" mb-4">
              {/* <EveningDiaryDivision view={view} /> */}
              <RozOShabDiary view={view} />
            </div>
          </div>
          <div className="w-full flex p-2">
            <label htmlFor="comments">تبصرہ</label>
            <input
              type="text"
              name="comments"
              required
              className="border-b-2 border-dashed w-full"
              maxLength={150}
              id="comments"
              readOnly={view}
            />
          </div>
          {!view && (
            <div className="w-full flex flex-col items-end gap-3 p-2">
              <div>
                <label htmlFor="nazim">نام ناظمِ:</label>
                <input
                  type="text"
                  className="border-b-2 border-dashed text-center"
                  id="nazim"
                  defaultValue={me?.name || ""}
                  readOnly
                />
              </div>
            </div>
          )}
          {!view && (
            <div className="w-full">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {id ? "Update" : "Add"}
              </button>
            </div>
          )}
          {/* </fieldset> */}
        </form>
      </div>
      {loading && <Loader />}
    </>
  );
};
