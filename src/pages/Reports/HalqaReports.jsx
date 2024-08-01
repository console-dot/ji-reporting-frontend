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
  const itemsPerPage = 10;

  const getHalqaReportsTab = async (inset, offset, tab) => {
    if (tab) {
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

        if (req) {
          setData(req.data.data?.data || []);
          setLength(req.data.data.length);
        }
      } catch (err) {
        console.log(err);
        dispatch({
          type: "ERROR",
          payload: err?.response?.data?.message || err?.message,
        });
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    getHalqaReportsTab(0 * itemsPerPage, itemsPerPage, "maqam");
  }, []);

  const searchResults = async () => {
    showSearch(false);
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
          setSearchData(req.data.data?.data || []);
        }
      } catch (err) {
        console.log(err);
        dispatch({
          type: "ERROR",
          payload: err?.response?.data?.message || err?.message,
        });
      }
    }
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
      setData([]);
      setTab(tab);
      getHalqaReportsTab((currentPage - 2) * itemsPerPage, itemsPerPage, tab);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setData([]);
      setTab(tab);
      getHalqaReportsTab(currentPage * itemsPerPage, itemsPerPage, tab);
    }
  };

  const tabClick = (tab) => {
    clearFilters();
    setData([]);
    setTab(tab);
    getHalqaReportsTab((currentPage - 1) * itemsPerPage, itemsPerPage, tab);
  };

  const handlePrint = (id) => {
    window.open(`halqa-report/print/${id}`, "blank");
  };

  const clearFilters = () => {
    setMonth("");
    setYear("2023");
    getHalqaReportsTab(0, 10, tab);
    setIsSearch(false);
    setIsFilter(false);
    setFilterAllData([]);
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
          className={` flex justify-center items-center w-full ${
            tab === "maqam" ? "text-slate-400 underline" : ""
          }`}
          onClick={() => tabClick("maqam")}
        >
          مقام حلقہ
        </Link>
        <Link
          to={"?active=halqa&tab=division"}
          role="tab"
          className={` flex justify-center items-center w-full ${
            tab === "division" ? "text-slate-400 underline" : ""
          }`}
          onClick={() => tabClick("division")}
        >
          ڈویژن حلقہ
        </Link>
        <Link
          to={"?active=halqa&tab=ilaqa"}
          role="tab"
          className={` flex justify-center items-center w-full ${
            tab === "ilaqa" ? "text-slate-400 underline" : ""
          }`}
          onClick={() => tabClick("ilaqa")}
        >
          علاقہ حلقہ
        </Link>
      </div>
      <div className="md:join xs:w-full mb-4 flex justify-between items-center">
        {!isMobileView && (
          <div className="w-full">
            <select
              className="select select-bordered join-item"
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
              className="select select-bordered join-item"
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
                  className="select select-bordered w-full rounded-none rounded-tl-lg rounded-tr-lg"
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
                  className="select select-bordered w-full rounded-none rounded-bl-lg rounded-br-lg"
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
              <button className="btn" onClick={searchResults}>
                Search
              </button>
            </div>
          </div>
        )}

        <div className="indicator flex justify-between items-center w-full">
          <button
            className={`btn ${!isMobileView ? "join-item" : ""}`}
            onClick={() => (!isMobileView ? searchResults() : toggleSearch())}
          >
            Search
          </button>
          {me?.userAreaType !== "Halqa" && (
            <button
              onClick={() => {
                setFilterAllData([]);
                document.getElementById("filter-area-dialog").showModal();
                setIsSearch(false);
              }}
              className={`btn ${!isMobileView ? "join-item" : "ms-3"}`}
            >
              filter
            </button>
          )}
          <button
            className={`btn ${!isMobileView ? "join-item" : "ms-3"}`}
            onClick={clearFilters}
          >
            Clear
          </button>
        </div>
      </div>

      {!isSearch && !isFilter ? (
        <>
          {data?.length > 0 ? (
            data
              ?.filter((i) =>
                tab === "division"
                  ? i.halqaAreaId?.parentType === "Tehsil"
                  : i.halqaAreaId?.parentType ===
                    tab.charAt(0).toUpperCase() + tab.slice(1)
              )
              ?.map((p) => (
                <div
                  key={p?._id}
                  className="card-body flex items-between justify-between w-full p-2 md:p-5 mb-1 bg-blue-300 rounded-xl lg:flex-row md:flex-row sm:flex-col"
                >
                  <div className="flex w-full flex-col items-start justify-center">
                    <span className="text-sm lg:text-lg font-semibold">
                      {p?.halqaAreaId?.name + " "}
                      {moment(p?.month).format("MMMM YYYY")}
                    </span>
                    <span>Last Modified: {moment(p?.updatedAt).fromNow()}</span>
                  </div>
                  <div className="flex items-end w-full justify-end gap-3 ">
                    <button className="btn" onClick={() => viewReport(p?._id)}>
                      <FaEye />
                    </button>

                    <button className="btn" onClick={() => handlePrint(p?._id)}>
                      <FaPrint />
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <NoReports />
          )}
          <div className="flex justify-between mt-4">
            <button
              className="btn"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <SearchPage data={isSearch ? searchData : filterAllData} area={"halqa"} />
      )}

      <dialog id="filter-area-dialog" className="modal">
        <FilterDialog
          setFilterAllData={setFilterAllData}
          tab={tab}
          setIsFilter={setIsFilter}
        />
      </dialog>
    </>
  );
};
