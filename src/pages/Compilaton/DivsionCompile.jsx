import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CompileReportContext, MeContext, useToastState } from "../../context";
import { UIContext } from "../../context/ui";
import { GeneralInfo, GeneralLayout, Loader } from "../../components";
import { Jamiaat } from "../../components/divisionReport/Jamiaat";
import { Colleges } from "../../components/divisionReport/Colleges";
import { Tanzeem } from "../../components/divisionReport/Tanzeem";
import { IfradiKuwat } from "../../components/divisionReport/IfradiKuwat";
import { MarkaziActivities } from "../../components/divisionReport/MarkaziActivities";
import { ZailiActivities } from "../../components/divisionReport/ZailiActivities";
import { OtherActivities } from "../../components/divisionReport/OtherActivities";
import { ToseeDawat } from "../../components/divisionReport/ToseeDawat";
import { Library } from "../../components/divisionReport/Library";
import { PaighamDigest } from "../../components/divisionReport/PaighamDigest";
import { Baitulmal } from "../../components/divisionReport/Baitulmal";
import { RozOShabDiary } from "../../components/divisionReport/RozOShabDiary";
import { NoReports } from "../Reports";
import { FaPrint } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";

export const DivisionCompile = () => {
  // EDIT CODE START
  const [createData, setCreateData] = useState();
  const [month, setMonth] = useState("");
  const params = useParams();
  const [id, setId] = useState(null);
  const { dispatch } = useToastState();
  const [data, setData] = useState({});
  const { loading, setLoading, getDivisionReports } = useContext(UIContext);
  const [view, setView] = useState(true);
  const location = useLocation();
  const me = useContext(MeContext);
  const navigate = useNavigate();
  const [page, setPage] = useState();

  const compileReport = useContext(CompileReportContext);

  const [date, setDate] = useState(
    `${compileReport?.startDate} تا  ${compileReport?.endDate}`
  );
  const queryParams = new URLSearchParams(location.search);
  const areaType = queryParams.get("areaType");
  const areaName = queryParams.get("areaName");
  const startDate = queryParams.get("startDate");
  const endDate = queryParams.get("endDate");
  const areaId = queryParams.get("areaId");
  const autoFill = () => {
    Object.keys(compileReport).forEach((i) => {
      const elem = document.getElementById(i);
      if (elem) {
        elem.value = compileReport[i];
      }
      if (i.includes("-monthly")) {
        const newKey = i.replace("-monthly", "-end");
        const newElem = document.getElementById(newKey);
        if (newElem) {
          newElem.value = compileReport[i];
        }
      }
    });
  };

  useEffect(() => {
    autoFill();
  }, [id, compileReport]);

  Object.keys(data).forEach((i) => {
    if (data[i] === null) {
      data[i] = 0;
    }
  });
  const handlePrint = () => {
    window.open(
      `/division-report-compile/print?areaId=${areaId}&startDate=${startDate}&endDate=${endDate}&areaName=${areaName}`
    );
    // window.location.href = `/halqa-report-compile/print?areaId${areaId}&startDate=${startDate}&endDate=${endDate}`;
  };
  return (
    <GeneralLayout active={"compileReports"}>
      {Object.keys(compileReport).length > 2 ? (
        <div className="reports overflow-hidden overflow-y-scroll w-full">
          <div>
            <button
              type="button"
              className="p-2"
              onClick={() => navigate("/compilation")}
            >
              <RxCross1 />
            </button>
            <h2 className="mb-2 block w-full text-center text-md md:text-2xl p-3">
              رپورٹ تالیف(برائے ڈویزن)
            </h2>
          </div>

          <form
            className="flex flex-col justify-center items-center p-4 font-notoUrdu mb-5"
            dir="rtl"
            id="markaz-form"
          >
            <div className="w-full">
              <div className="grid w-full grid-cols-1 lg:grid-cols-2">
                <div className="flex justify-start items-center gap-2 w-full p-2">
                  <label
                    htmlFor="halqa_name"
                    className="block text-sm md:text-lg"
                  >{`ڈویزن کا نام`}</label>
                  <input
                    required
                    className="border-b-2 border-dashed"
                    type="text"
                    name="name"
                    id="name"
                    value={areaName}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex justify-start items-center gap-4 w-full p-2">
                <label htmlFor="month" className="block text-sm md:text-lg">
                  برائے عرصہ
                </label>
                <span className="underline">{date}</span>
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
                <ZailiActivities view={view} compile={true} />
              </div>
              <div className=" mb-4">
                {/* <OtherActivitiesDivision arr={arr} view={view} /> */}
                <OtherActivities view={view} compile={true} />
              </div>
              <div className=" mb-4">
                {/* <ExpandPartyDivision view={view} /> */}
                <ToseeDawat compile={true} />
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
                <RozOShabDiary view={view} compile={true} />
              </div>
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

            {/* </fieldset> */}
          </form>
          <div className="flex w-ful justify-center">
            <button className="btn" onClick={() => handlePrint()}>
              <FaPrint /> پرنٹ
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full justify-center items-center">
          <div className="flex w-full justify-start">
            <button
              type="button"
              className="p-2"
              onClick={() => navigate("/compilation")}
            >
              <RxCross1 />
            </button>
          </div>
          <div>
            <NoReports />
          </div>
        </div>
      )}
      {loading && <Loader />}
    </GeneralLayout>
  );
};
