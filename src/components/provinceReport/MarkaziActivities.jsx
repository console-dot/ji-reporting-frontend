import React from 'react';
import { Box } from './IfradiKuwat';

export const MarkaziActivities = ({ view }) => {
  return (
    <div className='relative w-full overflow-auto'>
      <table className='w-full table'>
        <thead>
          <tr>
            <Box type={'heading'}>مرکزی طے شدہ سرگرمیاں</Box>
            <Box>طے شدہ</Box>
            <Box>منعقدہ</Box>
            <Box>اوسط حاضری</Box>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Box>ڈویژنل مشاورت</Box>
            <Box>
              <input
                readOnly={view}
                type='number'
                defaultValue={0}
                required
                name={`divMushawarat-decided`}
                id={`divMushawarat-decided`}
                className='p-1 text-center min-w-full'
              />
            </Box>
            <Box>
              <input
                readOnly={view}
                type='number'
                defaultValue={0}
                required
                name={`divMushawarat-done`}
                id={`divMushawarat-done`}
                className='p-1 text-center min-w-full'
              />
            </Box>
            <Box>
              <input
                readOnly={view}
                type='number'
                defaultValue={0}
                required
                name={`divMushawarat-averageAttendance`}
                id={`divMushawarat-averageAttendance`}
                className='p-1 text-center min-w-full'
              />
            </Box>
          </tr>
          <tr>
            <Box>اجتماع ارکان</Box>
            <Box>
              <input
                readOnly
                type='number'
                defaultValue={0}
                required
                name={`ijtArkan-decided`}
                id={`ijtArkan-decided`}
                className='p-1 text-center min-w-full'
              />
            </Box>
            <Box>
              <input
                readOnly
                type='number'
                defaultValue={0}
                required
                name={`ijtArkan-done`}
                id={`ijtArkan-done`}
                className='p-1 text-center min-w-full'
              />
            </Box>
            <Box>
              <input
                readOnly={view}
                type='number'
                defaultValue={0}
                required
                name={`ijtArkan-averageAttendance`}
                id={`ijtArkan-averageAttendance`}
                className='p-1 text-center min-w-full'
              />
            </Box>
          </tr>
          <tr>
            <Box>سٹڈی سرکل</Box>
            <Box>
              <input
                readOnly
                type='number'
                defaultValue={0}
                required
                name={`studyCircle-decided`}
                id={`studyCircle-decided`}
                className='p-1 text-center min-w-full'
              />
            </Box>
            <Box>
              <input
                readOnly
                type='number'
                defaultValue={0}
                required
                name={`studyCircle-done`}
                id={`studyCircle-done`}
                className='p-1 text-center min-w-full'
              />
            </Box>
            <Box>
              <input
                readOnly={view}
                type='number'
                defaultValue={0}
                required
                name={`studyCircle-averageAttendance`}
                id={`studyCircle-averageAttendance`}
                className='p-1 text-center min-w-full'
              />
            </Box>
          </tr>
          <tr>
            <Box>اجتماع ناظمین</Box>
            <Box>
              <input
                readOnly
                type='number'
                defaultValue={0}
                required
                name={`ijtNazmeen-decided`}
                id={`ijtNazmeen-decided`}
                className='p-1 text-center min-w-full'
              />
            </Box>
            <Box>
              <input
                readOnly
                type='number'
                defaultValue={0}
                required
                name={`ijtNazmeen-done`}
                id={`ijtNazmeen-done`}
                className='p-1 text-center min-w-full'
              />
            </Box>
            <Box>
              <input
                readOnly={view}
                type='number'
                defaultValue={0}
                required
                name={`ijtNazmeen-averageAttendance`}
                id={`ijtNazmeen-averageAttendance`}
                className='p-1 text-center min-w-full'
              />
            </Box>
          </tr>
          <tr>
            <Box>اجتماع امیدواران</Box>
            <Box>
              <input
                readOnly
                type='number'
                defaultValue={0}
                required
                name={`ijtUmeedwaran-decided`}
                id={`ijtUmeedwaran-decided`}
                className='p-1 text-center min-w-full'
              />
            </Box>
            <Box>
              <input
                readOnly
                type='number'
                defaultValue={0}
                required
                name={`ijtUmeedwaran-done`}
                id={`ijtUmeedwaran-done`}
                className='p-1 text-center min-w-full'
              />
            </Box>
            <Box>
              <input
                readOnly={view}
                type='number'
                defaultValue={0}
                required
                name={`ijtUmeedwaran-averageAttendance`}
                id={`ijtUmeedwaran-averageAttendance`}
                className='p-1 text-center min-w-full'
              />
            </Box>
          </tr>
          <tr>
            <Box>صدورمیٹنگ</Box>
            <Box>
              <input
                readOnly
                type='number'
                defaultValue={0}
                required
                name={`sadurMeeting-decided`}
                id={`sadurMeeting-decided`}
                className='p-1 text-center min-w-full'
              />
            </Box>
            <Box>
              <input
                readOnly
                type='number'
                defaultValue={0}
                required
                name={`sadurMeeting-done`}
                id={`sadurMeeting-done`}
                className='p-1 text-center min-w-full'
              />
            </Box>
            <Box>
              <input
                readOnly={view}
                type='number'
                defaultValue={0}
                required
                name={`sadurMeeting-averageAttendance`}
                id={`sadurMeeting-averageAttendance`}
                className='p-1 text-center min-w-full'
              />
            </Box>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
