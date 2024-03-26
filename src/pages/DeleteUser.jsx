import { useContext, useEffect, useState } from "react";
import { GeneralLayout } from "../components";
import { UIContext } from "../context/ui";
import { FaEye, FaFile, FaTrash } from "react-icons/fa";
import {
  DivisionContext,
  HalqaContext,
  MaqamContext,
  MeContext,
  ProvinceContext,
  DistrictContext,
  useToastState,
} from "../context";
import instance from "../api/instrance";
import { Link } from "react-router-dom";
import { MdOutlineUpgrade } from "react-icons/md";
import { getDivisionByTehsil } from "./Reports";
import { RiDeviceRecoverFill } from "react-icons/ri";
export const DeleteUser = () => {
  const me = useContext(MeContext);
  const halqas = useContext(HalqaContext);
  const maqams = useContext(MaqamContext);
  const provinces = useContext(ProvinceContext);
  const divisions = useContext(DivisionContext);
  const districts = useContext(DistrictContext);
  const { nazim, loading, setLoading, getNazim } = useContext(UIContext);
  const [data, setData] = useState(nazim);
  const [userAreaType, setUserAreaType] = useState("");
  const [nazimType, setNazimType] = useState("");
  const [areas, setAreas] = useState([]);
  const [searchArea, setSearchArea] = useState("");
  const [search, setSearch] = useState("");
  const [subjects, setSubjects] = useState([]);
  const { dispatch } = useToastState();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [singleUser, setSingleUser] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [years, setYears] = useState([
    2021, 2022, 2023, 2024, 2025, 2026, 2027,
  ]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [birthYear, setBirthYear] = useState(null);
  const [openYears, setOpenYears] = useState(false);
  const [openBirthYears, setOpenBirthYears] = useState(false);
  //year calender
  const YearCalender = (val) => {
    setYears((prevYears) => {
      const updatedYears = prevYears.map((year) => year + val);
      return updatedYears;
    });
  };
  const searchUsers = (e) => {
    setSearch(e.target.value);
    if (e.target.value && e.target.value !== "") {
      setData(
        nazim.filter(
          (i) =>
            i.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
            i.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    } else {
      setData(nazim);
    }
  };
  useEffect(() => {
    getAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAreaType]);
  useEffect(() => {
    setData(nazim);
  }, [nazim]);
  // get Divisions
  const getAreaType = (area) => {
    if (area?.parentType === "Maqam") {
      const name = maqams.find((i) => i?._id === area?.parentId?._id);
      return `${name?.name}(Maqam)`;
    } else if (area?.parentType === "Tehsil") {
      const name = getDivisionByTehsil(area?.parentId, districts);
      return `${name}(Division)`;
    } else if (area?.province) {
      return maqams.find((i) => i?._id === area?._id) ? "Maqam" : "Division";
    }
    return "Province";
  };
  const deleteUser = async (user) => {
    setLoading(true);
    try {
      let isConfirmed = window.confirm(
        `Are you sure you want to delete ${user?.email} ?`
      );
      if (isConfirmed) {
        const req = await instance.delete("/user/" + user?._id, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        });
        if (req) {
          await getNazim();
          dispatch({ type: "SUCCESS", payload: req.data?.message });
        }
      }
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err?.response?.data?.message || err?.message,
      });
    }
    setLoading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById("categorize-filter").setAttribute("open", "false");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const params = {};
    const data = {
      userAreaId: formData.get("userAreaId"),
      userAreaType: formData.get("userAreaType"),
      name: formData.get("name"),
      nazim:
        formData.get("userAreaType") !== ""
          ? formData.get("userAreaType")?.toLowerCase()
          : formData.get("userAreaType"),
      dob: formData.get("dob"),
      address: formData.get("address"),
      qualification: formData.get("qualification"),
      subject: formData.get("subject"),
      semester: formData.get("semester"),
      institution: formData.get("institution"),
      joiningDate: formData.get("joiningDate"),
      nazimType: formData.get("nazimType"),
    };
    if (data.userAreaId && data.userAreaId !== "")
      params.userAreaId = data.userAreaId;
    if (data.userAreaType && data.userAreaType !== "")
      params.userAreaType = data.userAreaType;
    if (data.name && data.name !== "") params.name = data.name;
    if (data.nazim && data.nazim !== "") params.nazim = data.nazim;
    if (data.dob && data.dob !== "") params.dob = data.dob;
    if (data.address && data.address !== "") params.address = data.address;
    if (data.qualification && data.qualification !== "")
      params.qualification = data.qualification;
    if (data.subject && data.subject !== "") params.subject = data.subject;
    if (data.semester && data.semester !== "") params.semester = data.semester;
    if (data.institution && data.institution !== "")
      params.institution = data.institution;
    if (data.joiningDate && data.joiningDate !== "")
      params.joiningDate = data.joiningDate;
    if (data.nazimType && data.nazimType !== "")
      params.nazimType = data.nazimType;

    try {
      const request = await instance.get("/user/filter", {
        params: params,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
        },
      });
      setData(request?.data?.data);
      document.getElementById("categorize-filter").close();
      dispatch({ type: "SUCCESS", payload: request.data?.message });
      e.target.reset();
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.response.data.message });
    }

    setLoading(false);
  };
  const updateStatus = async () => {
    const data = {
      nazim: userAreaType,
      nazimType: nazimType,
      userAreaId: selectedId,
      userId: singleUser?._id,
    };
    let req;
    try {
      req = await instance.put("/user/update-status", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
        },
      });
      dispatch({ type: "SUCCESS", payload: req.data?.message });
      getNazim();
    } catch (err) {
      dispatch({ type: "ERROR", payload: err?.response?.data?.message });
    }
  };
  useEffect(() => {
    getAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAreaType]);
  const getAreas = async () => {
    switch (userAreaType) {
      case "Province":
        setAreas(provinces);
        break;
      case "Division":
        setAreas(divisions);
        break;
      case "Maqam":
        setAreas(maqams);
        break;
      case "Halqa":
        setAreas(halqas);
        break;
      default:
        break;
    }
  };
  const handleCloseUpdateModel = () => {
    setUserAreaType("");
    setNazimType("");
    document.getElementById("autocomplete0").value = "";
  };
  useEffect(() => {
    const handleClickYear = (e) => {
      if (
        !["year-of-joining", "plus-year", "minus-year"].includes(e.target.id)
      ) {
        setOpenYears(false);
      }
      if (e?.target?.id !== "autocomplete") {
        if (
          !document
            ?.getElementById("autocomplete-list")
            ?.classList?.contains("hidden")
        ) {
          document
            ?.getElementById("autocomplete-list")
            ?.classList?.add("hidden");
        }
      }
    };
    document.addEventListener("click", handleClickYear);
    return () => {
      document.removeEventListener("click", handleClickYear);
    };
  }, []);
  const getSubjects = async () => {
    try {
      const request = await instance.get("/subjects", {
        headers: { "Content-Type": "application/json" },
      });
      if (request.status === 200) {
        setSubjects([...request.data.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSubjects();
  }, []);
  const clearSearchFilters = () => {
    document.getElementById("filter-form").reset();
    setSelectedYear("");
    setSelectedSubject("");
    setData(nazim);
    setBirthYear("");
  };
  const handleEventClick = (e) => {
    if (e?.target?.id !== "autocomplete0") {
      if (
        !document
          ?.getElementById("autocomplete0-list")
          ?.classList?.contains("hidden")
      ) {
        document
          ?.getElementById("autocomplete0-list")
          ?.classList?.add("hidden");
      }
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleEventClick);
    return () => {
      document.removeEventListener("click", handleEventClick);
    };
  }, []);
  return (
    <GeneralLayout title={"Manage Users"} active={"user-switch"}>
      <div className="p-5 relative flex flex-col items-center py-3 px-0 pt-0 justify-start h-[calc(100vh-65.6px-64px)] overflow-hidden overflow-y-auto">
        <div className="w-full">
          <div className="flex items-center justify-start md:justify-center gap-2 p-2 overflow-hidden overflow-x-scroll">
            <input
              type="search"
              name="Search"
              id="search"
              placeholder="Search by name..."
              className="input input-bordered"
              value={search}
              onChange={searchUsers}
            />
            <button
              onClick={() => {
                document.getElementById("categorize-filter").showModal();
              }}
              className="btn border-none"
            >
              More Filters
            </button>
            <button
              onClick={() => clearSearchFilters()}
              className="btn border-none"
            >
              Clear Filters
            </button>
          </div>
          <div className="flex overflow-hidden overflow-x-scroll overflow-y-scroll  ">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Nazim Type</th>
                  <th>Email</th>
                  <th>
                    {localStorage.getItem("@type") === "province"
                      ? "Area"
                      : "Halqa"}
                  </th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((i) => i?.userAreaId?._id !== me?.userAreaId?._id)
                  .map((maqam, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{maqam?.name || "-"}</td>
                      <td className="min-w-[10rem]">
                        {maqam?.nazimType
                          ?.replace(/-/g, " ") // Replace hyphens with spaces
                          .split(" ") // Split the string into an array of words
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          ) // Capitalize the first letter of each word
                          .join(" ") || // Join the array back into a string with spaces
                          "-"}
                      </td>

                      <td>{maqam?.email || "-"}</td>
                      <td>{maqam?.userAreaId?.name || "-"}</td>
                      <td>
                        {maqam?.isDeleted ? (
                          <div className="badge badge-error">inActive</div>
                        ) : (
                          <div className="badge badge-accent">active</div>
                        )}
                      </td>
                      <td className="flex row justify-center items-center gap-3">
                        <div className="flex justify-center items-center">
                          <Link
                            to={`/reports?active=${maqam?.userAreaType?.toLowerCase()}${
                              maqam?.userAreaId?.parentType
                                ? `&tab=${
                                    maqam?.userAreaId?.parentType?.toLowerCase() ===
                                    "maqam"
                                      ? "maqam"
                                      : "division"
                                  }`
                                : ""
                            }&areaId=${maqam?.userAreaId?._id}`}
                            readOnly={loading}
                            className="btn"
                          >
                            <FaFile />
                          </Link>
                        </div>
                        <div className="flex justify-center items-center">
                          <button
                            onClick={() => {
                              document
                                .getElementById("view-details-modal")
                                .showModal();
                              setSingleUser(maqam);
                            }}
                            readOnly={loading}
                            className="btn"
                          >
                            <FaEye />
                          </button>
                        </div>
                        <div className="flex justify-center items-center">
                          <button
                            readOnly={loading}
                            className="btn"
                            onClick={() => {
                              if (!maqam.isDeleted) {
                                deleteUser(maqam);
                              } else {
                                document
                                  .getElementById("change-status-modal")
                                  .showModal();
                                setSingleUser(maqam);
                              }
                            }}
                          >
                            {maqam?.isDeleted ? (
                              <RiDeviceRecoverFill />
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                        {me?.userAreaType !== "halqa" && (
                          <div className="flex justify-center items-center">
                            <button
                              readOnly={loading}
                              disabled={maqam?.isDeleted}
                              className="btn"
                              onClick={() => {
                                document
                                  .getElementById("change-status-modal")
                                  .showModal();
                                setSingleUser(maqam);
                              }}
                            >
                              <MdOutlineUpgrade />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <dialog id="categorize-filter" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                id="filter-area-dialog-close-btn"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
            </form>
            <form
              autoComplete="off"
              method="dialog"
              className="space-y-4"
              onSubmit={handleSubmit}
              id="filter-form"
            >
              <h1 className="font-semibold text-2xl">Categorize Users</h1>

              <div>
                <label className="label">
                  <span className="text-base label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  className="w-full input input-bordered input-primary"
                />
              </div>

              <div className="relative">
                <label className="label">
                  <span className="text-base label-text">
                    Year of becoming rukan/umeedwar
                  </span>
                </label>
                <input
                  type="text"
                  id="year-of-joining"
                  placeholder={"Select year"}
                  name="joiningDate"
                  className="w-full select select-bordered select-primary"
                  value={selectedYear}
                  onClick={() => setOpenYears(!openYears)}
                />
                {openYears && (
                  <div className="absolute bg-white border w-20 p-0 right-0 select-none z-10">
                    <span
                      id="minus-year"
                      className="w-full p-1 bg-[#eee] hover:bg-[#aaa] block text-center"
                      onClick={() => YearCalender(-1)}
                    >
                      -
                    </span>

                    {years.map((obj) => (
                      <p
                        key={obj}
                        className={`year-item hover:bg-slate-400 w-full flex justify-start px-4 items-center cursor-pointer ${
                          obj === selectedYear ? "bg-slate-400" : ""
                        }`}
                        data-year={obj}
                        onClick={(e) => {
                          setSelectedYear(
                            parseInt(e.currentTarget.getAttribute("data-year"))
                          );
                          setOpenYears(false);
                        }}
                      >
                        {obj}
                      </p>
                    ))}
                    <span
                      id="plus-year"
                      className="w-full p-1 bg-[#eee] hover:bg-[#aaa] block text-center"
                      onClick={() => YearCalender(1)}
                    >
                      +
                    </span>
                  </div>
                )}
              </div>
              <div className="relative">
                <label className="label">
                  <span className="text-base label-text">Year of birth</span>
                </label>
                <input
                  type="text"
                  id="year-of-joining"
                  placeholder={"Select year"}
                  name="dob"
                  className="w-full select select-bordered select-primary"
                  value={birthYear}
                  onClick={() => setOpenBirthYears(!openBirthYears)}
                />
                {openBirthYears && (
                  <div className="absolute bg-white border w-20 p-0 right-0 select-none">
                    <span
                      id="minus-year"
                      className="w-full p-1 bg-[#eee] hover:bg-[#aaa] block text-center"
                      onClick={() => YearCalender(-1)}
                    >
                      -
                    </span>

                    {years.map((obj) => (
                      <p
                        key={obj}
                        className={`year-item hover:bg-slate-400 w-full flex justify-start px-4 items-center cursor-pointer ${
                          obj === birthYear ? "bg-slate-400" : ""
                        }`}
                        data-year={obj}
                        onClick={(e) => {
                          setBirthYear(
                            parseInt(e.currentTarget.getAttribute("data-year"))
                          );
                          setOpenBirthYears(false);
                        }}
                      >
                        {obj}
                      </p>
                    ))}
                    <span
                      id="plus-year"
                      className="w-full p-1 bg-[#eee] hover:bg-[#aaa] block text-center"
                      onClick={() => YearCalender(1)}
                    >
                      +
                    </span>
                  </div>
                )}
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="text-base label-text">Qualifications</span>
                </label>
                <select
                  name="qualification"
                  className="select select-bordered select-primary w-full"
                  defaultValue={""}
                >
                  {/* <button>add</button> */}
                  <option value={""}>Qualification</option>
                  <option value={"matric"}>Matric</option>
                  <option value={"intermediate"}>Intermediate</option>
                  <option value={"bachelors"}>Bachelors</option>
                  <option value={"masters"}>Masters</option>
                  <option value={"phd"}>PHD</option>
                </select>
              </div>
              <div className="w-full">
                <select
                  name="subject"
                  id="subject"
                  className="select select-bordered select-primary w-full"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value={""}>Select subject</option>
                  {subjects?.map((sub, index) => (
                    <option value={sub?._id} key={index} className="capitalize">
                      {sub?.title?.split("_").join(" ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label className="label">
                  <span className="text-base label-text">Semester/Year</span>
                </label>
                <select
                  name="semester"
                  className="select select-bordered select-primary w-full "
                  defaultValue={""}
                >
                  <option value={""}>Semester/Year</option>
                  <option value={"semester 1"}>Semester 1</option>
                  <option value={"semester 2"}>Semester 2</option>
                  <option value={"semester 3"}>Semester 3</option>
                  <option value={"semester 4"}>Semester 4</option>
                  <option value={"semester 5"}>Semester 5</option>
                  <option value={"semester 6"}>Semester 6</option>
                  <option value={"semester 7"}>Semester 7</option>
                  <option value={"semester 8"}>Semester 8</option>
                  <option value={"semester 9"}>Semester 9</option>
                  <option value={"semester10"}>Semester10</option>
                  <option value={"semester 11"}>Semester 11</option>
                  <option value={"semester 12"}>Semester 12</option>
                  <option value={"1st year"}>1st Year</option>
                  <option value={"2nd year"}>2nd Year</option>
                  <option value={"3rd year"}>3rd Year</option>
                  <option value={"4th year"}>4th Year</option>
                  <option value={"5th year"}>5th Year</option>
                </select>
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="text-base label-text">Institution</span>
                </label>
                <input
                  type="text"
                  placeholder="Institution"
                  name="institution"
                  className="w-full input input-bordered input-primary"
                />
              </div>

              {/* <div>
                <span className="px-1 py-2 block font-semibold">
                  Organization pocket:
                </span>
                <div className="flex flex-wrap items-center justify-start border border-primary p-2 rounded-lg">
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="userAreaType"
                        className="radio checked:bg-blue-500"
                        checked={userAreaType === "Province"}
                        value="Province"
                        onChange={(e) => {
                          setUserAreaType(e.target.value);
                          setSearchArea("");
                          document.getElementById("autocomplete").value = "";
                        }}
                      />
                      <span className="label-text">Province</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="userAreaType"
                        className="radio checked:bg-blue-500"
                        checked={userAreaType === "Division"}
                        value="Division"
                        onChange={(e) => {
                          setUserAreaType(e.target.value);
                          setSearchArea("");
                          document.getElementById("autocomplete").value = "";
                        }}
                      />
                      <span className="label-text">Division</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="userAreaType"
                        className="radio checked:bg-blue-500"
                        checked={userAreaType === "Maqam"}
                        value="Maqam"
                        onChange={(e) => {
                          setUserAreaType(e.target.value);
                          setSearchArea("");
                          document.getElementById("autocomplete").value = "";
                        }}
                      />
                      <span className="label-text">Maqam</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="userAreaType"
                        className="radio checked:bg-blue-500"
                        checked={userAreaType === "Halqa"}
                        value="Halqa"
                        onChange={(e) => {
                          setUserAreaType(e.target.value);
                          setSearchArea("");
                          document.getElementById("autocomplete").value = "";
                        }}
                      />
                      <span className="label-text">Halqa</span>
                    </label>
                  </div>
                </div>
              </div> */}

              {/* NAZIM TYPES */}
              {/* <div>
                <span className="px-1 py-2 block font-semibold">Status:</span>
                <div className="flex items-center justify-between border border-primary p-2 rounded-lg">
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="nazimType"
                        className="radio checked:bg-blue-500"
                        checked={nazimType === "nazim"}
                        value="nazim"
                        onChange={(e) => {
                          setNazimType(e.target.value);
                          setSearchArea("");
                          document.getElementById("autocomplete").value = "";
                        }}
                      />
                      <span className="label-text">Nazim</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="nazimType"
                        className="radio checked:bg-blue-500"
                        checked={nazimType === "rukan"}
                        value="rukan"
                        onChange={(e) => {
                          setNazimType(e.target.value);
                          setSearchArea("");
                          document.getElementById("autocomplete").value = "";
                        }}
                      />
                      <span className="label-text">Rukan</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="nazimType"
                        className="radio checked:bg-blue-500"
                        checked={nazimType === "umeedwaar"}
                        value="umeedwaar"
                        onChange={(e) => {
                          setNazimType(e.target.value);
                          setSearchArea("");
                          document.getElementById("autocomplete").value = "";
                        }}
                      />
                      <span className="label-text">Umeedwaar</span>
                    </label>
                  </div>
                </div>
              </div> */}
              {/* <div className="relative">
                <span className="px-1 py-2 block font-semibold">Area:</span>
                <input type="hidden" name="userAreaId" id="userAreaId" />
                <input
                  id="autocomplete"
                  type="text"
                  className="input input-bordered input-primary w-full"
                  placeholder="Select area"
                  onChange={(e) => setSearchArea(e.target.value)}
                  onClick={() => {
                    if (
                      document
                        .getElementById("autocomplete-list")
                        .classList.contains("hidden")
                    ) {
                      document
                        .getElementById("autocomplete-list")
                        .classList.remove("hidden");
                    } else {
                      document
                        .getElementById("autocomplete-list")
                        .classList.add("hidden");
                    }
                  }}
                />
                <div
                  id="autocomplete-list"
                  className="absolute hidden z-10 max-h-[100px] overflow-y-scroll bg-white border border-gray-300 w-full mt-1"
                >
                  {areas
                    .sort((a, b) => a?.name?.localeCompare(b?.name))
                    .filter((item) => {
                      if (searchArea && searchArea !== "") {
                        if (
                          item?.name
                            ?.toString()
                            ?.toLowerCase()
                            ?.includes(searchArea?.toString()?.toLowerCase())
                        ) {
                          return true;
                        }
                        return false;
                      } else {
                        return true;
                      }
                    })
                    .map((area, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          document.getElementById("userAreaId").value =
                            area?._id;
                          document.getElementById("autocomplete").value = `${
                            area?.name
                          }${
                            userAreaType === "Halqa"
                              ? ` - ${area?.parentId?.name} (${area?.parentType})`
                              : ""
                          }`;
                          document
                            .getElementById("autocomplete-list")
                            .classList.add("hidden");
                        }}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {area?.name}
                        {userAreaType === "Halqa"
                          ? ` - ${area?.parentId?.name} (${area?.parentType})`
                          : ""}
                      </div>
                    ))}
                </div>
              </div> */}
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() =>
                  document
                    .getElementById("filter-area-dialog-close-btn")
                    .click()
                }
              >
                Filter
              </button>
            </form>
          </div>
        </dialog>
        {/* This is to see the user Details */}
        <dialog id="view-details-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-2xl">User Details</h3>
            <hr className="mb-3" />
            <form className="space-y-4">
              <div className="flex items-center justify-between gap-2 lg:flex-row md:flex-row sm:flex-col">
                <div className="w-full">
                  <label className="label">
                    <span className="text-base label-text">Full Name</span>
                  </label>
                  <input
                    readOnly
                    type="text"
                    placeholder="Full Name"
                    name="name"
                    className="w-full text-[#7a7a7a]"
                    defaultValue={singleUser?.name}
                  />
                </div>
                <div className="w-full">
                  <label className="label">
                    <span className="text-base label-text">Father Name</span>
                  </label>
                  <input
                    readOnly
                    type="text"
                    placeholder="Father name"
                    name="fatherName"
                    className="w-full text-[#7a7a7a]"
                    defaultValue={singleUser?.fatherName}
                  />
                </div>
              </div>
              <div className="flex w-full items-center justify-between gap-2 lg:flex-row md:flex-row sm:flex-col">
                <div className="w-full">
                  <label className="label">
                    <span className="text-base label-text">Date of birth</span>
                  </label>
                  <input
                    readOnly
                    defaultValue={singleUser?.dob?.split("T")[0]}
                    type="text"
                    placeholder="Date of birth"
                    name="dob"
                    className=" w-full text-[#7a7a7a]"
                  />
                </div>
                <div className="w-full">
                  <label className="label">
                    <span className="label-text text-sm">
                      Month of becoming rukan/umeedwar
                    </span>
                  </label>
                  <input
                    readOnly
                    type="text"
                    placeholder="JoiningDate"
                    name="joiningDate"
                    className="w-full text-[#7a7a7a]"
                    defaultValue={singleUser?.joiningDate?.date?.split("T")[0]}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 lg:flex-row md:flex-row sm:flex-col">
                <div className="w-full">
                  <label className="label">
                    <span className="text-base label-text">Qualifications</span>
                  </label>
                  <input
                    readOnly
                    type="text"
                    placeholder="Qualification"
                    name="qualification"
                    className="w-full text-[#7a7a7a] capitalize "
                    defaultValue={singleUser?.qualification}
                  />
                </div>
                <div className="w-full relative">
                  <label className="label">
                    <span className="text-base label-text">Subject</span>
                  </label>

                  <input
                    readOnly
                    type="text"
                    placeholder="Subject"
                    name="subject"
                    className="w-full   capitalize"
                    defaultValue={(() => {
                      const foundSubject = subjects.find(
                        (subject) => subject._id === singleUser?.subject
                      );
                      return foundSubject?.title;
                    })()}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 lg:flex-row md:flex-row sm:flex-col">
                <div className="w-full">
                  <label className="label">
                    <span className="text-base label-text">Semester/Year</span>
                  </label>
                  <input
                    readOnly
                    type="text"
                    placeholder="Semester"
                    name="semester"
                    className="w-full text-[#7a7a7a]  capitalize "
                    defaultValue={singleUser?.semester}
                  />
                </div>
                <div className="w-full">
                  <label className="label">
                    <span className="text-base label-text">Institution</span>
                  </label>
                  <input
                    readOnly
                    defaultValue={singleUser?.institution}
                    type="text"
                    placeholder="Institution"
                    name="institution"
                    className=" w-full text-[#7a7a7a]"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 lg:flex-row md:flex-row sm:flex-col">
                <div className="w-full">
                  <label className="label">
                    <span className="text-base label-text">Age</span>
                  </label>
                  <input
                    readOnly
                    defaultValue={singleUser?.age}
                    type="number"
                    placeholder="Age"
                    name="age"
                    className=" w-full text-[#7a7a7a]"
                  />
                </div>
                <div className="w-full">
                  <label className="label">
                    <span className="text-base label-text">Nazim Type</span>
                  </label>
                  <input
                    readOnly
                    defaultValue={singleUser?.nazimType}
                    type="number"
                    placeholder={singleUser?.nazimType
                      ?.split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                    name="nazimType"
                    className=" w-full text-[#7a7a7a]"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 lg:flex-row md:flex-row sm:flex-col">
                <div className="w-full">
                  <label className="label">
                    <span className="text-base label-text">Phone Number</span>
                  </label>
                  <input
                    readOnly
                    defaultValue={singleUser?.phoneNumber}
                    type="text"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    className=" w-full text-[#7a7a7a]"
                  />
                </div>
                <div className="w-full">
                  <label className="label">
                    <span className="text-base label-text">
                      WhatsApp Number
                    </span>
                  </label>
                  <input
                    readOnly
                    defaultValue={singleUser?.whatsAppNumber}
                    type="text"
                    placeholder="WhatsApp Number"
                    name="whatsAppNumber"
                    className=" w-full text-[#7a7a7a]"
                  />
                </div>
              </div>

              <div className="w-full">
                <label className="label">
                  <span className="text-base label-text">Home address</span>
                </label>
                <textarea
                  placeholder="Address"
                  name="address"
                  className="w-full text-[#7a7a7a]"
                  required
                  defaultValue={singleUser?.address}
                ></textarea>
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="text-base label-text">Area</span>
                </label>
                <input
                  readOnly
                  defaultValue={singleUser?.userAreaId?.name}
                  type="text"
                  placeholder="UserArea"
                  name="userArea"
                  className=" w-full text-[#7a7a7a]"
                />
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="text-base label-text">Email</span>
                </label>
                <input
                  readOnly
                  defaultValue={singleUser?.email}
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  className=" w-full text-[#7a7a7a]"
                />
              </div>
            </form>
            <form method="dialog" className="modal-backdrop">
              <div className="flex justify-end items-end w-full">
                <button className="btn rounded-lg ">Close</button>
              </div>
            </form>
          </div>
        </dialog>
        {/* {Change user status} */}
        <dialog id="change-status-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-2xl">Change Status</h3>
            <hr className="mb-3" />
            <form className="space-y-4 mb-3">
              <div>
                <span className="px-1 py-2 block font-semibold">
                  Organization pocket:
                </span>
                <div className="flex flex-wrap items-center justify-start border border-primary p-2 rounded-lg">
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="userAreaType"
                        className="radio checked:bg-blue-500"
                        checked={userAreaType === "Province"}
                        value="Province"
                        onChange={(e) => {
                          setUserAreaType(e.target.value);
                          setSearchArea("");
                          document.getElementById("autocomplete0").value = "";
                        }}
                      />
                      <span className="label-text">Province</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="userAreaType"
                        className="radio checked:bg-blue-500"
                        checked={userAreaType === "Division"}
                        value="Division"
                        onChange={(e) => {
                          setUserAreaType(e.target.value);
                          setSearchArea("");
                          document.getElementById("autocomplete0").value = "";
                        }}
                      />
                      <span className="label-text">Division</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="userAreaType"
                        className="radio checked:bg-blue-500"
                        checked={userAreaType === "Maqam"}
                        value="Maqam"
                        onChange={(e) => {
                          setUserAreaType(e.target.value);
                          setSearchArea("");
                          document.getElementById("autocomplete0").value = "";
                        }}
                      />
                      <span className="label-text">Maqam</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="userAreaType"
                        className="radio checked:bg-blue-500"
                        checked={userAreaType === "Halqa"}
                        value="Halqa"
                        onChange={(e) => {
                          setUserAreaType(e.target.value);
                          setSearchArea("");
                          document.getElementById("autocomplete0").value = "";
                        }}
                      />
                      <span className="label-text">Halqa</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* NAZIM TYPES */}
              <div className="w-full">
                <span className="px-1 py-2 block font-semibold">
                  Change status to:
                </span>
                <div className="flex  items-center justify-start flex-wrap border border-primary p-2 rounded-lg">
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="nazimType"
                        className="radio checked:bg-blue-500"
                        value="nazim"
                        checked={nazimType === "nazim"}
                        onChange={() => setNazimType("nazim")}
                      />
                      <span className="label-text">Rafiq-Nazim</span>
                    </label>
                  </div>
                  {userAreaType !== "Halqa" && (
                    <div className="form-control">
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="radio"
                          name="nazimType"
                          className="radio checked:bg-blue-500"
                          value="umeedwaar"
                          checked={nazimType === "umeedwar"}
                          onChange={() => setNazimType("umeedwar")}
                        />
                        <span className="label-text">Umeedwaar</span>
                      </label>
                    </div>
                  )}
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="nazimType"
                        className="radio checked:bg-blue-500"
                        value="umeedwaar-nazim"
                        onChange={() => setNazimType("umeedwaar-nazim")}
                      />
                      <span className="label-text">Umeedwaar-Nazim</span>
                    </label>
                  </div>
                  {userAreaType !== "Halqa" && (
                    <div className="form-control">
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="radio"
                          name="nazimType"
                          className="radio checked:bg-blue-500"
                          value="rukan"
                          checked={nazimType === "rukan"}
                          onChange={() => setNazimType("rukan")}
                        />
                        <span className="label-text">Rukan</span>
                      </label>
                    </div>
                  )}
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="nazimType"
                        className="radio checked:bg-blue-500"
                        value="rukan-nazim"
                        checked={nazimType === "rukan-nazim"}
                        onChange={() => setNazimType("rukan-nazim")}
                      />
                      <span className="label-text">Rukan-Nazim</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="relative">
                <span className="px-1 py-2 block font-semibold">Area:</span>
                <input type="hidden" name="userAreaId" id="userAreaId" />
                <input
                  id="autocomplete0"
                  type="search"
                  className="input input-bordered input-primary w-full"
                  placeholder="Select area"
                  onChange={(e) => setSearchArea(e.target.value)}
                  onClick={() => {
                    if (
                      document
                        .getElementById("autocomplete0-list")
                        .classList.contains("hidden")
                    ) {
                      document
                        .getElementById("autocomplete0-list")
                        .classList.remove("hidden");
                    } else {
                      document
                        .getElementById("autocomplete0-list")
                        .classList.add("hidden");
                    }
                  }}
                />
                <div
                  id="autocomplete0-list"
                  className="absolute hidden z-10 max-h-[100px] overflow-y-scroll bg-white border border-gray-300 w-full mt-1"
                >
                  {areas
                    .sort((a, b) => a?.name?.localeCompare(b?.name))
                    .filter((item) => {
                      if (searchArea && searchArea !== "") {
                        if (
                          item?.name
                            ?.toString()
                            ?.toLowerCase()
                            ?.includes(searchArea?.toString()?.toLowerCase())
                        ) {
                          return true;
                        }
                        return false;
                      } else {
                        return true;
                      }
                    })
                    .map((area, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          document.getElementById("userAreaId").value =
                            area?._id;
                          setSelectedId(area?._id);
                          document.getElementById("autocomplete0").value = `${
                            area?.name
                          }${
                            userAreaType === "Halqa"
                              ? ` - ${area?.parentId?.name} (${area?.parentType})`
                              : ""
                          }`;
                          document
                            .getElementById("autocomplete0-list")
                            .classList.add("hidden");
                        }}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {area?.name}
                        {userAreaType === "Halqa"
                          ? ` - ${area?.parentId?.name} ${getAreaType(area)}`
                          : ""}
                      </div>
                    ))}
                </div>
              </div>
            </form>
            <form method="dialog" className="modal-backdrop">
              <div className="flex justify-end items-end w-full gap-5">
                <button
                  className="btn rounded-lg"
                  onClick={handleCloseUpdateModel}
                >
                  Close
                </button>
                <button className="btn rounded-lg" onClick={updateStatus}>
                  Update
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </GeneralLayout>
  );
};
