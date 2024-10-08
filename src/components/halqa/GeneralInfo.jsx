import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function GeneralInfo({ me, area, view, newMonth, setMonth, name }) {
  const [date, setDate] = useState("");
  const [areaName, setAreaName] = useState("");
  const location = useLocation();
  const l = location.pathname?.split("/")[2];

  useEffect(() => {
    if (l !== "view") {
      setAreaName(me?.userAreaId?.name);
    } else {
      setAreaName(name);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, l, view, me]);

  const setDateFn = () => {
    if (l !== "view") {
      const date0 = new Date();
      date0.setMonth(date0.getMonth() - 1);
      setDate(
        `${date0.getFullYear()}-${
          date0.getMonth() > 9
            ? date0.getMonth() + 1
            : "0".toString() + (date0.getMonth() + 1).toString()
        }`
      );
      setMonth &&
        setMonth(
          `${date0.getFullYear()}-${
            date0.getMonth() > 9
              ? date0.getMonth() + 1
              : "0".toString() + (date0.getMonth() + 1).toString()
          }`
        );
    }
  };
  useEffect(() => {
    setDateFn();
  }, [view]);
  return (
    <div className="grid w-full grid-cols-1 lg:grid-cols-2">
      <div className="flex justify-start items-center gap-2 w-full p-2">
        <label
          htmlFor="halqa_name"
          className="block text-sm md:text-lg"
        >{`${area} کا نام`}</label>
        <input
          required
          className="border-b-2 border-dashed"
          type="text"
          name="name"
          id="name"
          readOnly
          value={areaName}
        />
      </div>
      {!newMonth ? (
        <div className="flex justify-start items-center gap-2 w-full p-2">
          <label htmlFor="month" className="block text-sm md:text-lg">
            برائے ماہ
          </label>
          <input
            required
            className="border-b-2 border-dashed"
            type="month"
            name="month"
            id="month"
            readOnly
            value={date}
          />
        </div>
      ) : (
        <div className="flex justify-start items-center gap-2 w-full p-2">
          <label htmlFor="month" className="block text-sm md:text-lg">
            برائے ماہ
          </label>
          <input
            required
            className="border-b-2 border-dashed"
            type="text"
            value={newMonth.split("T")[0]}
            disabled
          />
        </div>
      )}
    </div>
  );
}
