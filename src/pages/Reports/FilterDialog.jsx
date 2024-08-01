import React, { useContext, useEffect, useState } from "react";
import { UIContext } from "../../context/ui";
import {
  DivisionContext,
  HalqaContext,
  IlaqaContext,
  MaqamContext,
  ProvinceContext,
  TehsilContext,
  useToastState,
} from "../../context";
import instance from "../../api/instrance";

export const FilterDialog = ({ setFilterAllData, tab ,setIsFilter}) => {
  const { active, setActive } = useContext(UIContext);

  // const [showNotification, setShowNotification] = useState(false);

  const [areas, setAreas] = useState([]);
  const [searchArea, setSearchArea] = useState("");
  const [userAreaType, setUserAreaType] = useState(active);
  const [selectedId, setSelectedId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const maqams = useContext(MaqamContext);
  const divisions = useContext(DivisionContext);
  const provinces = useContext(ProvinceContext);
  const halqas = useContext(HalqaContext);
  const ilaqas = useContext(IlaqaContext);
  const tehsils = useContext(TehsilContext);
  const { dispatch } = useToastState();
  
  const getAreaType = (area) => {
    
    if (area?.parentType === "Maqam") {
      const name = maqams?.find((i) => i?._id === area?.parentId);
      return `${name?.name}(Maqam)`;
    } else if (area?.parentType === "Tehsil") {
      const tehsil = tehsils?.find((i) => i._id === area.parentId);

      // const name = getDivisionByTehsil(tehsil, districts);
      return `${tehsil?.district?.division?.name}(Division)`;
    } else if (area?.parentType === "Ilaqa") {
      const ilaqa = ilaqas?.find((i) => i?._id === area?.parentId)?.name;
      
      return `${ilaqa}(Ilaqa)`;
    } else if (area?.province) {
      return maqams?.find((i) => i?._id === area?._id) ? "Maqam" : "Division";
    } else if (area?.name === "Pakistan") {
      return "";
    } else {
      return `${area?.maqam?.name}`;
    }
  };

  const getFilterData = async () => {
    try {
     
      const req = await instance.get(`/reports/${userAreaType ==="country" ? "markaz": userAreaType}/${selectedId}`, {
        params: { date: selectedMonth },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
          "Content-Type": "application/json",
        },
      });
 
      setFilterAllData([req?.data?.data]);
      dispatch({ type: "SUCCESS", payload: req.data?.message });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err?.response?.data?.message });
    }
  };
  const getAreaWithType = () => {
    switch (userAreaType) {
      case "province":
        setAreas(provinces);
        break;
      case "ilaqa":
        setAreas(ilaqas);
        break;
      case "division":
        setAreas(divisions);
        break;
        case "country":
        setAreas([{name: "Pakistan", _id: "66011a6296a6587786ad2e49"}]);
        break;
      case "maqam":
        setAreas(maqams);
        break;
      case "halqa":
        setAreas(
          halqas.filter((i) => {
            if (tab === "maqam") {
              return i?.parentType === "Maqam";
            } else if (tab === "division") {
              return i?.parentType === "Tehsil";
            } else if (tab === "ilaqa") {
              return i?.parentType === "Ilaqa";
            }
            return true;
          })
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (active) getAreaWithType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAreaType]);
  
  return (
    <div className="modal-box min-h-[300px]">
      <form method="dialog" className="mb-3">
        <button
          id="filter-area-dialog-close-btn"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => {
            setUserAreaType("");
            if (
              !document
                .getElementById("autocomplete-list")
                .classList.contains("hidden")
            ) {
              document
                .getElementById("autocomplete-list")
                .classList.add("hidden");
            }
          }}
        >
          ✕
        </button>
      </form>
      <div className="relative">
        <span className="px-1 py-1 block font-semibold w-[50%]">
          Select Area:
        </span>

        <div className="flex items-center gap-3 justify-start border border-primary p-2 rounded-lg mb-3">
          <div className="form-control">
            <label className="label cursor-pointer gap-2">
              <input
                type="radio"
                name="userAreaType"
                className="radio checked:bg-blue-500"
                value={active}
                checked={userAreaType === active}
                onChange={(e) => setUserAreaType(e.target.value)}
              />
              <span className="label-text">{active} </span>
            </label>
          </div>
        </div>

        <input type="hidden" name="userAreaId" id="userAreaId" />
        <input
          id="autocomplete"
          autoComplete="off"
          type="search"
          className="input input-bordered input-primary w-full"
          placeholder={`Select ${userAreaType}`}
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
          className="absolute z-10 hidden max-h-[100px] overflow-y-scroll bg-white border border-gray-300 w-full mt-1"
        >
          {userAreaType !== "" &&
            areas
              ?.sort((a, b) => a?.name?.localeCompare(b?.name))
              ?.filter((item) => {
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
                    document.getElementById("userAreaId").value = area?._id;
                    setSelectedId(area?._id);
                    document.getElementById("autocomplete").value = `${
                      area?.name
                    }${
                      userAreaType === "halqa"
                        ? ` - ${area?.parentId?.name} (${area?.parentType})`
                        : ""
                    }`;
                    document
                      .getElementById("autocomplete-list")
                      .classList.add("hidden");
                    if (
                      !document
                        .getElementById("autocomplete-list")
                        .classList.contains("hidden")
                    ) {
                      document
                        .getElementById("autocomplete-list")
                        .classList.add("hidden");
                    }
                  }}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  {area?.name}
                  {active ? "-" + getAreaType(area) : ""}
                </div>
              ))}
        </div>
        <input
          type="month"
          name="month"
          className="w-full mt-5 mb-5 input input-bordered input-primary"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
        <div className="w-full flex justify-end items-end">
          <button
            className="btn"
            onClick={() => {
              document.getElementById("filter-area-dialog-close-btn").click();
              getFilterData();
              setUserAreaType("");
              setIsFilter(true)
            }}
          >
            ok
          </button>
        </div>
      </div>
    </div>
  );
};
