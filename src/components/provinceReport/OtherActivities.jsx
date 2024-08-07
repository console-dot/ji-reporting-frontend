import { sumUpTwoValues } from "../muntakhibMaqamReports";

export const OtherActivities = ({ view, compile }) => {
  return (
    <div className=" py-5 relative w-full overflow-auto">
      <h2 className="text-black py-3 text-lg">دیگر سرگرمیاں</h2>
      <div className="flex flex-col py-2">
        <h2 className="block text-black py-3 text-lg"> تربیت گاہ:</h2>
        <div className="flex py-2">
          <label className="block text-sm md:text-lg">تربیت گاہ:</label>
          <input
            readOnly={view}
            type="number"
            required
            name={`tarbiyatGaah`}
            id={`tarbiyatGaah`}
            className="border-b-2 text-center border-dashed mb-2 lg:mb-0 max-w-[6rem] md:max-w-lg"
          />
        </div>
        <div className="flex md:flex-row flex-col w-full gap-1 md:gap-3 pb-2">
          <label className="block md:w-[20%] w-full text-sm md:text-lg mb-0 pt-2">
            تربیت گاہوں کے انعقاد کا ہدف:
          </label>
          <div className="w-full md:w-[80%] flex overflow-hidden overflow-x-scroll">
            {compile ? (
              <input
                readOnly={view}
                type="number"
                required
                name={`tarbiyatGaahGoalSum`}
                id={`tarbiyatGaahGoalSum`}
                className="border-b-2 text-center border-dashed mb-2 lg:mb-0 max-w-[6rem] md:max-w-lg"
              />
            ) : (
              <>
                <input
                  readOnly={view}
                  type="number"
                  required
                  name={`tarbiyatGaahGoal`}
                  id={`tarbiyatGaahGoal`}
                  onChange={() =>
                    sumUpTwoValues(
                      parseInt(
                        document.getElementById("tarbiyatGaahGoal").value
                      ),
                      parseInt(
                        document.getElementById("tarbiyatGaahGoalManual").value
                      ),
                      "tarbiyatGaahGoalSum"
                    )
                  }
                  className="border-b-2 text-center border-dashed mb-2 lg:mb-0 max-w-[6rem] md:max-w-lg"
                />
                +
                <input
                  readOnly={view}
                  type="number"
                  required
                  onChange={() =>
                    sumUpTwoValues(
                      parseInt(
                        document.getElementById("tarbiyatGaahGoal").value
                      ),
                      parseInt(
                        document.getElementById("tarbiyatGaahGoalManual").value
                      ),
                      "tarbiyatGaahGoalSum"
                    )
                  }
                  name={`tarbiyatGaahGoalManual`}
                  id={`tarbiyatGaahGoalManual`}
                  className="border-b-2 text-center border-dashed mb-2 lg:mb-0 max-w-[6rem] md:max-w-lg"
                />
                =
                <input
                  readOnly={true}
                  type="number"
                  required
                  name={`tarbiyatGaahGoalSum`}
                  id={`tarbiyatGaahGoalSum`}
                  className="border-b-2 text-center border-dashed mb-2 lg:mb-0 max-w-[6rem] md:max-w-lg"
                />{" "}
              </>
            )}
          </div>
        </div>
        <div className="flex py-2">
          <label className="block text-sm md:text-lg">تنظیمی دورہ:</label>
          <input
            readOnly={view}
            type="number"
            name="tanzeemiRound"
            id="tanzeemiRound"
            className="border-b-2 text-center border-dashed mb-2 lg:mb-0"
            required
          />
        </div>
        <div className="flex md:flex-row flex-col w-full gap-1 md:gap-3 pb-2">
          <label className="block md:w-[20%] w-full text-sm md:text-lg mb-0 pt-2">
            تربیت گاہوں کے انعقاد کا تعداد:
          </label>
          <div className="w-full md:w-[80%] flex overflow-hidden overflow-x-scroll">
            {compile ? (
              <input
                readOnly={view}
                type="number"
                required
                name={`tarbiyatGaahHeldSum`}
                id={`tarbiyatGaahHeldSum`}
                className="border-b-2 text-center border-dashed mb-2 lg:mb-0 max-w-[6rem] md:max-w-lg"
              />
            ) : (
              <>
                <input
                  readOnly={view}
                  type="number"
                  required
                  name={`tarbiyatGaahHeld`}
                  id={`tarbiyatGaahHeld`}
                  className="border-b-2 text-center border-dashed mb-2 lg:mb-0 max-w-[6rem] md:max-w-lg"
                  onChange={() =>
                    sumUpTwoValues(
                      parseInt(
                        document.getElementById("tarbiyatGaahHeld").value
                      ),
                      parseInt(
                        document.getElementById("tarbiyatGaahHeldManual").value
                      ),
                      "tarbiyatGaahHeldSum"
                    )
                  }
                />
                +
                <input
                  readOnly={view}
                  type="number"
                  required
                  onChange={() =>
                    sumUpTwoValues(
                      parseInt(
                        document.getElementById("tarbiyatGaahHeld").value
                      ),
                      parseInt(
                        document.getElementById("tarbiyatGaahHeldManual").value
                      ),
                      "tarbiyatGaahHeldSum"
                    )
                  }
                  name={`tarbiyatGaahHeldManual`}
                  id={`tarbiyatGaahHeldManual`}
                  className="border-b-2 text-center border-dashed mb-2 lg:mb-0 max-w-[6rem] md:max-w-lg"
                />
                =
                <input
                  readOnly={true}
                  type="number"
                  required
                  name={`tarbiyatGaahHeldSum`}
                  id={`tarbiyatGaahHeldSum`}
                  className="border-b-2 text-center border-dashed mb-2 lg:mb-0 max-w-[6rem] md:max-w-lg"
                />{" "}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex-col lg:flex-row w-full items-center justify-start">
        <div className="flex py-2">
          <label className="block text-sm md:text-lg">دعوتی وفود:</label>
          <input
            readOnly={true}
            type="number"
            required
            name="dawatiWafud"
            id="dawatiWafud"
            className="border-b-2 text-center border-dashed mb-2 lg:mb-0"
          />
        </div>
        <div className="flex py-2">
          <label className="block text-sm md:text-lg">روابط پارٹیز:</label>
          <input
            readOnly={true}
            type="number"
            required
            name="rawabitParties"
            id="rawabitParties"
            className="border-b-2 text-center border-dashed mb-2 lg:mb-0"
          />
        </div>
        <div className="flex py-2">
          <label className="block text-sm md:text-lg">شب بیداری:</label>
          <input
            readOnly={true}
            type="number"
            required
            name="shabBedari"
            id="shabBedari"
            className="border-b-2 text-center border-dashed mb-2 lg:mb-0"
          />
        </div>
        <div className="flex py-2">
          <label className="block text-sm md:text-lg">نظام الصلوٰۃ:</label>
          <input
            readOnly={true}
            type="number"
            required
            name="nizamSalah"
            id="nizamSalah"
            className="border-b-2 text-center border-dashed mb-2 lg:mb-0"
          />
        </div>

        <div className="flex py-2">
          <label className="block text-sm md:text-lg">کوئ اور سرگرمی:</label>
          <input
            readOnly={view}
            type="text"
            required
            name="anyOther"
            id="anyOther"
            className="border-b-2 border-dashed"
          />
        </div>
      </div>
    </div>
  );
};
