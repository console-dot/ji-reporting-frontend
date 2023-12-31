import React from "react";
import { InputWithLabel } from "../InputWithLabel";

export const ZailiActivitesMaqam = ({ view }) => {
  const headings = ["", "طﮯﺷدھ", "ﻣﻧﻌﻘدھ", "اوﺳط ﺣﺎﺿری"];
  const rows = [
    {
      key: "ijtRafaqa",
      label: "اجتماع رفقا",
    },
    {
      key: "studyCircleMentioned",
      label: " سٹڈی سرکل",
    },
    { key: "ijtKarkunan", label: "اﺟﺗﻣﻊ ﮐﺎرﮐﻧﺎن" },
    { key: "darseQuran", label: "درس قرآن " },
    { key: "shaheenMeeting", label: " شاہین میٹنگ" },
    { key: "paighamEvent", label: "پیغام محفل" },
  ];
  return (
    <div className="w-full max-w-full overflow-x-scroll " dir="rtl">
      <fieldset className="border p-3">
        <legend className="text-xl font-bold">زﯾﻠﯽ طﮯ ﺷدھ ﺳرﮔرﻣﯾﺎں</legend>
        <table className="w-full table">
          <thead>
            <tr className="flex w-full items-start justify-between bg-gray-100">
              {headings.map((heading, index) => (
                <th
                  className="w-[10rem] text-start text-lg sm:text-sm"
                  key={index}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                className="flex w-full items-center justify-between bg-gray-100"
                key={index}
              >
                <td className="flex flex-row w-full ">{row.label}</td>
                <td className="flex flex-row w-full">
                  <InputWithLabel
                    readOnly={view}
                    label={""}
                    type={"number"}
                    name={`${row.key}-start`}
                    id={`${row.key}-start`}
                  />
                </td>
                <td className="flex flex-row w-full">
                  <InputWithLabel
                    readOnly={view}
                    label={""}
                    type={"number"}
                    name={`${row.key}-increase`}
                    id={`${row.key}-increase`}
                  />
                </td>
                <td className="flex flex-row w-full">
                  <InputWithLabel
                    readOnly={view}
                    label={""}
                    type={"number"}
                    name={`${row.key}-decrease`}
                    id={`${row.key}-decrease`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </fieldset>
    </div>
  );
};
