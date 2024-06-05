import { useContext } from "react";
import { HalqaContext } from "../../context";

export const Library = () => {
  const halqa = useContext(HalqaContext);
  const totalHalqas = halqa;
  return (
    <div className="p-2 py-5 relative w-full overflow-auto">
      <h2 className="text-black py-3 text-lg">لائبریری</h2>
      <div className="flex-col lg:flex-row w-full items-center justify-start">
        <div className="flex py-2">
       <label className="block text-sm md:text-lg mb-2 lg:mb-0 p-2 ">
            کل تعداد لائبریریز:
          </label>
          <input
            // readOnly={true}
            type="number"
            defaultValue={totalHalqas?.length}
            required
            name="totalLibraries"
            id="totalLibraries"
            className="border-b-2 text-center border-dashed mb-2 lg:mb-0 max-w-[6rem] md:max-w-lg"
          />
        </div>
        <div className="flex py-2">
       <label className="block text-sm md:text-lg mb-2 lg:mb-0 p-2 ">
            کل تعدادکتب:
          </label>
          <input
            readOnly={true}
            type="number"
            defaultValue={0}
            required
            name="totalBooks"
            id="totalBooks"
            className="border-b-2 text-center border-dashed mb-2 lg:mb-0 max-w-[6rem] md:max-w-lg"
          />
        </div>
        <div className="flex py-2">
       <label className="block text-sm md:text-lg mb-2 lg:mb-0 p-2 ">
            اضافہ کتب:
          </label>
          <input
            readOnly={true}
            type="number"
            defaultValue={0}
            required
            name="totalIncrease"
            id="totalIncrease"
            className="border-b-2 text-center border-dashed mb-2 lg:mb-0 max-w-[6rem] md:max-w-lg"
          />
        </div>
        <div className="flex py-2">
       <label className="block text-sm md:text-lg mb-2 lg:mb-0 p-2 ">
            کمی کتب :
          </label>
          <input
            readOnly={true}
            type="number"
            defaultValue={0}
            required
            name="totalDecrease"
            id="totalDecrease"
            className="border-b-2 text-center border-dashed mb-2 lg:mb-0 max-w-[6rem] md:max-w-lg"
          />
        </div>
        <div className="flex py-2">
       <label className="block text-sm md:text-lg mb-2 lg:mb-0 p-2 ">
            کل اجرائے کتب:
          </label>
          <input
            readOnly={true}
            type="number"
            defaultValue={0}
            required
            name="totalBookRent"
            id="totalBookRent"
            className="border-b-2 text-center border-dashed mb-2 lg:mb-0 max-w-[6rem] md:max-w-lg"
          />
        </div>
      </div>
    </div>
  );
};
