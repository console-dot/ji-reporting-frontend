import React, { useContext } from "react";
import { Box } from "./IfradiKuwat";
import { sumUpTwoValues } from "../muntakhibMaqamReports";
import { HalqaContext } from "../../context";

const ZailiActivities = ({ view, compile }) => {
  const halqas = useContext(HalqaContext);

  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full table">
        <thead>
          <tr>
            <Box type={"heading"}>ذیلی طے شدہ سرگرمیاں</Box>
            <Box>طے شدہ</Box>
            <Box>منعقدہ</Box>
            <Box>اوسط حاضری</Box>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Box>اجتماع رفقا </Box>
            <Box>
              <input
                readOnly={true}
                type="number"
                required
                name={`ijtRafaqa-decided`}
                id={`ijtRafaqa-decided`}
                
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                readOnly={true}
                type="number"
                required
                name={`ijtRafaqa-done`}
                id={`ijtRafaqa-done`}
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                readOnly={view}
                type="number"
                required
                name={`ijtRafaqa-averageAttendance`}
                id={`ijtRafaqa-averageAttendance`}
                className="p-1 text-center min-w-full"
              />
            </Box>
          </tr>
          <tr>
            <Box> سٹڈی سرکل</Box>
            <Box>
              <input
                readOnly={true}
                type="number"
                required
                name={`studyCircleMentioned-decided`}
                id={`studyCircleMentioned-decided`}
                
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                readOnly={true}
                type="number"
                required
                name={`studyCircleMentioned-done`}
                id={`studyCircleMentioned-done`}
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                readOnly={view}
                type="number"
                required
                name={`studyCircleMentioned-averageAttendance`}
                id={`studyCircleMentioned-averageAttendance`}
                className="p-1 text-center min-w-full"
              />
            </Box>
          </tr>
          <tr>
            <Box>اجتماع کارکنان</Box>
            <Box>
              <input
                readOnly={true}
                type="number"
                required
                name={`ijtKarkunan-decided`}
                id={`ijtKarkunan-decided`}
                
                className="p-1 text-center min-w-full"
              />
            </Box>
            {compile ? (
              <div style={{ display: "flex", width: "30%" }}>
                <input
                  readOnly={true}
                  type="number"
                  defaultValue={
                    parseInt(
                      document.getElementById("ijtKarkunan-done")?.value
                    ) +
                    parseInt(
                      document.getElementById("ijtKarkunan-manual")?.value
                    )
                  }
                  required
                  name={`ijtKarkunan-sum`}
                  id={`ijtKarkunan-sum`}
                  className="p-1 text-center min-w-full"
                />
              </div>
            ) : (
              <div style={{ display: "flex", width: "30%" }}>
                <input
                  readOnly={true}
                  type="number"
                  required
                  name={`ijtKarkunan-done`}
                  id={`ijtKarkunan-done`}
                  className="p-1 text-center min-w-full"
                />
                +
                <input
                  readOnly={view}
                  type="number"
                  placeholder="کل ذیلی حلقہ جات"
                  required
                  name={`ijtKarkunan-manual`}
                  id={`ijtKarkunan-manual`}
                  className="p-1 text-center min-w-full"
                  onChange={() =>
                    sumUpTwoValues(
                      parseInt(
                        document.getElementById("ijtKarkunan-done").value
                      ),
                      parseInt(
                        document.getElementById("ijtKarkunan-manual").value
                      ),
                      "currentSum"
                    )
                  }
                />
                =
                <input
                  readOnly={true}
                  type="number"
                  defaultValue={
                    parseInt(
                      document.getElementById("ijtKarkunan-done")?.value
                    ) +
                    parseInt(
                      document.getElementById("ijtKarkunan-manual")?.value
                    )
                  }
                  required
                  name={`ijtKarkunan-sum`}
                  id={`ijtKarkunan-sum`}
                  className="p-1 text-center min-w-full"
                />
              </div>
            )}
            <Box>
              <input
                readOnly={view}
                type="number"
                required
                name={`ijtKarkunan-averageAttendance`}
                id={`ijtKarkunan-averageAttendance`}
                className="p-1 text-center min-w-full"
              />
            </Box>
          </tr>
          <tr>
            <Box>درس قرآن </Box>
            <Box>
              <input
                readOnly={true}
                type="number"
                required
                name={`darseQuran-decided`}
                id={`darseQuran-decided`}
                
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              {compile ? (
                <div className="flex">
                  <input
                    readOnly={true}
                    type="number"
                    defaultValue={
                      parseInt(
                        document.getElementById("darseQuran-done")?.value
                      ) +
                      parseInt(
                        document.getElementById("darseQuran-manual")?.value
                      )
                    }
                    required
                    name={`darseQuran-sum`}
                    id={`darseQuran-sum`}
                    className="p-1 text-center "
                  />
                </div>
              ) : (
                <div className="flex">
                  <input
                    readOnly={true}
                    type="number"
                    required
                    name={`darseQuran-done`}
                    id={`darseQuran-done`}
                    className="p-1 text-center "
                  />
                  +
                  <input
                    readOnly={view}
                    type="number"
                    placeholder="کل ذیلی حلقہ جات"
                    required
                    name={`darseQuran-manual`}
                    id={`darseQuran-manual`}
                    className="p-1 text-center "
                    onChange={() =>
                      sumUpTwoValues(
                        parseInt(
                          document.getElementById("darseQuran-done").value
                        ),
                        parseInt(
                          document.getElementById("darseQuran-manual").value
                        ),
                        "currentSum"
                      )
                    }
                  />
                  =
                  <input
                    readOnly={true}
                    type="number"
                    defaultValue={
                      parseInt(
                        document.getElementById("darseQuran-done")?.value
                      ) +
                      parseInt(
                        document.getElementById("darseQuran-manual")?.value
                      )
                    }
                    required
                    name={`darseQuran-sum`}
                    id={`darseQuran-sum`}
                    className="p-1 text-center "
                  />
                </div>
              )}
            </Box>
            <Box>
              <input
                readOnly={view}
                type="number"
                required
                name={`darseQuran-averageAttendance`}
                id={`darseQuran-averageAttendance`}
                className="p-1 text-center min-w-full"
              />
            </Box>
          </tr>
          <tr>
            <Box>شاہین میٹنگ</Box>
            <Box>
              <input
                disabled={view}
                type="number"
                required
                name={`shaheenMeeting-decided`}
                id={`shaheenMeeting-decided`}
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                disabled={view}
                type="number"
                required
                name={`shaheenMeeting-done`}
                id={`shaheenMeeting-done`}
                readOnly
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                disabled={view}
                type="number"
                required
                name={`shaheenMeeting-averageAttendance`}
                id={`shaheenMeeting-averageAttendance`}
                className="p-1 text-center min-w-full"
              />
            </Box>
          </tr>
          <tr>
            <Box>پیغام محفل</Box>
            <Box>
              <input
                disabled={view}
                type="number"
                required
                name={`paighamEvent-decided`}
                id={`paighamEvent-decided`}
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                disabled={view}
                type="number"
                required
                readOnly
                name={`paighamEvent-done`}
                id={`paighamEvent-done`}
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                disabled={view}
                type="number"
                required
                name={`paighamEvent-averageAttendance`}
                id={`paighamEvent-averageAttendance`}
                className="p-1 text-center min-w-full"
              />
            </Box>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ZailiActivities;
