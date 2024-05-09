export const maqamRawabitDecided = () => {
  const elem = document.getElementById("rawabitDecided");
  const rwbMeetings = document.getElementById("rwabitMeetingsGoal");
  const arS = document.getElementById("arkan-start")?.value;
  const arI = document.getElementById("arkan-increase")?.value;
  const arD = document.getElementById("arkan-decrease")?.value;
  const totalArkaan = parseInt(arS) + parseInt(arI) - parseInt(arD);
  const umS = document.getElementById("umeedWaran-start")?.value;
  const umI = document.getElementById("umeedWaran-increase")?.value;
  const umD = document.getElementById("umeedWaran-decrease")?.value;
  const totalUmeedwaran = parseInt(umS) + parseInt(umI) - parseInt(umD);
  const raS = document.getElementById("rafaqa-start")?.value;
  const raI = document.getElementById("rafaqa-increase")?.value;
  const raD = document.getElementById("rafaqa-decrease")?.value;
  const totalRafaqa = parseInt(raS) + parseInt(raI) - parseInt(raD);
  if (elem) {
    const value = totalArkaan + (totalUmeedwaran * 3 + totalRafaqa * 2);
    elem.value = value;
    if (rwbMeetings) {
      const valueRawabitMeetings = value * 3;
      rwbMeetings.value = valueRawabitMeetings;
    }
  }
};
export const ToseeDawat = ({ view }) => {
  return (
    <div className="p-2 py-5 relative w-full overflow-auto">
      <h2 className="text-black py-3 text-lg">توسیع دعوت</h2>
      <div className="flex flex-col  w-full items-start justify-start">
        <div className="flex py-2">
          <h3 className="block ml-28 font-bold">روابط:</h3>
        </div>
        <div className="flex py-2">
          <label className="block">طے شدہ:</label>
          <input
            readOnly={true}
            type="number"
            defaultValue={0}
            required
            name="rawabitDecided"
            id="rawabitDecided"
            className="border-b-2 text-center border-dashed"
          />
        </div>
        <div className="flex py-2">
          <label className="block">روابط سےملاقاتوں کاہدف:</label>
          <input
            readOnly={true}
            type="number"
            defaultValue={0}
            required
            name="rwabitMeetingsGoal"
            id="rwabitMeetingsGoal"
            className="border-b-2 text-center border-dashed"
          />
        </div>
        <div style={{ display: "flex" }}>
          <label className="block">موجود:</label>
          <input
            readOnly={true}
            type="number"
            defaultValue={0}
            required
            name={`uploadedCurrent`}
            id={`uploadedCurrent`}
            className="border-b-2 text-center border-dashed "
          />
          +
          <input
            type="number"
            defaultValue={0}
            required
            readOnly={view}
            name={`manualCurrent`}
            id={`manualCurrent`}
            className="border-b-2 text-center border-dashed "
            oninput="calculateSum()"
          />
          =
          <input
            readOnly={true}
            type="number"
            defaultValue={
              parseInt(document.getElementById("uploadedCurrent")?.value) +
              parseInt(document.getElementById("manualCurrent")?.value)
            }
            required
            name={`currentSum`}
            id={`currentSum`}
            className="border-b-2 text-center border-dashed "
          />
        </div>
        <div style={{ display: "flex" }}>
          <label className="block">ملاقاتیں:</label>
          <input
            readOnly={true}
            type="number"
            defaultValue={0}
            required
            name={`uploadedMeetings`}
            id={`uploadedMeetings`}
            className="border-b-2 text-center border-dashed "
          />
          +
          <input
            type="number"
            defaultValue={0}
            required
            readOnly={view}
            name={`manualMeetings`}
            id={`manualMeetings`}
            className="border-b-2 text-center border-dashed "
            oninput="calculateSum()"
          />
          =
          <input
            readOnly={true}
            type="number"
            defaultValue={
              parseInt(document.getElementById("uploadedMeetings")?.value) +
              parseInt(document.getElementById("manualMeetings")?.value)
            }
            required
            name={`meetingsSum`}
            id={`meetingsSum`}
            className="border-b-2 text-center border-dashed "
          />
        </div>
        <div style={{ display: "flex" }}>
          <label className="block">تقسیم لٹریچر:</label>
          <input
            readOnly={true}
            type="number"
            defaultValue={0}
            required
            name={`uploadedLitrature`}
            id={`uploadedLitrature`}
            className="border-b-2 text-center border-dashed "
          />
          +
          <input
            type="number"
            defaultValue={0}
            required
            readOnly={view}
            name={`manualLitrature`}
            id={`manualLitrature`}
            className="border-b-2 text-center border-dashed "
            oninput="calculateSum()"
          />
          =
          <input
            readOnly={true}
            type="number"
            defaultValue={
              parseInt(document.getElementById("uploadedLitrature")?.value) +
              parseInt(document.getElementById("manualLitrature")?.value)
            }
            required
            name={`literatureSum`}
            id={`literatureSum`}
            className="border-b-2 text-center border-dashed "
          />
        </div>
      </div>
      <div className="flex flex-col w-full items-start justify-start">
        <div className="flex py-2 me-5">
          <label className="block ml-16 font-bold">عام طلبہ:</label>
        </div>
        <div style={{ display: "flex" }}>
          <label className="block">تقسیم لٹریچر:</label>
          <input
            readOnly={true}
            type="number"
            defaultValue={0}
            required
            name={`uploadedCommonLiteratureDistribution`}
            id={`uploadedCommonLiteratureDistribution`}
            className="border-b-2 text-center border-dashed "
          />
          +
          <input
            type="number"
            defaultValue={0}
            required
            readOnly={view}
            name={`manualCommonLiteratureDistribution`}
            id={`manualCommonLiteratureDistribution`}
            className="border-b-2 text-center border-dashed "
            oninput="calculateSum()"
          />
          =
          <input
            readOnly={true}
            type="number"
            defaultValue={
              parseInt(
                document.getElementById("uploadedCommonLiteratureDistribution")?.value
              ) +
              parseInt(
                document.getElementById("manualCommonLiteratureDistribution")?.value
              )
            }
            required
            name={`commonLiteratureDistributionSum`}
            id={`commonLiteratureDistributionSum`}
            className="border-b-2 text-center border-dashed "
          />
        </div>
        <div style={{ display: "flex" }}>
          <label className="block">ملاقاتیں:</label>
          <input
            readOnly={true}
            type="number"
            defaultValue={0}
            required
            name={`uploadedCommonStudentMeetings`}
            id={`uploadedCommonStudentMeetings`}
            className="border-b-2 text-center border-dashed "
          />
          +
          <input
            type="number"
            defaultValue={0}
            required
            readOnly={view}
            name={`manualCommonStudentMeetings`}
            id={`manualCommonStudentMeetings`}
            className="border-b-2 text-center border-dashed "
            oninput="calculateSum()"
          />
          =
          <input
            readOnly={true}
            type="number"
            defaultValue={
              parseInt(
                document.getElementById("uploadedCommonStudentMeetings")?.value
              ) +
              parseInt(
                document.getElementById("manualCommonStudentMeetings")?.value
              )
            }
            required
            name={`commonStudentMeetingsSum`}
            id={`commonStudentMeetingsSum`}
            className="border-b-2 text-center border-dashed "
          />
        </div>
      </div>
    </div>
  );
};
