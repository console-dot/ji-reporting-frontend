import React, { useContext, useEffect, useState } from "react";
import { MeContext, useToastState } from "../../context";
import { FaEdit, FaEye, FaPrint } from "react-icons/fa";
import moment from "moment";
import { NoReports, months } from "../Reports";
import { FilterDialog } from "./FilterDialog";
import { Link, useNavigate } from "react-router-dom";
import { UIContext } from "../../context/ui";
import instance from "../../api/instrance";
import { SearchPage } from "./SearchPage";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export const HalqaReports = () => {
  const [tab, setTab] = useState("maqam");
  const { setLoading } = useContext(UIContext);
  const { dispatch } = useToastState();
  const [search, showSearch] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("2023");
  const [isFilter, setIsFilter] = useState(false);
  const [filterAllData, setFilterAllData] = useState([]);
  const [data, setData] = useState([]);
  const me = useContext(MeContext);
  const [searchData, setSearchData] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [length, setLength] = useState(1);
  const [noReports, setNoReports] = useState(false);
  const itemsPerPage = 10;

  const getHalqaReportsTab = async (inset, offset, tab) => {
    setLoading(true);
    try {
      const req = await instance.get(
        `/reports/halqa?inset=${inset}&offset=${offset}&tab=${tab}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        }
      );

      setData([]);
      setFilterAllData([]);
      setData(req.data.data?.data);

      setLength(req.data.data.length);
    } catch (err) {
      console.log(err);
      dispatch({
        type: "ERROR",
        payload: err?.response?.data?.message || err?.message,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getHalqaReportsTab(0 * itemsPerPage, itemsPerPage, "maqam");
  }, []);

  const searchResults = async () => {
    showSearch(false);
    setLoading(true);

    if (year !== "" && month !== "") {
      try {
        setIsSearch(true);
        const req = await instance.get(
          `/reports/halqa?tab=${tab}&year=${year}&month=${month}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("@token")}`,
            },
          }
        );

        if (req) {
          setSearchData(req.data.data?.data);
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
    }
    setLoading(false);
  };

  const toggleSearch = () => {
    showSearch(!search);
  };

  const viewReport = async (id) => {
    navigate(`view/${id}`);
  };

  let totalPages = Math.ceil(length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);

      setTab(tab);
      getHalqaReportsTab((currentPage - 2) * itemsPerPage, itemsPerPage, tab);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);

      setTab(tab);
      getHalqaReportsTab(currentPage * itemsPerPage, itemsPerPage, tab);
    }
  };

  const tabClick = (tab1) => {
    if (tab !== tab1) {
      clearFilters();

      setTab(tab1);
      getHalqaReportsTab((currentPage - 1) * itemsPerPage, itemsPerPage, tab1);
    }
  };

  const handlePrint = (id) => {
    window.open(`halqa-report/print/${id}`, "blank");
  };

  const clearFilters = () => {
    setMonth("");
    setYear("2023");
    setIsSearch(false);
    setSearchData([])
    setIsFilter(false);
    setNoReports(false);
  };

  useEffect(() => {
    if (window) {
      if (window.innerWidth < 520) {
        setIsMobileView(true);
      }
    }
  }, [window.innerWidth]);

  return (
    <>
      <div
        role="tablist"
        className="w-full flex justify-between items-center mb-4"
      >
        <Link
          to={"?active=halqa&tab=maqam"}
          role="tab"
          className={`font-inter md:text-[14px] text-[12px] font-medium leading-[20px] text-left text-heading ${
            tab === "maqam" ? "text-slate-400 underline" : ""
          }`}
          onClick={() => tabClick("maqam")}
        >
          Maqam Halqa{" "}
        </Link>
        <Link
          to={"?active=halqa&tab=division"}
          role="tab"
          className={`font-inter md:text-[14px] text-[12px] font-medium leading-[20px] text-left text-heading ${
            tab === "division" ? "text-slate-400 underline" : ""
          }`}
          onClick={() => tabClick("division")}
        >
          Division Halqa{" "}
        </Link>
        <Link
          to={"?active=halqa&tab=ilaqa"}
          role="tab"
          className={`font-inter md:text-[14px] text-[12px] font-medium leading-[20px] text-left text-heading ${
            tab === "ilaqa" ? "text-slate-400 underline" : ""
          }`}
          onClick={() => tabClick("ilaqa")}
        >
          Ilaqa Halqa{" "}
        </Link>
      </div>
      <div className="md:join xs:w-full mb-4 flex justify-between items-center">
        {!isMobileView && (
          <div className="w-full flex">
            <select
              className="select select-bordered select-sm join-item"
              onChange={(e) => setMonth(e.target.value)}
              value={month}
            >
              <option value={""}>Month</option>
              {months.map((month, index) => (
                <option value={month?.value} key={index}>
                  {month.title}
                </option>
              ))}
            </select>
            <select
              className="select select-bordered select-sm join-item"
              onChange={(e) => setYear(e.target.value)}
              value={year}
            >
              <option disabled value={""}>
                Year
              </option>
              {Array(10)
                .fill(1)
                .map((_, index) => (
                  <option key={index} value={2023 + index}>
                    {2023 + index}
                  </option>
                ))}
            </select>
          </div>
        )}
        {search && (
          <div className="fixed p-3 z-40 rounded-lg top-[140px] left-[5px] w-[calc(100%-10px)] overflow-hidden bg-white min-h-[100px] border">
            <div className="flex flex-col gap-3">
              <div className="w-full flex flex-col">
                {isMobileView && (
                  <div className="w-full flex justify-end items-center ">
                    <button
                      className="btn-square"
                      onClick={() => showSearch(false)}
                    >
                      ✕
                    </button>
                  </div>
                )}
                <select
                  className="select select-bordered select-sm w-full rounded-none rounded-tl-lg rounded-tr-lg"
                  onChange={(e) => setMonth(e.target.value)}
                  value={month}
                >
                  <option value={""}>Month</option>
                  {months.map((month, index) => (
                    <option value={month?.value} key={index}>
                      {month.title}
                    </option>
                  ))}
                </select>
                <select
                  className="select select-bordered select-sm w-full rounded-none rounded-bl-lg rounded-br-lg"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value={""} disabled>
                    Year
                  </option>
                  {Array(10)
                    .fill(1)
                    .map((_, index) => (
                      <option key={index} value={2023 + index}>
                        {2023 + index}
                      </option>
                    ))}
                </select>
              </div>
              <button
                className="font-inter px-2 text-[14px] bg-primary flex justify-center text-white p-[6px] mb-1 rounded font-medium leading-[20px] text-left"
                onClick={searchResults}
              >
                Search
              </button>
            </div>
          </div>
        )}

        <div className="indicator flex items-center justify-end w-full">
          <button
            className={`font-inter px-2 bg-primary flex justify-center text-white p-1 md:p-[6px] text-[12px] md:text-[14px] mb-1 rounded font-medium leading-[20px] text-left ${
              !isMobileView ? "join-item" : ""
            }`}
            onClick={() => (!isMobileView ? searchResults() : toggleSearch())}
          >
            Search
          </button>
          {me?.userAreaType !== "Halqa" && (
            <button
              onClick={() => {
                document.getElementById("filter-area-dialog").showModal();
                setIsSearch(false);
              }}
              className={`font-inter px-2 bg-primary flex justify-center text-white p-1 md:p-[6px] text-[12px] md:text-[14px] mb-1 rounded font-medium leading-[20px] text-left ${
                !isMobileView ? "join-item" : "ms-3"
              }`}
            >
              filter
            </button>
          )}
          <button
            className={`font-inter px-2 bg-primary flex justify-center text-white p-1 md:p-[6px] text-[12px] md:text-[14px] mb-1 rounded font-medium leading-[20px] text-left ${
              !isMobileView ? "join-item" : "ms-3"
            }`}
            onClick={clearFilters}
          >
            Clear
          </button>
        </div>
      </div>

      {!isSearch && !isFilter ? (
        <>
          {data?.length > 0 ? (
            <div className="overflow-scroll">
              <table className="table mb-7 w-full">
                {/* Head */}
                <thead>
                  <tr>
                    <th className="text-left">Report</th>
                    <th className="text-left">Last modified</th>
                    <th className="text-left">Month</th>
                    <th className="md:block hidden"></th>
                    <th className="md:block hidden"></th>
                    <th className="text-left">Action</th>
                  </tr>
                </thead>
                {/* Body */}
                <tbody>
                  {data
                    ?.filter((i) =>
                      tab === "division"
                        ? i.halqaAreaId?.parentType === "Tehsil" ||
                          i.halqaAreaId?.parentType === "Division"
                        : i.halqaAreaId?.parentType ===
                          tab.charAt(0).toUpperCase() + tab.slice(1)
                    )
                    ?.map((p, index) => (
                      <tr key={index}>
                        <td>
                          <span className="font-medium md:text-sm text-xs leading-[16.94px] text-left font-inter text-heading">
                            {p?.halqaAreaId?.name + " "}
                          </span>
                        </td>
                        <td>
                          <span className="font-medium md:text-sm text-xs leading-[16.94px] text-left font-inter text-heading">
                            {moment(p?.updatedAt).fromNow()}
                          </span>
                        </td>
                        <td>
                          <span className="font-medium md:text-sm text-xs leading-[16.94px] text-left font-inter text-heading">
                            {moment(p?.month).format("MMMM YYYY")}
                          </span>
                        </td>
                        <td className="md:block hidden"></td>
                        <td className="md:block hidden"></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span
                              onClick={() => viewReport(p?._id)}
                              className="cursor-pointer font-inter md:text-sm text-xs font-medium leading-[16.94px] text-left"
                            >
                              View
                            </span>
                            {me?.userAreaType === "Halqa" && (
                              <span
                                onClick={() =>
                                  navigate(`/reports/edit/${p._id}`)
                                }
                                className="cursor-pointer font-inter text-[14px] font-medium leading-[16.94px] text-left text-green"
                              >
                                Edit
                              </span>
                            )}
                            <span
                              onClick={() => handlePrint(p?._id)}
                              className="cursor-pointer font-inter text-[14px] font-medium leading-[16.94px] text-left text-blue"
                            >
                              Print
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <NoReports />
          )}
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
              onClick={handlePrevPage}
            >
              <IoIosArrowBack
                className={`text-[1.5rem] rounded-full bg-gray-200 ${
                  currentPage === 1 && "text-gray-400"
                }`}
              />
            </button>

            {/* Page Numbers */}
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
              {totalPages && currentPage > 2 && currentPage < totalPages ? (
                <span
                  className={`rounded-full text-bold text-sm ${
                    currentPage !== totalPages && "border-2 border-gray-500"
                  } mx-1 bg-white w-7 h-7 flex justify-center items-center text-[8px]`}
                >
                  {currentPage}
                </span>
              ) : (
                <span></span>
              )}
              {totalPages && totalPages > 2 ? (
                <span
                  className={`rounded-full text-bold text-sm ${
                    currentPage === totalPages && "border-2 border-gray-500"
                  } mx-1 bg-white w-7 h-7 flex justify-center items-center text-[8px]`}
                >
                  {totalPages}
                </span>
              ) : (
                <span></span>
              )}
            </div>

            {/* Next Button */}
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
        </>
      ) : (
        <SearchPage
          data={isSearch ? searchData : filterAllData}
          area={"halqa"}
        />
      )}

      <dialog id="filter-area-dialog" className="modal">
        <FilterDialog
          setFilterAllData={setFilterAllData}
          tab={tab}
          setIsFilter={setIsFilter}
          setNoReports={setNoReports}
          setSearchData={setSearchData}
          setIsSearch={setIsSearch}
        />
      </dialog>
    </>
  );
};
