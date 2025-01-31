import { useContext, useEffect, useState } from "react";
import { GeneralLayout } from "../components";
import { UIContext } from "../context/ui";
import { FiTrash } from "react-icons/fi";
import { HiOutlineUpload } from "react-icons/hi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import {
  DivisionContext,
  HalqaContext,
  MaqamContext,
  MeContext,
  ProvinceContext,
  useToastState,
  IlaqaContext,
  ViewDetails,
} from "../context";
import instance from "../api/instrance";
import { RiDeviceRecoverFill } from "react-icons/ri";
import { decryptData } from "../utils";
import { IoEyeOutline } from "react-icons/io5";
export const DeleteUser = () => {
  const me = useContext(MeContext);
  const halqas = useContext(HalqaContext);
  const ilaqas = useContext(IlaqaContext);
  const maqams = useContext(MaqamContext);
  const provinces = useContext(ProvinceContext);
  const divisions = useContext(DivisionContext);
  const areaDetails = useContext(ViewDetails);
  const { nazim, loading, setLoading, getNazim, getAreaDetails } =
    useContext(UIContext);
  const { dispatch } = useToastState();

  const [data, setData] = useState(nazim);
  const [userAreaType, setUserAreaType] = useState("");
  const [nazimType, setNazimType] = useState("");
  const [areas, setAreas] = useState([]);
  const [searchArea, setSearchArea] = useState("");
  const [search, setSearch] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [singleUser, setSingleUser] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [years, setYears] = useState([
    2021, 2022, 2023, 2024, 2025, 2026, 2027,
  ]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [birthYear, setBirthYear] = useState(null);
  const [openYears, setOpenYears] = useState(false);
  const [withArea, setWithArea] = useState(false);
  const [openBirthYears, setOpenBirthYears] = useState(false);
  const itemsPerPage = 10;
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const YearCalender = (val) => {
    setYears((prevYears) => {
      const updatedYears = prevYears?.map((year) => year + val);
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

  const paginate = (items, pageNumber, itemsPerPage) => {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = paginate(data, currentPage, itemsPerPage);

  useEffect(() => {
    getAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAreaType]);

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
        await getNazim();
        setData(nazim);
        if (req) {
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
    setLoading(true);
    e.preventDefault();
    document.getElementById("categorize-filter").close();
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
      console.log("request?.data?.data", request?.data?.data);
      document.getElementById("categorize-filter").close();
      dispatch({ type: "SUCCESS", payload: request.data?.message });
      e.target.reset();
      setUserAreaType("");
      setNazimType("");
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
      await getNazim();
      if (nazim) {
        setData(nazim);
      }
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
      case "Country":
        setLoading(true);
        const data = await instance.get("/locations/country");
        setLoading(false);
        setAreas([data.data.data]);
        break;
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
      case "Ilaqa":
        setAreas(ilaqas);
        break;
      default:
        break;
    }
  };

  const handleCloseUpdateModel = () => {
    setUserAreaType("");
    setNazimType("nazim");
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
    setBirthYear("");
    setSelectedSubject("");
    setData(nazim);
  };

  useEffect(() => {
    setData(nazim);
  }, [nazim]);

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
      <div className="px-5 relative flex flex-col items-center py-3 pt-0 justify-start h-screen md:h-[calc(100vh-63.6px)] overflow-hidden overflow-y-auto">
        <div className="flex md:flex-row flex-col w-full items-center justify-between py-4 mb-4 border-b border-inputBorder">
          <div className="flex flex-col w-full md:w-[50%] justify-start mb-4">
            <h1 class="font-inter text-heading text-[18px] font-medium leading-[28px] text-left">
              Manage Users
            </h1>
            <p class="font-inter text-[14px] font-normal leading-[20px] text-left text-secondaryText">
              Manage Your users easily
            </p>
          </div>
          <div className="flex md:flex-row flex-col items-end w-full justify-end   gap-2  overflow-hidden overflow-x-scroll">
            <input
              type="search"
              name="Search"
              id="search"
              placeholder="Search by name..."
              className="input input-sm w-full input-bordered max-w-lg"
              value={search}
              onChange={searchUsers}
            />
            <div className="w-full flex gap-2">
              <button
                onClick={() => {
                  document.getElementById("categorize-filter").showModal();
                }}
                className="py-1 px-4 rounded-md bg-primary text-white border-none capitalize"
              >
                More Filters
              </button>
              <button
                onClick={() => clearSearchFilters()}
                className="border border-inputBorder rounded-md py-1 px-4 bg-none"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        <div className="w-full overflow-scroll">
          <table className="w-full">
            <thead>
              <tr className="">
                <th class="font-inter text-[12px] md:text-[14px] font-medium leading-[16.94px]  text-secondaryText text-left">
                  Name
                </th>
                <th class="font-inter text-[12px] md:text-[14px] font-medium leading-[16.94px]  text-secondaryText text-left">
                  Nazim Type
                </th>
                <th class="font-inter text-[12px] md:text-[14px] font-medium leading-[16.94px]  text-secondaryText text-left">
                  Email
                </th>
                <th class="font-inter text-[12px] md:text-[14px] font-medium leading-[16.94px]  text-secondaryText text-left">
                  Area
                </th>

                <th class="font-inter text-[12px] md:text-[14px] font-medium leading-[16.94px]  text-secondaryText text-left">
                  Status
                </th>
                <th class="font-inter text-[12px] md:text-[14px] font-medium leading-[16.94px]  text-secondaryText text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData
                ?.filter(
                  (i) =>
                    i?.email !== me?.email &&
                    i?.userRequestId?.status == "accepted"
                )
                ?.map((user, index) => (
                  <tr key={user.email} className="border-b w-full">
                    <td class="font-inter md:text-sm text-xs font-medium leading-[16.94px] text-left py-2 w-1/7">
                      {user?.name?.split("").length > 20
                        ? user?.name?.split("").slice(0, 20).join("")
                        : user?.name || "-"}
                    </td>
                    <td class="font-inter md:text-sm text-xs font-medium leading-[16.94px] text-left py-2 w-1/7">
                      {user?.nazimType
                        ?.replace(/-/g, " ")
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ") || "-"}
                    </td>
                    <td class="font-inter md:text-sm text-xs font-medium leading-[16.94px] text-left py-2 w-1/7">
                      {user?.email || "-"}
                    </td>
                    <td class="font-inter md:text-sm text-xs font-medium leading-[16.94px] text-left py-2 w-1/7">
                      {" "}
                      <div
                        onClick={() => {
                          getAreaDetails(user?.userAreaId, user?.userAreaType);
                        }}
                      >
                        <FaEye
                          className="cursor-pointer text-lg p-0 m-0"
                          id="sv"
                        />
                      </div>
                    </td>
                    <td class="font-inter md:text-sm text-xs font-medium leading-[16.94px] text-left py-2 w-1/7">
                      {user?.isDeleted ? (
                        <div className=" badge w-[70%] text-[12px] text-heading badge-lg flex justify-center items-center py-3 bg-[#f5cfcf]">
                          Inactive
                        </div>
                      ) : (
                        <div className="bg-[#cff5df] w-[70%] text-[12px] text-heading badge badge-lg flex justify-center items-center py-3">
                          Active
                        </div>
                      )}
                    </td>
                    <td class="font-inter md:text-sm text-xs font-medium leading-[16.94px] text-left py-2 w-1/7">
                      <div className="w-full flex justify-between items-center">
                        <button
                          onClick={() => {
                            document
                              .getElementById("view-details-modal")
                              .showModal();
                            setSingleUser(user);
                          }}
                          readOnly={loading}
                        >
                          <IoEyeOutline />
                        </button>
                        <button
                          readOnly={loading}
                          onClick={() => {
                            if (!user.isDeleted) {
                              deleteUser(user);
                            } else {
                              document
                                .getElementById("change-status-modal")
                                .showModal();
                              setSingleUser(user);
                            }
                          }}
                        >
                          {user?.isDeleted ? (
                            <RiDeviceRecoverFill />
                          ) : (
                            <FiTrash className="text-destructive" />
                          )}
                        </button>
                        {me?.userAreaType !== "halqa" && (
                          <button
                            readOnly={loading}
                            disabled={user?.isDeleted}
                            onClick={() => {
                              document
                                .getElementById("change-status-modal")
                                .showModal();
                              setSingleUser(user);
                            }}
                          >
                            <HiOutlineUpload />
                          </button>
                        )}
                         
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className="flex w-full gap-4 px-4 justify-end items-center mt-4">
          <select
            readOnly
            disabled
            name="items_per_page"
            id="items"
            className="select select-sm max-w-xs bg-gray-200 rounded-full"
          >
            <option value="text-[8px]" disabled selected>
              Rows per page 10
            </option>
          </select>

          {/* Previous Button */}
          <button
            className="rounded-full border-none w-7 h-7"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <IoIosArrowBack
              className={`text-[1.5rem] rounded-full bg-gray-200 ${
                currentPage === 1 && "text-gray-400"
              }`}
            />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center">
            {totalPages > 0 && (
              <span
                className={`rounded-full text-bold text-sm ${
                  currentPage === 1 && "border-2 border-gray-500"
                } mx-1 bg-white w-7 h-7 flex justify-center items-center text-[8px]`}
              >
                1
              </span>
            )}

            {totalPages > 1 && (
              <button
                className={`rounded-full text-bold text-sm ${
                  currentPage === 2 && "border-2 border-gray-500"
                } mx-1 bg-white w-7 h-7 flex justify-center items-center text-[8px]`}
              >
                2
              </button>
            )}
            {totalPages > 3 && <span>...</span>}
            {totalPages && currentPage > 2 && currentPage < totalPages && (
              <span
                className={`rounded-full text-bold text-sm ${
                  currentPage !== totalPages && "border-2 border-gray-500"
                } mx-1 bg-white w-7 h-7 flex justify-center items-center text-[8px]`}
              >
                {currentPage}
              </span>
            )}
            {totalPages && totalPages > 2 && (
              <span
                className={`rounded-full text-bold text-sm ${
                  currentPage === totalPages && "border-2 border-gray-500"
                } mx-1 bg-white w-7 h-7 flex justify-center items-center text-[8px]`}
              >
                {totalPages}
              </span>
            )}
          </div>

          {/* Next Button */}
          <button
            className="rounded-full border-none w-7 h-7"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            <IoIosArrowForward
              className={`text-[1.5rem] rounded-full bg-gray-200 ${
                currentPage === totalPages && "text-gray-400"
              }`}
            />
          </button>
        </div>
        {/* DIALOG BOXES */}

        <dialog id="categorize-filter" className="modal">
          <div className="modal-box p-2">
            <form
              autoComplete="off"
              method="dialog"
              className="space-y-3"
              onSubmit={handleSubmit}
              id="filter-form"
            >
              <h1 className="font-semibold text-md md:text-2xl">
                Categorize Users
              </h1>
              <div role="tablist" className="tabs tabs-boxed md:w-[50%] w-full">
                <button
                  role="tab"
                  className={`tab ${withArea ? "bg-white text-black" : ""}`}
                  onClick={(e) => {
                    setWithArea(true);
                    e.preventDefault();
                  }}
                >
                  Area Details
                </button>
                <button
                  role="tab"
                  className={`tab ${!withArea ? "bg-white text-black" : ""}`}
                  onClick={(e) => {
                    setWithArea(false);
                    e.preventDefault();
                  }}
                >
                  Personal Details
                </button>
              </div>

              {!withArea && (
                <div>
                  <div>
                    <label className="label">
                      <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                        Full Name
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      name="name"
                      className="w-full input input-bordered "
                    />
                  </div>

                  <div className="relative">
                    <label className="label">
                      <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                        Year of becoming rukan/umeedwar
                      </span>
                    </label>
                    <input
                      type="text"
                      id="year-of-joining"
                      placeholder={"Select year"}
                      name="joiningDate"
                      className="input input-bordered w-full"
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

                        {years?.map((obj) => (
                          <p
                            key={obj}
                            className={`year-item hover:bg-slate-400 w-full flex justify-start px-4 items-center cursor-pointer ${
                              obj === selectedYear ? "bg-slate-400" : ""
                            }`}
                            data-year={obj}
                            onClick={(e) => {
                              setSelectedYear(
                                parseInt(
                                  e.currentTarget.getAttribute("data-year")
                                )
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
                      <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                        Year of birth
                      </span>
                    </label>
                    <input
                      type="text"
                      id="year-of-joining"
                      placeholder={"Select year"}
                      name="dob"
                      className="input input-bordered w-full"
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

                        {years?.map((obj) => (
                          <p
                            key={obj}
                            className={`year-item hover:bg-slate-400 w-full flex justify-start px-4 items-center cursor-pointer ${
                              obj === birthYear ? "bg-slate-400" : ""
                            }`}
                            data-year={obj}
                            onClick={(e) => {
                              setBirthYear(
                                parseInt(
                                  e.currentTarget.getAttribute("data-year")
                                )
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
                      <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                        Qualifications
                      </span>
                    </label>
                    <select
                      name="qualification"
                      className="select  select-bordered w-full"
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
                    <label className="label">
                      <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                        Select Subject
                      </span>
                    </label>
                    <select
                      name="subject"
                      id="subject"
                      className="select select-bordered  w-full"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                      <option value={""}>Select subject</option>
                      {subjects?.map((sub, index) => (
                        <option
                          value={sub?._id}
                          key={index}
                          className="capitalize"
                        >
                          {sub?.title?.split("_").join(" ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full">
                    <label className="label">
                      <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                        Semester/Year
                      </span>
                    </label>
                    <select
                      name="semester"
                      className="select select-bordered  w-full "
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
                      <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                        Institution
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Institution"
                      name="institution"
                      className="w-full input input-bordered "
                    />
                  </div>
                </div>
              )}
              {withArea && (
                <div>
                  <div>
                    <span className="px-1 py-2 block font-semibold">
                      Organization pocket:
                    </span>
                    <div className="flex flex-wrap items-center justify-start border  p-2 rounded-lg">
                      {me?.nazim.toLowerCase() === "country" && (
                        <>
                          <div className="form-control">
                            <label className="label cursor-pointer gap-2">
                              <input
                                type="radio"
                                name="userAreaType"
                                className="radio checked:bg-blue-500"
                                checked={userAreaType === "Country"}
                                value="Country"
                                onChange={(e) => {
                                  setUserAreaType(e.target.value);
                                  setSearchArea("");
                                  document.getElementById(
                                    "autocomplete0"
                                  ).value = "";
                                }}
                              />
                              <span className="label-text">Markaz</span>
                            </label>
                          </div>
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
                                  document.getElementById(
                                    "autocomplete0"
                                  ).value = "";
                                }}
                              />
                              <span className="label-text">Province</span>
                            </label>
                          </div>
                        </>
                      )}

                      {(me?.nazim?.toLowerCase() === "country" ||
                        me?.nazim?.toLowerCase() === "province") && (
                        <div className="form-control">
                          <label className="label cursor-pointer gap-2">
                            <input
                              type="radio"
                              name="userAreaType"
                              className="radio checked:bg-primary"
                              checked={userAreaType === "Division"}
                              value="Division"
                              onChange={(e) => {
                                setUserAreaType(e.target.value);
                                setSearchArea("");
                                document.getElementById("autocomplete0").value =
                                  "";
                              }}
                            />
                            <span className="label-text">Division</span>
                          </label>
                        </div>
                      )}
                      {(me?.nazim?.toLowerCase() === "maqam" ||
                        me?.nazim?.toLowerCase() === "country" ||
                        me?.nazim?.toLowerCase() === "province") &&
                        ilaqas?.length > 0 && (
                          <div className="form-control">
                            <label className="label cursor-pointer gap-2">
                              <input
                                type="radio"
                                name="userAreaType"
                                className="radio checked:bg-primary"
                                checked={userAreaType === "Ilaqa"}
                                value="Ilaqa"
                                onChange={(e) => {
                                  setUserAreaType(e.target.value);
                                  setSearchArea("");
                                  document.getElementById(
                                    "autocomplete0"
                                  ).value = "";
                                }}
                              />
                              <span className="label-text">Ilaqa</span>
                            </label>
                          </div>
                        )}
                      {(me?.nazim?.toLowerCase() === "country" ||
                        me?.nazim?.toLowerCase() === "province") && (
                        <div className="form-control">
                          <label className="label cursor-pointer gap-2">
                            <input
                              type="radio"
                              name="userAreaType"
                              className="radio checked:bg-primary"
                              checked={userAreaType === "Maqam"}
                              value="Maqam"
                              onChange={(e) => {
                                setUserAreaType(e.target.value);
                                setSearchArea("");
                                document.getElementById("autocomplete0").value =
                                  "";
                              }}
                            />
                            <span className="label-text">Maqam</span>
                          </label>
                        </div>
                      )}
                      <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <input
                            type="radio"
                            name="userAreaType"
                            className="radio checked:bg-primary"
                            checked={userAreaType === "Halqa"}
                            value="Halqa"
                            onChange={(e) => {
                              setUserAreaType(e.target.value);
                              setSearchArea("");
                              document.getElementById("autocomplete0").value =
                                "";
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
                      Status:
                    </span>
                    <div className="flex  items-center justify-start flex-wrap border border-primary p-2 rounded-lg">
                      {userAreaType !== "Country" && (
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
                      )}
                      <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <input
                            type="radio"
                            name="nazimType"
                            className="radio checked:bg-primary"
                            value="umeedwaar"
                            checked={nazimType === "umeedwar"}
                            onChange={() => setNazimType("umeedwar")}
                          />
                          <span className="label-text">Umeedwaar</span>
                        </label>
                      </div>
                      {userAreaType !== "Country" && (
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
                      )}
                      <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <input
                            type="radio"
                            name="nazimType"
                            className="radio checked:bg-primary"
                            value="rukan"
                            checked={nazimType === "rukan"}
                            onChange={() => setNazimType("rukan")}
                          />
                          <span className="label-text">Rukan</span>
                        </label>
                      </div>
                      {userAreaType !== "Country" && (
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
                      )}
                    </div>
                  </div>
                  <div className="relative ">
                    <span className="px-1 py-2 block font-semibold">Area:</span>
                    <input type="hidden" name="userAreaId" id="userAreaId" />
                    <input
                      id="autocomplete0"
                      type="search"
                      className="input input-bordered w-full"
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
                      className="absolute hidden z-10 max-h-[150px] overflow-y-scroll bg-white border border-gray-300 w-full mt-1"
                    >
                      {areas?.length > 0
                        ? areas
                            .sort((a, b) => a?.name?.localeCompare(b?.name))
                            .filter((item) => {
                              if (searchArea && searchArea !== "") {
                                if (
                                  item?.name
                                    ?.toString()
                                    ?.toLowerCase()
                                    ?.includes(
                                      searchArea?.toString()?.toLowerCase()
                                    )
                                ) {
                                  return true;
                                }
                                return false;
                              } else {
                                return true;
                              }
                            })
                            ?.map((area, index) =>
                              Array.isArray(area) ? (
                                area.map((subArea, subIndex) => (
                                  <div
                                    key={`${index}-${subIndex}`}
                                    onClick={() => {
                                      document.getElementById(
                                        "userAreaId"
                                      ).value = subArea?._id;
                                      setSelectedId(subArea?._id);
                                      document.getElementById(
                                        "autocomplete0"
                                      ).value = `${subArea?.name}${
                                        userAreaType === "Halqa"
                                          ? ` - ${subArea?.parentId?.name} (${subArea?.parentType})`
                                          : userAreaType === "Ilaqa"
                                          ? ` - ${subArea?.maqam?.name} (${subArea?.maqam?.province?.name})`
                                          : userAreaType === "Maqam"
                                          ? ` - ${subArea?.province?.name} `
                                          : userAreaType === "Division"
                                          ? ` - ${subArea?.province?.name}`
                                          : ""
                                      }`;
                                      document
                                        .getElementById("autocomplete0-list")
                                        .classList.add("hidden");
                                    }}
                                    className="p-2 cursor-pointer hover:bg-gray-100"
                                  >
                                    {subArea?.name}
                                    {userAreaType === "Halqa"
                                      ? ` - ${subArea?.parentId?.name} (${subArea?.parentType})`
                                      : userAreaType === "Ilaqa"
                                      ? ` - ${subArea?.maqam?.name} (${subArea?.maqam?.province?.name})`
                                      : userAreaType === "Maqam"
                                      ? ` - ${subArea?.province?.name} `
                                      : userAreaType === "Division"
                                      ? ` - ${subArea?.province?.name}`
                                      : ""}
                                  </div>
                                ))
                              ) : (
                                <div
                                  key={index}
                                  onClick={() => {
                                    document.getElementById(
                                      "userAreaId"
                                    ).value = area?._id;
                                    setSelectedId(area?._id);
                                    document.getElementById(
                                      "autocomplete0"
                                    ).value = `${area?.name}${
                                      userAreaType === "Halqa"
                                        ? ` - ${area?.parentId?.name} (${area?.parentType})`
                                        : userAreaType === "Ilaqa"
                                        ? ` - ${area?.maqam?.name} (${area?.maqam?.province?.name})`
                                        : userAreaType === "Maqam"
                                        ? ` - ${area?.province?.name} `
                                        : userAreaType === "Division"
                                        ? ` - ${area?.province?.name}`
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
                                    ? ` - ${area?.parentId?.name} (${area?.parentType})`
                                    : userAreaType === "Ilaqa"
                                    ? ` - ${area?.maqam?.name} (${area?.maqam?.province?.name})`
                                    : userAreaType === "Maqam"
                                    ? ` - ${area?.province?.name} `
                                    : userAreaType === "Division"
                                    ? ` - ${area?.province?.name}`
                                    : ""}
                                </div>
                              )
                            )
                        : "No Area found"}
                    </div>
                  </div>
                </div>
              )}
              <div className="w-full flex justify-end items-center gap-4">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button
                    id="filter-area-dialog-close-btn"
                    className="py-1 px-4 rounded-md bg-primary text-white border-none capitalize"
                  >
                    Cancel
                  </button>
                </form>
                <button
                  type="submit"
                  className="py-1 px-4 rounded-md bg-primary text-white border-none capitalize"
                  onClick={() =>
                    document
                      .getElementById("filter-area-dialog-close-btn")
                      .click()
                  }
                >
                  Filter
                </button>
              </div>
            </form>
          </div>
        </dialog>
        {/* This is to see the user Details */}
        <dialog id="view-details-modal" className="modal">
          <div className="modal-box">
            <div className="flex justify-between items-center w-full">
              <h3 class="font-inter text-heading text-[16px] font-medium leading-[28px] text-left">
                User Details
              </h3>
              <button
                className="py-1 px-4 rounded-md bg-primary text-white border-none capitalize"
                onClick={() =>
                  document.getElementById("view-details-modal").close()
                }
              >
                Close
              </button>
            </div>
            <hr className="mb-3" />
            <form className="space-y-4">
              <div className="flex items-center justify-between gap-2 lg:flex-row md:flex-row sm:flex-col">
                <div className="w-full">
                  <label className="label">
                    <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                      Full Name
                    </span>
                  </label>
                  <input
                    readOnly
                    type="text"
                    placeholder="Full Name"
                    name="name"
                    className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                    defaultValue={singleUser?.name}
                  />
                </div>
                <div className="w-full">
                  <label className="label">
                    <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                      Father Name
                    </span>
                  </label>
                  <input
                    readOnly
                    type="text"
                    placeholder="Father name"
                    name="fatherName"
                    className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                    defaultValue={singleUser?.fatherName}
                  />
                </div>
              </div>
              <div className="flex w-full items-center justify-between gap-2 lg:flex-row md:flex-row sm:flex-col">
                <div className="w-full">
                  <label className="label">
                    <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                      Date of birth
                    </span>
                  </label>
                  <input
                    readOnly
                    defaultValue={singleUser?.dob?.split("T")[0]}
                    type="text"
                    placeholder="Date of birth"
                    name="dob"
                    className=" w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
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
                    className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                    defaultValue={singleUser?.joiningDate?.date?.split("T")[0]}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 lg:flex-row md:flex-row sm:flex-col">
                <div className="w-full">
                  <label className="label">
                    <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                      Qualifications
                    </span>
                  </label>
                  <input
                    readOnly
                    type="text"
                    placeholder="Qualification"
                    name="qualification"
                    className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter capitalize "
                    defaultValue={singleUser?.qualification}
                  />
                </div>
                <div className="w-full relative">
                  <label className="label">
                    <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                      Subject
                    </span>
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
                    <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                      Semester/Year
                    </span>
                  </label>
                  <input
                    readOnly
                    type="text"
                    placeholder="Semester"
                    name="semester"
                    className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter  capitalize "
                    defaultValue={singleUser?.semester}
                  />
                </div>
                <div className="w-full">
                  <label className="label">
                    <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                      Institution
                    </span>
                  </label>
                  <input
                    readOnly
                    defaultValue={singleUser?.institution}
                    type="text"
                    placeholder="Institution"
                    name="institution"
                    className=" w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 lg:flex-row md:flex-row sm:flex-col">
                <div className="w-full">
                  <label className="label">
                    <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                      Age
                    </span>
                  </label>
                  <input
                    readOnly
                    defaultValue={singleUser?.age}
                    type="number"
                    placeholder="Age"
                    name="age"
                    className=" w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                  />
                </div>
                <div className="w-full">
                  <label className="label">
                    <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                      Nazim Type
                    </span>
                  </label>
                  <input
                    readOnly
                    defaultValue={singleUser?.nazimType}
                    type="number"
                    placeholder={singleUser?.nazimType
                      ?.split("-")
                      ?.map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                    name="nazimType"
                    className=" w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 lg:flex-row md:flex-row sm:flex-col">
                <div className="w-full">
                  <label className="label">
                    <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                      Phone Number
                    </span>
                  </label>
                  <input
                    readOnly
                    defaultValue={decryptData(singleUser?.phoneNumber)}
                    type="text"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    className=" w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                  />
                </div>
                <div className="w-full">
                  <label className="label">
                    <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                      WhatsApp Number
                    </span>
                  </label>
                  <input
                    readOnly
                    defaultValue={decryptData(singleUser?.whatsAppNumber)}
                    type="text"
                    placeholder="WhatsApp Number"
                    name="whatsAppNumber"
                    className=" w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                  />
                </div>
              </div>

              <div className="w-full">
                <label className="label">
                  <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                    Home address
                  </span>
                </label>
                <textarea
                  placeholder="Address"
                  name="address"
                  className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                  required
                  defaultValue={decryptData(singleUser?.address)}
                ></textarea>
              </div>
              <div className="w-full">
                <label className="label">
                  <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                    Area
                  </span>
                </label>
                <input
                  readOnly
                  defaultValue={singleUser?.userAreaId?.name}
                  type="text"
                  placeholder="UserArea"
                  name="userArea"
                  className=" w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                />
              </div>
              <div className="w-full">
                <label className="label">
                  <span class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                    Email
                  </span>
                </label>
                <input
                  readOnly
                  defaultValue={singleUser?.email}
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  className=" w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                />
              </div>
            </form>
          </div>
        </dialog>
        {/* {Change user status} */}
        <dialog id="change-status-modal" className="modal">
          <div className="modal-box flex justify-between items-start flex-col h-[600px]">
            <div>
              <h3 className="font-bold text-2xl">Change Status</h3>
              <hr className="mb-3" />
              <form className="space-y-4 mb-3">
                <div>
                  <span className="px-1 py-2 block font-semibold">
                    Organization pocket:
                  </span>
                  <div className="flex flex-wrap items-center justify-start border border-primary p-2 rounded-lg">
                    {me?.nazim.toLowerCase() === "country" && (
                      <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <input
                            type="radio"
                            name="userAreaType"
                            className="radio checked:bg-blue-500"
                            checked={userAreaType === "Country"}
                            value="Country"
                            onChange={(e) => {
                              setUserAreaType(e.target.value);
                              setSearchArea("");
                              document.getElementById("autocomplete0").value =
                                "";
                            }}
                          />
                          <span className="label-text">Markaz</span>
                        </label>
                      </div>
                    )}
                    {me?.nazim.toLowerCase() === "country" && (
                      <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <input
                            type="radio"
                            name="userAreaType"
                            className="radio checked:bg-primary"
                            checked={userAreaType === "Province"}
                            value="Province"
                            onChange={(e) => {
                              setUserAreaType(e.target.value);
                              setSearchArea("");
                              document.getElementById("autocomplete0").value =
                                "";
                            }}
                          />
                          <span className="label-text">Province</span>
                        </label>
                      </div>
                    )}

                    {(me?.nazim?.toLowerCase() === "country" ||
                      me?.nazim?.toLowerCase() === "province") && (
                      <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <input
                            type="radio"
                            name="userAreaType"
                            className="radio checked:bg-primary"
                            checked={userAreaType === "Division"}
                            value="Division"
                            onChange={(e) => {
                              setUserAreaType(e.target.value);
                              setSearchArea("");
                              document.getElementById("autocomplete0").value =
                                "";
                            }}
                          />
                          <span className="label-text">Division</span>
                        </label>
                      </div>
                    )}
                    {/* jhgjgkjgkgkjhkhkj */}
                    {(me?.nazim?.toLowerCase() === "maqam" ||
                      me?.nazim?.toLowerCase() === "country" ||
                      me?.nazim?.toLowerCase() === "province") &&
                      ilaqas?.length > 0 && (
                        <div className="form-control">
                          <label className="label cursor-pointer gap-2">
                            <input
                              type="radio"
                              name="userAreaType"
                              className="radio checked:bg-primary"
                              checked={userAreaType === "Ilaqa"}
                              value="Ilaqa"
                              onChange={(e) => {
                                setUserAreaType(e.target.value);
                                setSearchArea("");
                                document.getElementById("autocomplete0").value =
                                  "";
                              }}
                            />
                            <span className="label-text">Ilaqa</span>
                          </label>
                        </div>
                      )}
                    {(me?.nazim?.toLowerCase() === "country" ||
                      me?.nazim?.toLowerCase() === "province") && (
                      <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <input
                            type="radio"
                            name="userAreaType"
                            className="radio checked:bg-primary"
                            checked={userAreaType === "Maqam"}
                            value="Maqam"
                            onChange={(e) => {
                              setUserAreaType(e.target.value);
                              setSearchArea("");
                              document.getElementById("autocomplete0").value =
                                "";
                            }}
                          />
                          <span className="label-text">Maqam</span>
                        </label>
                      </div>
                    )}
                    <div className="form-control">
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="radio"
                          name="userAreaType"
                          className="radio checked:bg-primary"
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
                    {userAreaType !== "Country" && (
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
                    )}
                    <div className="form-control">
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="radio"
                          name="nazimType"
                          className="radio checked:bg-primary"
                          value="umeedwaar"
                          checked={nazimType === "umeedwar"}
                          onChange={() => setNazimType("umeedwar")}
                        />
                        <span className="label-text">Umeedwaar</span>
                      </label>
                    </div>
                    {userAreaType !== "Country" && (
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
                    )}
                    <div className="form-control">
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="radio"
                          name="nazimType"
                          className="radio checked:bg-primary"
                          value="rukan"
                          checked={nazimType === "rukan"}
                          onChange={() => setNazimType("rukan")}
                        />
                        <span className="label-text">Rukan</span>
                      </label>
                    </div>
                    {userAreaType !== "Country" && (
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
                    )}
                  </div>
                </div>
                <div className="relative ">
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
                    className="absolute hidden z-10 max-h-[150px] overflow-y-scroll bg-white border border-gray-300 w-full mt-1"
                  >
                    {areas?.length > 0
                      ? areas
                          .sort((a, b) => a?.name?.localeCompare(b?.name))
                          .filter((item) => {
                            if (searchArea && searchArea !== "") {
                              if (
                                item?.name
                                  ?.toString()
                                  ?.toLowerCase()
                                  ?.includes(
                                    searchArea?.toString()?.toLowerCase()
                                  )
                              ) {
                                return true;
                              }
                              return false;
                            } else {
                              return true;
                            }
                          })
                          ?.map((area, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                document.getElementById("userAreaId").value =
                                  area?._id;
                                setSelectedId(area?._id);
                                document.getElementById(
                                  "autocomplete0"
                                ).value = `${area?.name}${
                                  userAreaType === "Halqa"
                                    ? ` - ${area?.parentId?.name} (${area?.parentType})`
                                    : userAreaType === "Ilaqa"
                                    ? ` - ${area?.maqam?.name} (${area?.maqam?.province?.name})`
                                    : userAreaType === "Maqam"
                                    ? ` - ${area?.province?.name} `
                                    : userAreaType === "Division"
                                    ? ` - ${area?.province?.name}`
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
                                ? ` - ${area?.parentId?.name} (${area?.parentType})`
                                : userAreaType === "Ilaqa"
                                ? ` - ${area?.maqam?.name} (${area?.maqam?.province?.name})`
                                : userAreaType === "Maqam"
                                ? ` - ${area?.province?.name} `
                                : userAreaType === "Division"
                                ? ` - ${area?.province?.name}`
                                : ""}
                            </div>
                          ))
                      : "No Area found"}
                  </div>
                </div>
              </form>
            </div>
            <form method="dialog" className="modal-backdrop">
              <div className="flex justify-end items-end w-full gap-5">
                <button
                  className="py-1 px-4 rounded-md bg-primary text-white border-none capitalize"
                  onClick={handleCloseUpdateModel}
                >
                  Close
                </button>
                <button
                  className="py-1 px-4 rounded-md bg-primary text-white border-none capitalize"
                  onClick={updateStatus}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </dialog>
        <dialog id="area_details" className="modal">
          <div className="modal-box">
            <h3 class="font-inter text-heading text-[16px] font-medium leading-[28px] text-left mb-4">
              Details of the area
            </h3>
            <div className="w-full  flex flex-col justify-between items-start text-left gap-4  flex-wrap">
              <div className="w-full flex justify-start items-center gap-5">
                <h5 class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                  Area Name:
                </h5>
                <h4 class="font-inter text-secondaryText text-[12px] font-medium leading-[28px] text-left">
                  {areaDetails?.name}
                </h4>
                <h4 class="font-inter text-secondaryText text-[12px] font-medium leading-[28px] text-left">
                  {areaDetails?.parentType === "Ilaqa" ||
                  areaDetails?.parentType === "Tehsil" ||
                  areaDetails?.parentType === "Division" ||
                  areaDetails?.parentType === "Maqam"
                    ? "(Halqa)"
                    : !areaDetails?.parentId && areaDetails?.maqam
                    ? "(Ilaqa)"
                    : areaDetails?.country
                    ? "(Province)"
                    : `(${areaDetails?.areaType || "Pakistan"})`}
                </h4>
              </div>
              <div className="w-full flex justify-start items-center gap-5">
                {areaDetails?.parentType
                  ? areaDetails?.parentType + ":"
                  : areaDetails?.maqam
                  ? "Maqam"
                  : ""}
                <h4 class="font-inter text-secondaryText text-[12px] font-medium leading-[28px] text-left">
                  {areaDetails?.parentType === "Ilaqa"
                    ? areaDetails?.parentId?.name
                    : areaDetails?.parentType === "Maqam"
                    ? areaDetails?.parentId?.name
                    : areaDetails?.parentType === "Tehsil"
                    ? areaDetails?.parentId?.name
                    : areaDetails?.parentType === "Division"
                    ? areaDetails?.parentId?.name
                    : areaDetails?.maqam
                    ? areaDetails?.maqam?.name
                    : ""}
                </h4>
              </div>

              {areaDetails?.parentType === "Tehsil" &&
                !areaDetails?.parentType === "Division" && (
                  <>
                    <div className="w-full flex justify-start items-center gap-5">
                      <h5 class="font-inter text-heading text-[16px] font-medium leading-[28px] text-left">
                        {" "}
                        District:
                      </h5>
                      <h4 class="font-inter text-secondaryText text-[14px] font-medium leading-[28px] text-left">
                        {areaDetails?.parentId?.district
                          ? areaDetails?.parentId?.district?.name
                          : "Not a District aera"}
                      </h4>
                    </div>
                    <div className="w-full flex justify-start items-center gap-5">
                      <h5>Division:</h5>
                      <h4 class="font-inter text-secondaryText text-[14px] font-medium leading-[28px] text-left">
                        {areaDetails?.parentId?.district
                          ? areaDetails?.parentId?.district?.division?.name
                          : areaDetails?.division?.name}
                      </h4>
                    </div>
                  </>
                )}
              {areaDetails?.parentType === "Ilaqa" && (
                <div className="w-full flex justify-start items-center gap-5">
                  <h5 class="font-inter text-heading text-[16px] font-medium leading-[28px] text-left">
                    Maqam:
                  </h5>
                  <h4 class="font-inter text-secondaryText text-[14px] font-medium leading-[28px] text-left">
                    {areaDetails?.parentType === "Ilaqa"
                      ? areaDetails?.parentId?.maqam?.name
                      : ""}
                  </h4>
                </div>
              )}

              {!areaDetails?.country && areaDetails.name !== "Pakistan" && (
                <div className="w-full flex justify-start items-center gap-5">
                  <h4 class="font-inter text-heading text-[16px] font-medium leading-[28px] text-left">
                    Province:
                  </h4>
                  <h4 class="font-inter text-secondaryText text-[14px] font-medium leading-[28px] text-left">
                    {areaDetails?.parentType === "Ilaqa"
                      ? areaDetails?.parentId?.maqam?.province?.name
                      : areaDetails?.parentType === "Maqam"
                      ? areaDetails?.parentId?.province?.name
                      : areaDetails?.parentType === "Tehsil"
                      ? areaDetails?.parentId?.district?.division?.province
                          ?.name
                      : areaDetails?.parentType === "Division"
                      ? areaDetails?.parentId?.province?.name
                      : areaDetails?.province
                      ? areaDetails?.province?.name
                      : areaDetails?.maqam
                      ? areaDetails?.maqam?.province?.name
                      : ""}
                  </h4>
                </div>
              )}
              <div className="w-full flex justify-start items-center gap-5">
                <h5 class="font-inter text-heading text-[14px] font-medium leading-[28px] text-left">
                  Country:
                </h5>
                <h4 class="font-inter text-secondaryText text-[14px] font-medium leading-[28px] text-left">
                  Pakistan
                </h4>
              </div>
            </div>
            <div className="modal-action w-full">
              <form method="dialog" className="w-full">
                <div className=" w-full flex justify-end gap-3 items-center">
                  <button
                    id="close-details-modal"
                    className="py-1 px-4 rounded-md bg-primary text-white border-none capitalize"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </GeneralLayout>
  );
};
