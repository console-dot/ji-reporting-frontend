import React from "react";
import { InputWithLabel } from "../../InputWithLabel";
const rbt1 = [
  {
    title: "نام",
    type: "text",
    key: "rbt1-name",
  },
  {
    title: "موبائل نمبر",
    type: "text",
    key: "rbt1-mobile",
  },
  {
    title: "اس ماہ اس ربط سے کتنی ملاقاتیں کیں",
    type: "text",
    key: "rbt1-totalVisitings",
  },

  {
    title: "اس ماہ کون سی کتابیں اس ماہ کون سی سورۃکی تفسیر پڑھائ",
    type: "text",
    key: "rbt1-readBooks",
  },
  {
    title: "اس ماہ کون سی سورۃکی تفسیر اس ماہ کون سی سورۃکی تفسیر پڑھائ",
    type: "text",
    key: "rbt1-tafseers",
  },
  {
    title: "اس ماہ کون سی سورۃحفظ کروائ",
    type: "text",
    key: "rbt1-surahHifz",
  },
];
export const Rawabit1 = ({ view }) => {
  return (
    <div>
      <h2 className="block w-full text-center font-bold mb-3">ربط نمبر۱</h2>
      <div className=" w-full  lg:flex md:flex-row sm:flex-col mb-4 gap-2">
        <div className="w-full md:pr-0 mb-2 flex flex-col flex-wrap">
          {rbt1.map((obj, index) => (
            <InputWithLabel
              key={index}
              readOnly={view}
              placeholder={"Type..|"}
              label={obj.title}
              id={obj?.key}
              name={obj?.key}
              type={obj?.type}
            />
          ))}
        </div>
      </div>
      <InputWithLabel
        // readOnly={view}
        placeholder={"..."}
        label={"اس ماہ نمازوں کی صورتحال کیسی رھی"}
        id={"namazCondition"}
        name={"namazCondition"}
        type={"textarea"}
      />
    </div>
  );
};