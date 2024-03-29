export const PaighamDigest = ({ view }) => {
  return (
    <div className="p-2 py-5 relative w-full overflow-auto">
      <h2 className="text-black py-3 text-lg">پیغام ڈائجسٹ</h2>
      <div className="flex flex-wrap w-full items-center justify-start">
        <div className="flex py-2 ml-4">
          <label className="block"> کل پرنٹ کردہ:</label>
          <input
            type="number"
            defaultValue={0}
            required
            readOnly={view}
            name="totalPrinted"
            id="totalPrinted"
            className="border-b-2 text-center border-dashed"
          />
        </div>
        <div className="flex py-2 ml-4">
          <label className="block">کل فروخت کردہ (تنظیمی):</label>
          <input
            type="number"
            defaultValue={0}
            required
            readOnly={view}
            name="totalSoldTanzeemi"
            id="totalSoldTanzeemi"
            className="border-b-2 text-center border-dashed"
          />
        </div>
        <div className="flex py-2 ml-4">
          <label className="block">کل فروخت کردہ (مارکیٹ):</label>
          <input
            type="number"
            defaultValue={0}
            required
            readOnly={view}
            name="totalSoldMarket"
            id="totalSoldMarket"
            className="border-b-2 text-center border-dashed"
          />
        </div>
        <div className="flex py-2 ml-4">
          <label className="block">گفٹ:</label>
          <input
            type="number"
            defaultValue={0}
            required
            readOnly={view}
            name="gift"
            id="gift"
            className="border-b-2 text-center border-dashed"
          />
        </div>
      </div>
    </div>
  );
};
