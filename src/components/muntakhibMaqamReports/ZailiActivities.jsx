import React from "react";
import { Box } from "./IfradiKuwat";

export const ZailiActivities = ({ view }) => {
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
                defaultValue={0}
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
                defaultValue={0}
                required
                name={`ijtRafaqa-done`}
                id={`ijtRafaqa-done`}
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                type="number"
                defaultValue={0}
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
                defaultValue={0}
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
                defaultValue={0}
                required
                name={`studyCircleMentioned-done`}
                id={`studyCircleMentioned-done`}
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                type="number"
                defaultValue={0}
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
                defaultValue={0}
                required
                name={`ijtKarkunan-decided`}
                id={`ijtKarkunan-decided`}
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                readOnly={true}
                type="number"
                defaultValue={0}
                required
                name={`ijtKarkunan-done`}
                id={`ijtKarkunan-done`}
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                readOnly={view}
                type="number"
                defaultValue={0}
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
                defaultValue={0}
                required
                name={`darseQuran-decided`}
                id={`darseQuran-decided`}
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                readOnly={true}
                type="number"
                defaultValue={0}
                required
                name={`darseQuran-done`}
                id={`darseQuran-done`}
                className="p-1 text-center "
              />
            </Box>
            <Box>
              <input
                readOnly={view}
                type="number"
                defaultValue={0}
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
                readOnly={true}
                type="number"
                defaultValue={0}
                required
                name={`shaheenMeeting-decided`}
                id={`shaheenMeeting-decided`}
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                readOnly={true}
                type="number"
                defaultValue={0}
                required
                name={`shaheenMeeting-done`}
                id={`shaheenMeeting-done`}
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                readOnly={view}
                type="number"
                defaultValue={0}
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
                readOnly={true}
                type="number"
                defaultValue={0}
                required
                name={`paighamEvent-decided`}
                id={`paighamEvent-decided`}
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                readOnly={true}
                type="number"
                defaultValue={0}
                required
                name={`paighamEvent-done`}
                id={`paighamEvent-done`}
                className="p-1 text-center min-w-full"
              />
            </Box>
            <Box>
              <input
                readOnly={view}
                type="number"
                defaultValue={0}
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
