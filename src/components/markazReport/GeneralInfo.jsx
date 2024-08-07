import { useEffect, useState } from "react";

export function GeneralInfo({ me, area, view, newMonth, setMonth }) {
  const [date, setDate] = useState("");
  useEffect(() => {
    if (me && !view) {
      if (document.getElementById("name")) {
        document.getElementById("name").value = me?.userAreaId?.name;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);
  const setDateFn = () => {
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
  };
  useEffect(() => {
    setDateFn();
  }, []);
  return (
    <div className=" w-full flex justify-center items-center ">
      
      {!newMonth ? (
        <div className="flex justify-center items-center gap-2 w-full p-2">
          <label htmlFor="month">برائے ماہ</label>
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
          <label htmlFor="month">برائے ماہ</label>
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
