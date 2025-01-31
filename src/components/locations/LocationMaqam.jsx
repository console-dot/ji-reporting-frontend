import { useContext, useEffect, useState } from "react";
import {
  HalqaContext,
  IlaqaContext,
  MaqamContext,
  ProvinceContext,
  ViewDetails,
  useToastState,
} from "../../context";
import { Link, useLocation } from "react-router-dom";
import instance from "../../api/instrance";
import { UIContext } from "../../context/ui";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { validateForm, validateSnakeCase } from "../../utils";
export const LocationMaqam = () => {
  const provinces = useContext(ProvinceContext);
  const maqams = useContext(MaqamContext);
  const halqas = useContext(HalqaContext);
  const ilaqas = useContext(IlaqaContext);
  const areaDetails = useContext(ViewDetails);
  const [isCalled, setIsCalled] = useState(false);
  const {
    getHalqas,
    getMaqams,
    setLoading,
    loading,
    getIlaqas,
    getAreaDetails,
  } = useContext(UIContext);
  const [value, setValue] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState("");
  const { dispatch } = useToastState();
  const [filteredData, setFilteredData] = useState([]);
  const [view, setView] = useState("halqa");
  const [isIlaqa, setIsIlaqa] = useState(false);
  const params = useLocation();
  const [muntakhib, setMuntakhib] = useState(ilaqas?.length > 0 ? true : false);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const handleKeyDown = (e) => {
    if (e.key === " ") {
      setMessage("Please use '_' for space.");
    } else {
      setMessage("");
    }
  };
  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data
    const getQueryParams = () => {
      const searchParams = new URLSearchParams(params.search);
      const queryParams = {};
      for (let [key, value] of searchParams.entries()) {
        queryParams[key] = value;
      }

      setView(queryParams.view || "halqa");
      if (
        queryParams.hasOwnProperty !== "halqa" &&
        Object.keys(queryParams).length === 1
      ) {
        setFilteredData(halqas);
      } else {
        if (queryParams.view) {
          if (queryParams.view === "halqa") {
            if (queryParams.active === "maqam") {
              let maqamHalqas = halqas?.filter(
                (i) => i.parentType === "Ilaqa" || i?.parentType === "Maqam"
              );
              setFilteredData(maqamHalqas);
            } else if (queryParams.active === "division") {
              let divHalqas = halqas?.filter(
                (i) => i.parentType === "Tehsil" || i?.parentType === "Division"
              );
              setFilteredData(divHalqas);
            } else {
              setFilteredData(halqas);
            }
          }
          if (queryParams.view === "maqam") {
            setFilteredData(maqams);
          }
          if (queryParams.view === "ilaqa") {
            setFilteredData(ilaqas);
          }
        }
      }
      setLoading(false);
    };

    // Call the function when the component mounts or when the location changes
    getQueryParams();
    // eslint-disable-next-line
  }, [params, view, halqas, maqams, ilaqas]);

  useEffect(() => {
    if (view) {
      const searchParams = new URLSearchParams(params.search);
      const queryParams = {};
      for (let [key, value] of searchParams.entries()) {
        queryParams[key] = value;
      }
      if (view === "halqa") {
        if (queryParams.active === "maqam") {
          let maqamHalqas = halqas?.filter(
            (i) => i.parentType === "Ilaqa" || i?.parentType === "Maqam"
          );
          setFilteredData(maqamHalqas);
        } else if (queryParams.active === "division") {
          let divHalqas = halqas?.filter(
            (i) => i.parentType === "Tehsil" || i?.parentType === "Division"
          );
          setFilteredData(divHalqas);
        } else {
          setFilteredData(halqas);
        }
      }
      if (view === "maqam") {
        setFilteredData(maqams);
      }
      if (view === "ilaqa") {
        setFilteredData(ilaqas);
      }
    }
  }, [halqas, maqams, ilaqas]);
  const itemsPerPage = 10; // Adjust this as needed
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Compute the displayed items based on the current page

  useEffect(() => {
    const dataToPaginate = filteredData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    setPaginatedData(dataToPaginate.slice(startIndex, endIndex));
  }, [currentPage, filteredData, value]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const [form, setForm] = useState({
    name: "",
    province: "",
  });

  const [ilaqaForm, setIlaqaForm] = useState({
    name: "",
    maqam: "",
  });

  const [formHalqa, setFormHalqa] = useState({
    name: "",
    parentId: "",
    parentType: "",
    unitType: "",
  });

  // ****************MAQAM************************

  const handleSubmit = async () => {
    if (!validateForm(form)) {
      alert("All fields are required. Please fill out all fields.");
      return;
    }
    if (validateSnakeCase(form.name)) {
      console.log("Form Submitted:", form.name);
    } else {
      alert("Please use snake_case format.");
    }
    try {
      setLoading(true);
      const req = await instance.post("/locations/maqam", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
          "Content-Type": "application/json",
        },
      });
      dispatch({ type: "SUCCESS", payload: req?.data?.message });
      setForm({
        name: "",
        province: "",
      });
      await getMaqams();
      document.getElementById("add_maqam_modal").close();
    } catch (err) {
      document.getElementById("add_maqam_modal").close();
      dispatch({ type: "ERROR", payload: err?.response?.data?.message });
    }
    setLoading(false);
  };

  const handleSubmitEdit = async () => {
    setLoading(true);
    try {
      const req = await instance.put("/locations/maqam/" + id, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
          "Content-Type": "application/json",
        },
      });
      await getMaqams();
      document.getElementById("add_maqam_modal").close();

      dispatch({ type: "SUCCESS", payload: req?.data?.message });
    } catch (err) {
      document.getElementById("add_maqam_modal").close();
      dispatch({ type: "ERROR", payload: err?.response?.data?.message });
    }
    setLoading(false);
  };

  // ****************HALQA************************

  const handleSubmitHalqa = async () => {
    if (!validateForm(formHalqa)) {
      alert("All fields are required. Please fill out all fields.");
      return;
    }
    if (validateSnakeCase(formHalqa.name)) {
      console.log("Form Submitted:", formHalqa.name);
    } else {
      alert("Please use snake_case format.");
    }
    try {
      setLoading(true);
      const req = await instance.post("/locations/halqa", formHalqa, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
          "Content-Type": "application/json",
        },
      });
      await getHalqas();
      document.getElementById("add_halqa_modal").close();

      dispatch({ type: "SUCCESS", payload: req?.data?.message });
      setFormHalqa({
        name: "",
        parentId: "",
        parentType: "",
        unitType: "",
      });
    } catch (err) {
      document.getElementById("add_halqa_modal").close();
      dispatch({ type: "ERROR", payload: err?.response?.data?.message });
    }
    setLoading(false);
  };

  const handleSubmitHalqaEdit = async () => {
    setLoading(true);
    try {
      const req = await instance.put("/locations/halqa/" + id, formHalqa, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
          "Content-Type": "application/json",
        },
      });
      await getHalqas();
      document.getElementById("add_halqa_modal").close();

      dispatch({ type: "SUCCESS", payload: req?.data?.message });
    } catch (err) {
      document.getElementById("add_halqa_modal").close();
      dispatch({ type: "ERROR", payload: err?.response?.data?.message });
    }
    setLoading(false);
  };

  // ****************ILAQA************************

  const handleSubmitIlaqa = async () => {
    if (!validateForm(ilaqaForm)) {
      alert("All fields are required. Please fill out all fields.");
      return;
    }
    if (validateSnakeCase(ilaqaForm.name)) {
      console.log("Form Submitted:", ilaqaForm.name);
    } else {
      alert("Please use snake_case format.");
    }
    try {
      setLoading(true);
      const req = await instance.post("/locations/ilaqa", ilaqaForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
          "Content-Type": "application/json",
        },
      });

      dispatch({ type: "SUCCESS", payload: req?.data?.message });
      document.getElementById("add_ilaqa_modal").close();
      setIlaqaForm({
        name: "",
        maqam: "",
      });
      await getIlaqas();
    } catch (err) {
      document.getElementById("add_ilaqa_modal").close();
      dispatch({ type: "ERROR", payload: err?.response?.data?.message });
    }
    setLoading(false);
  };

  const handleSubmitEditIlaqa = async () => {
    if (!validateForm(ilaqaForm)) {
      alert("All fields are required. Please fill out all fields.");
      return;
    }
    setLoading(true);
    try {
      const req = await instance.put("/locations/ilaqa/" + id, ilaqaForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
          "Content-Type": "application/json",
        },
      });
      setIlaqaForm({
        name: "",
        maqam: "",
      });
      await getIlaqas();
      document.getElementById("add_ilaqa_modal").close();

      dispatch({ type: "SUCCESS", payload: req?.data?.message });
    } catch (err) {
      document.getElementById("add_ilaqa_modal").close();
      dispatch({ type: "ERROR", payload: err?.response?.data?.message });
    }
    setLoading(false);
  };

  const handleDisable = async (area, disabled) => {
    // Validation for active child counts
    if (
      area.activeHalqaCount > 0 ||
      area.activeTehsilCount > 0 ||
      area.activeDistrictCount > 0 ||
      area.activeMaqamCount > 0 ||
      area.activeDivisionCount > 0 ||
      area.activeIlaqaCount > 0
    ) {
      dispatch({
        type: "ERROR",
        payload:
          "Parent cannot be disabled until all child entities are disabled.",
      });
      return;
    }
    try {
      setLoading(true);
      const req = await instance.patch(
        `/locations/${view}/disable-location/${area?._id}`,
        { disabled },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        }
      );

      const getAreas = () => {
        switch (view) {
          case "halqa":
            getHalqas();
            break;
          case "maqam":
            getMaqams();
            break;
          case "ilaqa":
            getIlaqas();
            break;
          default:
            break;
        }
      };
      if (req) {
        const updatedData = filteredData.map((item) =>
          item._id === area._id ? { ...item, disabled } : item
        );
        setPaginatedData(updatedData);
        dispatch({ type: "SUCCESS", payload: req.data?.message });
        getAreas();
      }
    } catch (err) {
      dispatch({ type: "ERROR", payload: err?.response?.data?.message });
    }
    setLoading(false);
  };

  const handleSearch = (value) => {
    setValue(value);
    if (view === "halqa") {
      const filteredHalqa = halqas?.filter((hal) => {
        const halName = hal?.name?.toLowerCase() || "";
        const parentName = hal?.parentId?.name?.toLowerCase() || "";
        const searchValue = value.toLowerCase();

        return (
          halName.includes(searchValue) || parentName.includes(searchValue)
        );
      });

      setFilteredData(filteredHalqa);
    } else if (view === "maqam") {
      const filteredMaqams = maqams
        ?.map((maqam) => maqam)
        .filter(
          (maq) =>
            maq?.name.toLowerCase().includes(value.toLowerCase()) ||
            maq?.province?.name.toLowerCase().includes(value.toLowerCase())
        );

      setFilteredData(filteredMaqams);
    } else if (view === "ilaqa") {
      const filteredIlaqa = ilaqas
        ?.map((ilaqa) => ilaqa)
        .filter(
          (ila) =>
            ila?.name.toLowerCase().includes(value.toLowerCase()) ||
            ila?.maqam?.name.toLowerCase().includes(value.toLowerCase())
        );
      setFilteredData(filteredIlaqa);
    }
    setCurrentPage(1); // Reset to the first page after search
  };
  const fetchAreas = async () => {
    setIsCalled(true);
    if (maqams.length === 0) {
      await getMaqams();
    }
    if (ilaqas.length === 0) {
      await getIlaqas();
      setMuntakhib(true);
    }
    if (halqas.length === 0) {
      await getHalqas();
    }
  };
  useEffect(() => {
    if (!isCalled) {
      fetchAreas();
    }
  }, []);
  useEffect(() => {
    console.log(areaDetails);
  }, [areaDetails]);
  return (
    <>
      <div className="w-full flex flex-wrap gap-2 justify-end items-center">
        {["province", "country"].includes(localStorage.getItem("@type")) &&
          view === "maqam" && (
            <button
              disabled={loading}
              className="md:px-4 md:py-2 px-2 py-1 text-[14px] rounded-md bg-primary text-white capitalize "
              onClick={() => {
                setForm({
                  name: "",
                  province: "",
                });
                document.getElementById("add_maqam_modal").showModal();
                setEditMode(false);
              }}
            >
              Add Maqam
            </button>
          )}
        {["maqam", "province", "country"].includes(
          localStorage.getItem("@type")
        ) &&
          view === "ilaqa" && (
            <button
              disabled={loading}
              className="md:px-4 md:py-2 px-2 py-1 text-[14px] rounded-md bg-primary text-white capitalize "
              onClick={() => {
                setIlaqaForm({
                  name: "",
                  maqam: "",
                });
                document.getElementById("add_ilaqa_modal").showModal();
                setEditMode(false);
              }}
            >
              Add Ilaqa
            </button>
          )}
        {view === "halqa" && (
          <button
            disabled={loading}
            onClick={() => {
              setFormHalqa({
                name: "",
                parentId: "",
                parentType: "",
                unitType: "",
              });
              document.getElementById("add_halqa_modal").showModal();
              setEditMode(false);
            }}
            className="md:px-4 md:py-2 px-2 py-1 text-[14px] rounded-md bg-primary text-white capitalize "
          >
            Add Halqa
          </button>
        )}
      </div>

      <div className="w-full flex md:flex-row flex-col justify-between items-start">
        <div
          role="tablist"
          className="w-auto flex  justify-between md:justify-start items-center tabs tabs-boxed"
        >
          {["country", "province"].includes(localStorage.getItem("@type")) && (
            <Link
              to={"?active=maqam&view=maqam"}
              role="tab"
              className={`tab ${view === "maqam" ? "bg-white text-black" : ""}`}
              onClick={() => setCurrentPage(1)}
            >
              Maqam
            </Link>
          )}
          <Link
            to={"?active=maqam&view=halqa"}
            role="tab"
            className={`tab ${view === "halqa" ? "bg-white text-black" : ""}`}
            onClick={() => setCurrentPage(1)}
          >
            Halqa
          </Link>
          {muntakhib && (
            <Link
              to={"?active=maqam&view=ilaqa"}
              role="tab"
              className={`tab ${view === "ilaqa" ? "bg-white text-black" : ""}`}
              onClick={() => setCurrentPage(1)}
            >
              Ilaqa/Zone
            </Link>
          )}
        </div>
        <input
          type="text"
          className="input input-bordered input-sm md:w-[30%] w-full"
          placeholder="Search"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {view === "maqam" && (
        <div className="w-full overflow-x-auto">
          <table className="table">
            <thead className="">
              <tr className="">
                <th className="border border-r-0 py-2 px-4 font-semibold text-gray-400">
                  Name
                </th>
                <th className="border border-r-0 border-l-0 text-start py-1 px-4 font-semibold text-gray-400">
                  Province
                </th>
                <th className="text-end border border-l-0 py-2 px-4 font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="">
              {paginatedData?.length > 0 ? (
                paginatedData?.map((maqam, index) => (
                  <tr
                    key={maqam?._id}
                    className="font-semibold border-r border-l"
                  >
                    <td className=" text-start font-medium md:text-sm text-xs leading-[16.94px]">
                      {maqam?.name}
                    </td>
                    <td className=" text-start font-medium md:text-sm text-xs leading-[16.94px]">
                      {maqam?.province?.name || "-"}
                    </td>
                    <td className="flex justify-end items-center gap-4 ">
                      <button
                        disabled={loading}
                        onClick={() => {
                          setEditMode(true);
                          setId(maqam?._id);
                          document
                            .getElementById("add_maqam_modal")
                            .showModal();
                          setForm({
                            province: maqam?.province?._id || "",
                            name: maqam?.name || "",
                          });
                        }}
                        className="text-green "
                      >
                        Edit
                      </button>
                      <input
                        type="checkbox"
                        className="toggle toggle-white bg-white [--tglbg:#E2E8F0] checked:[--tglbg:#002856]"
                        checked={maqam?.disabled}
                        onChange={() => {
                          handleDisable(maqam, !maqam?.disabled);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <div>No Report Found</div>
              )}
            </tbody>
          </table>
        </div>
      )}
      {view === "ilaqa" && (
        <div className="w-full overflow-x-auto">
          <table className="table">
            <thead className="">
              <tr className="">
                <th className="border border-r-0 py-2 px-4 font-semibold text-gray-400">
                  Name
                </th>
                <th className="border border-r-0 border-l-0 text-start py-1 px-4 font-semibold text-gray-400">
                  Area Details
                </th>
                <th className="text-end border border-l-0 py-2 px-4 font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData?.length > 0 ? (
                paginatedData?.map((ilaqa, index) => (
                  <tr
                    key={ilaqa?._id}
                    className="font-semibold border-r border-l"
                  >
                    <td className=" text-start font-medium md:text-sm text-xs leading-[16.94px]">
                      {ilaqa?.name}
                    </td>
                    <td className=" text-start font-medium md:text-sm text-xs leading-[16.94px]">
                      <div
                        onClick={() => {
                          getAreaDetails(ilaqa);
                        }}
                      >
                        <FaEye className="cursor-pointer text-lg" />
                      </div>
                    </td>
                    <td className="flex justify-end items-center gap-2 md:gap-4">
                      <button
                        disabled={loading}
                        onClick={() => {
                          setEditMode(true);
                          setId(ilaqa?._id);
                          document
                            .getElementById("add_ilaqa_modal")
                            .showModal();
                          setIlaqaForm({
                            maqam: ilaqa?.maqam?._id || "",
                            name: ilaqa?.name,
                          });
                        }}
                        className="text-green"
                      >
                        Edit
                      </button>
                      <input
                        type="checkbox"
                        className="toggle toggle-white bg-white [--tglbg:#E2E8F0] checked:[--tglbg:#002856]"
                        checked={ilaqa?.disabled}
                        onChange={() => {
                          handleDisable(ilaqa, !ilaqa?.disabled);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <div>No Report Found</div>
              )}
            </tbody>
          </table>
        </div>
      )}
      {view === "halqa" && (
        <div className="w-full overflow-x-auto">
          <table className="table">
            <thead className="">
              <tr className="">
                <th className="border border-r-0 py-2 px-4 font-semibold text-gray-400">
                  Name
                </th>
                <th className="border border-r-0 border-l-0 text-start py-1 px-4 font-semibold text-gray-400">
                  Area Details
                </th>
                <th className="text-end border border-l-0 py-2 px-4 font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData?.length > 0 ? (
                paginatedData
                  ?.filter(
                    (i) =>
                      i?.parentType === "Maqam" || i?.parentType === "Ilaqa"
                  )
                  ?.map((halqa, index) => (
                    <tr
                      key={halqa?._id}
                      className="font-semibold border-r border-l"
                    >
                      <td className=" text-start font-medium md:text-sm text-xs leading-[16.94px]">
                        {halqa?.name}
                      </td>
                      <td className=" text-center font-medium md:text-sm text-xs leading-[16.94px]">
                        <div
                          onClick={() => {
                            getAreaDetails(halqa, "halqa");
                          }}
                        >
                          <FaEye className="cursor-pointer text-lg" />
                        </div>
                      </td>
                      <td className="flex  justify-end  items-center gap-4">
                        <button
                          disabled={loading}
                          onClick={() => {
                            setEditMode(true);
                            setId(halqa?._id);
                            document
                              .getElementById("add_halqa_modal")
                              .showModal();
                            setFormHalqa({
                              parentId: halqa?.parentId?._id || "",
                              name: halqa?.name || "",
                              parentType: isIlaqa ? "Ilaqa" : "Maqam",
                            });
                          }}
                          className="text-green"
                        >
                          Edit
                        </button>
                        <input
                          type="checkbox"
                          className="toggle toggle-white bg-white [--tglbg:#E2E8F0] checked:[--tglbg:#002856]"
                          checked={halqa?.disabled}
                          onChange={() => {
                            handleDisable(halqa, !halqa?.disabled);
                          }}
                        />
                      </td>
                    </tr>
                  ))
              ) : (
                <div>No Report Found</div>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {value === "" && (
        <div className="flex w-full gap-4 px-4 justify-end items-center mt-4">
          {/* Pagination Controls */}
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

          <button
            className="rounded-full border-none w-7 h-7"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
          >
            <IoIosArrowBack
              className={`text-[1.5rem] rounded-full bg-gray-200 ${
                currentPage === 1 && "text-gray-400"
              }`}
            />
          </button>

          {/* Render Page Numbers */}
          <div className="flex items-center">
            <span
              className={`rounded-full text-bold text-sm ${
                currentPage === 1 && "border-2 border-gray-500"
              } mx-1 bg-white w-7 h-7 flex justify-center items-center text-[8px]`}
            >
              1
            </span>

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

          <button
            className="rounded-full border-none w-7 h-7"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            <IoIosArrowForward
              className={`text-[1.5rem] rounded-full bg-gray-200 ${
                currentPage === totalPages && "text-gray-400"
              }`}
            />
          </button>
        </div>
      )}

      <dialog id="add_maqam_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Maqam</h3>
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="text-base label-text">Province</span>
              </label>
              <select
                name="province"
                required
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
                className="w-full input input-bordered "
              >
                <option value="" disabled>
                  Select Province
                </option>
                {provinces
                  ?.filter((i) => !i?.disabled)
                  ?.map((i, index) => (
                    <option value={i?._id} key={index}>
                      {i?.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="label">
                <span className="text-base label-text">Maqam</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Enter_Maqam_Name"
                value={form.name}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.trim();
                  value = value.replace(/[^a-z0-9_]/g, "_");
                  setForm({ ...form, name: value });
                }}
                onKeyDown={handleKeyDown}
                className="w-full input input-bordered "
                required
              />
              {message && <p className="text-red-500">{message}</p>}
            </div>
          </div>
          <div className="modal-action">
            {editMode ? (
              <button
                disabled={loading}
                className="px-4 py-2 rounded-md bg-primary text-white capitalize "
                onClick={handleSubmitEdit}
              >
                Update
              </button>
            ) : (
              <button
                disabled={loading}
                className="px-4 py-2 rounded-md bg-primary text-white capitalize "
                onClick={handleSubmit}
              >
                Add
              </button>
            )}
            <form method="dialog">
              <button
                disabled={loading}
                id="close-maqam-modal"
                className="border px-4 py-2 rounded-md bg-none text-primary capitalize"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="add_ilaqa_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Ilaqa</h3>
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="text-base label-text">Maqam</span>
              </label>
              <select
                name="ilaqa"
                required
                value={ilaqaForm.maqam}
                onChange={(e) =>
                  setIlaqaForm({ ...ilaqaForm, maqam: e.target.value })
                }
                className="w-full input input-bordered "
              >
                <option value="" disabled>
                  Select Maqam
                </option>
                {maqams
                  ?.filter((i) => !i?.disabled)
                  ?.map((i, index) => (
                    <option value={i?._id} key={index}>
                      {i?.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="label">
                <span className="text-base label-text">Ilaqa</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Enter_Ilaqa_Name"
                value={ilaqaForm.name}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.trim();
                  value = value.replace(/[^a-z0-9_]/g, "_");
                  setIlaqaForm({ ...ilaqaForm, name: value });
                }}
                className="w-full input input-bordered "
                required
              />
              {message && <p className="text-red-500">{message}</p>}
            </div>
          </div>
          <div className="modal-action">
            {editMode ? (
              <button
                disabled={loading}
                className="px-4 py-2 rounded-md bg-primary text-white capitalize "
                onClick={handleSubmitEditIlaqa}
              >
                Update
              </button>
            ) : (
              <button
                disabled={loading}
                className="px-4 py-2 rounded-md bg-primary text-white capitalize "
                onClick={handleSubmitIlaqa}
              >
                Add
              </button>
            )}
            <form method="dialog">
              <button
                disabled={loading}
                id="close-maqam-modal"
                className="border px-4 py-2 rounded-md bg-none text-primary capitalize"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="add_halqa_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Halqa</h3>
          <div className="space-y-4">
            <div className="flex">
              {ilaqas?.length > 0 && (
                <label className="label cursor-pointer gap-3">
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio checked:bg-red-500"
                    checked={isIlaqa && formHalqa.parentType === "Ilaqa"}
                    onChange={() => {
                      setIsIlaqa(!isIlaqa);
                      setFormHalqa({
                        ...formHalqa,
                        parentType: "Ilaqa",
                        parentId: "",
                        unitType: "",
                        name: "",
                      });
                    }}
                  />
                  <span className="label-text">Ilaqa Halqa</span>
                </label>
              )}
              <label className="label cursor-pointer gap-3">
                <input
                  type="radio"
                  name="radio-10"
                  className="radio checked:bg-blue-500"
                  checked={!isIlaqa && formHalqa.parentType === "Maqam"}
                  onChange={() => {
                    setIsIlaqa(!isIlaqa);
                    setFormHalqa({
                      ...formHalqa,
                      parentType: "Maqam",
                      parentId: "",
                      unitType: "",
                      name: "",
                    });
                  }}
                />
                <span className="label-text">Maqam Halqa</span>
              </label>
            </div>
            {isIlaqa ? (
              <div>
                <label className="label">
                  <span className="text-base label-text">Ilaqa</span>
                </label>
                <select
                  name="maqam"
                  required
                  value={formHalqa.parentId}
                  onChange={(e) =>
                    setFormHalqa({ ...formHalqa, parentId: e.target.value })
                  }
                  className="w-full input input-bordered "
                >
                  <option value="" disabled>
                    Select Ilaqa
                  </option>
                  {ilaqas
                    ?.filter((i) => !i?.disabled)
                    .map((i, index) => (
                      <option value={i?._id} key={index}>
                        {i?.name}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="label">
                  <span className="text-base label-text">Maqam</span>
                </label>
                <select
                  name="maqam"
                  required
                  value={formHalqa.parentId}
                  onChange={(e) =>
                    setFormHalqa({ ...formHalqa, parentId: e.target.value })
                  }
                  className="w-full input input-bordered "
                >
                  <option value="" disabled>
                    Select Maqam
                  </option>
                  {maqams
                    ?.filter((i) => !i?.disabled)
                    ?.map((i, index) => (
                      <option value={i?._id} key={index}>
                        {i?.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
            <div>
              <label className="label">
                <span className="text-base label-text">Halqa Type</span>
              </label>
              <select
                className="select select-bordered w-full max-w-full"
                onChange={(e) => {
                  setFormHalqa({ ...formHalqa, unitType: e.target.value });
                }}
                value={formHalqa.unitType}
              >
                <option disabled value="">
                  Select Unit Type
                </option>
                <option value="Residential">Residential</option>
                <option value="Educational">Educational</option>
              </select>
            </div>
            <div>
              <label className="label">
                <span className="text-base label-text">Halqa</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Enter_Halqa_Name"
                value={formHalqa.name}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.trim();
                  value = value.replace(/[^a-z0-9_]/g, "_");
                  setFormHalqa({ ...formHalqa, name: value });
                }}
                className="w-full input input-bordered"
                required
                onKeyDown={handleKeyDown}
              />
              {message && <p className="text-red-500">{message}</p>}
            </div>
          </div>
          <div className="modal-action">
            {editMode ? (
              <button
                disabled={loading}
                className="px-4 py-2 rounded-md bg-primary text-white capitalize"
                onClick={handleSubmitHalqaEdit}
              >
                Update
              </button>
            ) : (
              <button
                disabled={loading}
                className="px-4 py-2 rounded-md bg-primary text-white capitalize"
                onClick={handleSubmitHalqa}
              >
                Add
              </button>
            )}
            <form method="dialog">
              <button
                disabled={loading}
                id="close-maqam-modal"
                className="border px-4 py-2 rounded-md bg-none text-primary capitalize"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="area_details" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-3">Details of the area</h3>
          <div className="w-full  flex flex-col justify-between items-start text-left gap-4  flex-wrap">
            <div className="w-full flex justify-start items-center gap-5">
              <h5>Name:</h5>
              <h4 className="text-gray-400 font-bold">{areaDetails?.name}</h4>
              <h4 className="text-gray-400 font-semibold">
                {areaDetails?.parentType === "Ilaqa" ||
                areaDetails?.parentType === "Tehsil" ||
                areaDetails?.parentType === "Division" ||
                areaDetails?.parentType === "Maqam"
                  ? "(Halqa)"
                  : !areaDetails?.parentId && areaDetails?.maqam
                  ? "(Ilaqa)"
                  : areaDetails?.country
                  ? "(Province)"
                  : `(${areaDetails?.areaType})`}
              </h4>
            </div>
            <div className="w-full flex justify-start items-center gap-5">
              {areaDetails?.parentType
                ? areaDetails?.parentType + ":"
                : areaDetails?.maqam
                ? "Maqam"
                : ""}
              <h4 className="text-gray-400 font-bold">
                {areaDetails?.parentType === "Ilaqa"
                  ? areaDetails?.parentId?.name
                  : areaDetails?.parentType === "Maqam"
                  ? areaDetails?.parentId?.name
                  : areaDetails?.parentType === "Tehsil"
                  ? areaDetails?.parentId?.name
                  : areaDetails?.parentType === "Division"
                  ? areaDetails?.parentId?.name
                  : areaDetails?.maqam?.name}
              </h4>
            </div>
            {(areaDetails?.parentType === "Tehsil" ||
              areaDetails?.parentType === "Division") && (
              <>
                <div className="w-full flex justify-start items-center gap-5">
                  <h5> District:</h5>
                  <h4 className="text-gray-400 font-bold">
                    {areaDetails?.parentId?.district
                      ? areaDetails?.parentId?.district?.name
                      : "Not a District aera"}
                  </h4>
                </div>
                <div className="w-full flex justify-start items-center gap-5">
                  <h5>Division:</h5>
                  <h4 className="text-gray-400 font-bold">
                    {areaDetails?.parentId?.district
                      ? areaDetails?.parentId?.district?.division?.name
                      : areaDetails?.division?.name}
                  </h4>
                </div>
              </>
            )}
            {areaDetails?.parentType === "Ilaqa" && (
              <div className="w-full flex justify-start items-center gap-5">
                <h5>Maqam:</h5>
                <h4 className="text-gray-400 font-bold">
                  {areaDetails?.parentType === "Ilaqa"
                    ? areaDetails?.parentId?.maqam?.name
                    : ""}
                </h4>
              </div>
            )}
            {!areaDetails?.country && (
              <div className="w-full flex justify-start items-center gap-5">
                <h4>Province:</h4>
                <h4 className="text-gray-400 font-bold">
                  {areaDetails?.parentType === "Ilaqa"
                    ? areaDetails?.parentId?.maqam?.province?.name
                    : areaDetails?.parentType === "Maqam"
                    ? areaDetails?.parentId?.province?.name
                    : areaDetails?.parentType === "Tehsil"
                    ? areaDetails?.parentId?.district?.division?.province?.name
                    : areaDetails?.parentType === "Division"
                    ? areaDetails?.parentId?.province?.name
                    : areaDetails?.province
                    ? areaDetails?.province?.name
                    : areaDetails?.maqam?.province?.name}
                </h4>
              </div>
            )}
            <div className="w-full flex justify-start items-center gap-5">
              <h5>Country:</h5>
              <h4 className="text-gray-400 font-bold">Pakistan</h4>
            </div>
          </div>
          <div className="modal-action w-full">
            <form method="dialog" className="w-full">
              <div className=" w-full flex justify-end gap-3 items-center">
                <button
                  id="close-details-modal"
                  className="border px-4 py-2 rounded-md bg-none text-primary capitalize"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
