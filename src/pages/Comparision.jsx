import { useContext, useState } from 'react';
import { GeneralLayout } from '../components';
import {
  DistrictContext,
  DivisionContext,
  HalqaContext,
  MaqamContext,
  MeContext,
  ProvinceContext,
  useToastState,
} from '../context';
import instance from '../api/instrance';
import { useEffect } from 'react';
import { ReportChart } from '../components/ReportChart';
import { FaTimes, FaChevronCircleRight, FaTimesCircle } from 'react-icons/fa';
import { getDivisionByTehsil, months } from './Reports';
import { UIContext } from '../context/ui';

const Dates = ({
  durationMonths,
  setDurationMonths,
  showDates,
  durationType,
  durationYears,
  setDurationYears,
  getData,
}) => {
  const [year, setYear] = useState(2023);

  return (
    <div className='fixed top-0 left-0 z-1 w-full h-screen bg-white'>
      <div className='flex z-50 w-full p-3 items-center border-b justify-between'>
        <h1 className='text-xl font-bold'>Dates</h1>
        <div className='flex justify-end items-center gap-3'>
          <button
            className='btn'
            onClick={() => {
              showDates(false);
              getData();
            }}
          >
            Generate
          </button>
          <button className='btn' onClick={() => showDates(false)}>
            <FaTimes />
          </button>
        </div>
      </div>
      {durationType === 'month' && (
        <div className='flex items-start justify-start w-full h-[calc(100vh-72.8px-64px)]'>
          <div className='w-full h-[calc(100vh-72.8px-64px)] overflow-hidden overflow-y-scroll'>
            <input
              type='number'
              id='yearInput'
              name='yearInput'
              placeholder='YYYY'
              min='1900'
              max='2100'
              step='1'
              className='input-bordered input w-full'
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            {months.map((i, index) => (
              <div
                key={index}
                className='flex p-3 hover:bg-slate-200 items-center justify-between'
                onClick={() =>
                  setDurationMonths([
                    ...durationMonths,
                    { month: i?.title, year, value: i?.value },
                  ])
                }
              >
                <span>
                  {i?.title}, {year}
                </span>
                <FaChevronCircleRight />
              </div>
            ))}
          </div>
          <div className='w-full h-[calc(100vh-72.8px-64px)] overflow-hidden overflow-y-scroll'>
            {durationMonths.map((i, index) => (
              <div
                key={index}
                onClick={() =>
                  setDurationMonths([
                    ...durationMonths.slice(0, index),
                    ...durationMonths.slice(index + 1, durationMonths.length),
                  ])
                }
                className='flex p-3 hover:bg-slate-200 items-center justify-between'
              >
                <span>
                  {i?.month}, {i?.year}
                </span>
                <FaTimesCircle />
              </div>
            ))}
          </div>
        </div>
      )}
      {durationType === 'year' && (
        <div className='flex items-start justify-start w-full h-[calc(100vh-72.8px-64px)]'>
          <div className='w-full h-[calc(100vh-72.8px-64px)] overflow-hidden overflow-y-scroll'>
            {Array(10)
              .fill(1)
              .map((_, index) => (
                <div
                  key={index}
                  className='flex p-3 hover:bg-slate-200 items-center justify-between'
                  onClick={() =>
                    setDurationYears([...durationYears, 2023 + index])
                  }
                >
                  <span>{2023 + index}</span>
                  <FaChevronCircleRight />
                </div>
              ))}
          </div>
          <div className='w-full h-[calc(100vh-72.8px-64px)] overflow-hidden overflow-y-scroll'>
            {durationYears.map((i, index) => (
              <div
                key={index}
                onClick={() =>
                  setDurationYears([
                    ...durationYears.slice(0, index),
                    ...durationYears.slice(index + 1, durationYears.length),
                  ])
                }
                className='flex p-3 hover:bg-slate-200 items-center justify-between'
              >
                <span>{i}</span>
                <FaTimesCircle />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const Comparision = () => {
  const [durationMonths, setDurationMonths] = useState([]);
  const me = useContext(MeContext);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [durationType, setDurationType] = useState('');
  const [reportType, setReportType] = useState('');
  const [dates, showDates] = useState(false);
  const [areaId, setAreaId] = useState('');
  const [response, setResponse] = useState(null);
  const [durationYears, setDurationYears] = useState([]);
  const maqams = useContext(MaqamContext);
  const divisions = useContext(DivisionContext);
  const halqas = useContext(HalqaContext);
  const districts = useContext(DistrictContext);
  const provinces = useContext(ProvinceContext);
  const nazims = useContext(UIContext);
  const [searchArea, setSearchArea] = useState('');

  const [areas, setAreas] = useState({
    maqam: [],
    division: [],
    halqa: [],
    district: [],
    province: [],
    all: [],
  });
  useEffect(() => {
    setAreas({
      ...areas,
      maqam: maqams,
      division: divisions,
      halqa: halqas,
      district: districts,
      province: provinces,
      all: [...maqams, ...divisions, ...districts, ...provinces],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maqams, divisions, halqas, districts]);
  const { dispatch } = useToastState();
  const transformedArray = durationMonths.map((item) => {
    return {
      month: item.value,
      year: item.year,
    };
  });

  const data =
    durationType === 'month'
      ? {
          dates: transformedArray,
          duration_type: durationType,
          areaId,
        }
      : { dates: durationYears, duration_type: durationType, areaId };
  const getData = async () => {
    setResponse(null);
    try {
      const res = await instance.post(
        `comparison/${
          reportType === 'self'
            ? localStorage.getItem('@type')
            : reportType === 'personal'
            ? 'personal'
            : reportType
        }/${selectedProperty}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('@token')}`,
          },
        }
      );
      const myData = res?.data?.data;
      const labels = {
        halqa: {
          activities: {
            ijtrafaqa: 'اجتماع رفقا',
            ijtkarkunan: 'اجتماع کارکنان',
            studycircle: 'سٹڈی سرکل',
            darsequran: 'درس قُرآن',
          },
          workerInfo: {
            arkan: 'ارکان',
            umeedwaran: 'امیدواران',
            rafaqa: 'رفقا',
            karkunan: 'کارکنان',
          },
          library: {
            books: 'تعداد کتب',
            increase: 'اضافہ',
            decrease: 'کمی',
            bookrent: 'اجرائے کتب',
            registered: '',
          },
          otherActivity: {
            dawatiwafud: 'دعوتی وفود',
            rawabitparties: 'روابط پارٹیز',
            hadithcircle: 'حدیث سرکل',
            nizamsalah: 'نظام الصلوٰۃ',
            shabbedari: 'شب بیداری',
          },
          toseeDawat: {
            rawabitdecided: 'طے شدہ',
            current: 'موجود',
            meetings: 'ملاقاتیں',
            literaturedistribution: 'تقسیم لٹریچر',
            registered: '',
            commonstudentmeetings: 'عام طلبہ ملاقاتیں',
            commonliteraturedistribution: 'عام طلبہ تقسیم لٹریچر ',
          },
          rozShabBedari: {
            umeedwaranfilled: 'امیدواران فل',
            rafaqafilled: 'رفقا فل',
            arkanfilled: 'ارکان فل',
          },
        },
        maqam: {
          activities: {
            ijtarkan: 'اجتماع ارکان',
            studycircle: 'سٹڈی سرکل',
            ijtnazmeen: 'اجتماع ناظمین',
            ijtumeedwaran: 'اجتماع امیدواران',
            sadurmeeting: 'صدورمیٹینگ',
          },
          workerInfo: {
            arkan: 'ارکان',
            umeedwaran: 'امیدواران',
            rafaqa: 'رفقا',
            karkunan: 'کارکنان',
            shaheen: 'شاہین',
            members: 'ممبرز',
          },
          library: {
            totallibraries: 'کل تعداد لائبریریز',
            totalBooks: 'تعداد کتب',
            totalIncrease: 'اضافہ',
            totalDecrease: 'کمی',
            totalBookRent: 'اجرائے کتب',
          },
          otherActivity: {
            dawatiwafud: 'دعوتی وفود',
            rawabitparties: 'روابط پارٹیز',
            nizamsalah: 'نظام الصلوٰۃ',
            shabbedari: 'شب بیداری',
            anyOther: '',
            tarbiyatgaah: 'تربیت گاہ',
          },
          toseeDawat: {
            rawabitdecided: 'طے شدہ',
            current: 'موجود',
            meetings: 'ملاقاتیں',
            literaturedistribution: 'تقسیم لٹریچر',
            registered: '',
            commonstudentmeetings: 'عام طلبہ ملاقاتیں',
            commonliteraturedistribution: 'عام طلبہ تقسیم لٹریچر ',
          },
          rozShabBedari: {
            umeedwaranfilled: 'امیدواران فل',
            rafaqafilled: 'رفقا فل',
            arkanfilled: 'ارکان فل',
          },
          paighamDigest: {
            totalreceived: 'کل موصولہ',
            totalsold: 'فروخت کردہ',
          },
          tanzeem: {
            rehaishhalqay: 'رہائشی حلقے',
            taleemhalqay: 'تعلیمی حلقے',
            totalhalqay: 'کل حلقے',
            subrehaishhalqay: 'رہاشی ذیلی حلقے',
            subtaleemhalqay: 'تعلیمی ذیلی حلقے',
            subtotalhalqay: 'کل ذیلی حلقے',
            busmschoolunits: 'بزم کے سکول یونٹس',
            busmrehaishunits: 'بزم کےرہاشی یونٹس',
            busmtotalunits: 'بزم کے کل یونٹس',
          },
          mentionedActivities: {
            ijtrafaqa: 'اجتماع رفقا',
            studycircle: 'سٹڈی سرکل',
            ijtkarkunan: 'اجتماع کارکنان',
            darsequran: 'درس قرآن',
            shaheenmeeting: 'شاہین میٹنگ',
            paighamevent: 'پیغام محفل',
          },
        },
        division: {
          activities: {
            studycircle: 'سٹڈی سرکل',
            ijtnazmeen: 'اجتماع ناظمین',
            ijtumeedwaran: 'اجتماع امیدواران',
            sadurmeeting: 'صدورمیٹینگ',
          },
          workerInfo: {
            arkan: 'ارکان',
            umeedwaran: 'امیدواران',
            rafaqa: 'رفقا',
            karkunan: 'کارکنان',
            shaheen: 'شاہین',
            members: 'ممبرز',
          },
          library: {
            totallibraries: 'کل تعداد لائبریریز',
            totalBooks: 'تعداد کتب',
            totalIncrease: 'اضافہ',
            totalDecrease: 'کمی',
            totalBookRent: 'اجرائے کتب',
          },
          otherActivity: {
            dawatiwafud: 'دعوتی وفود',
            rawabitparties: 'روابط پارٹیز',
            nizamsalah: 'نظام الصلوٰۃ',
            shabbedari: 'شب بیداری',
            anyOther: '',
            tarbiyatgaah: 'تربیت گاہ',
          },
          toseeDawat: {
            rawabitdecided: 'طے شدہ',
            current: 'موجود',
            meetings: 'ملاقاتیں',
            literaturedistribution: 'تقسیم لٹریچر',
            registered: '',
            commonstudentmeetings: 'عام طلبہ ملاقاتیں',
            commonliteraturedistribution: 'عام طلبہ تقسیم لٹریچر ',
          },
          rozShabBedari: {
            umeedwaranfilled: 'امیدواران فل',
            rafaqafilled: 'رفقا فل',
            arkanfilled: 'ارکان فل',
          },
          paighamDigest: {
            totalreceived: 'کل موصولہ',
            totalsold: 'فروخت کردہ',
          },
          tanzeem: {
            rehaishhalqay: 'رہائشی حلقے',
            taleemhalqay: 'تعلیمی حلقے',
            totalhalqay: 'کل حلقے',
            subrehaishhalqay: 'رہاشی ذیلی حلقے',
            subtaleemhalqay: 'تعلیمی ذیلی حلقے',
            subtotalhalqay: 'کل ذیلی حلقے',
            busmschoolunits: 'بزم کے سکول یونٹس',
            busmrehaishunits: 'بزم کےرہاشی یونٹس',
            busmtotalunits: 'بزم کے کل یونٹس',
          },
          mentionedActivities: {
            ijtrafaqa: 'اجتماع رفقا',
            studycircle: 'سٹڈی سرکل',
            ijtkarkunan: 'اجتماع کارکنان',
            darsequran: 'درس قرآن',
            shaheenmeeting: 'شاہین میٹنگ',
            paighamevent: 'پیغام محفل',
          },
        },
        province: {
          activities: {
            studycircle: 'سٹڈی سرکل',
            ijtnazmeen: 'اجتماع ناظمین',
            ijtumeedwaran: 'اجتماع امیدواران',
            sadurmeeting: 'صدورمیٹینگ',
          },
          workerInfo: {
            arkan: 'ارکان',
            umeedwaran: 'امیدواران',
            rafaqa: 'رفقا',
            karkunan: 'کارکنان',
            shaheen: 'شاہین',
            members: 'ممبرز',
          },
          library: {
            totallibraries: 'کل تعداد لائبریریز',
            totalBooks: 'تعداد کتب',
            totalIncrease: 'اضافہ',
            totalDecrease: 'کمی',
            totalBookRent: 'اجرائے کتب',
          },
          otherActivity: {
            dawatiwafud: 'دعوتی وفود',
            rawabitparties: 'روابط پارٹیز',
            nizamsalah: 'نظام الصلوٰۃ',
            shabbedari: 'شب بیداری',
            anyOther: '',
            tarbiyatgaah: 'تربیت گاہ',
            tanzeemiround: 'تنظیمی دورہ',
          },
          toseeDawat: {
            rawabitdecided: 'طے شدہ',
            current: 'موجود',
            meetings: 'ملاقاتیں',
            literaturedistribution: 'تقسیم لٹریچر',
            registered: '',
            commonstudentmeetings: 'عام طلبہ ملاقاتیں',
            commonliteraturedistribution: 'عام طلبہ تقسیم لٹریچر ',
          },
          rozShabBedari: {
            umeedwaranfilled: 'امیدواران فل',
            rafaqafilled: 'رفقا فل',
            arkanfilled: 'ارکان فل',
          },
          paighamDigest: {
            totalprinted: 'کل پرنٹ کردہ',
            totalsoldmarket: 'کل فروخت کردہ (مارکیٹ)',
            totalsoldtanzeemi: 'کل فروخت کردہ (تنظیمی)',
            gift: 'گفٹ',
          },
          tanzeem: {
            rehaishhalqay: 'رہائشی حلقے',
            taleemhalqay: 'تعلیمی حلقے',
            totalhalqay: 'کل حلقے',
            subrehaishhalqay: 'رہاشی ذیلی حلقے',
            subtaleemhalqay: 'تعلیمی ذیلی حلقے',
            subtotalhalqay: 'کل ذیلی حلقے',
            busmschoolunits: 'بزم کے سکول یونٹس',
            busmrehaishunits: 'بزم کےرہاشی یونٹس',
            busmtotalunits: 'بزم کے کل یونٹس',
          },
          mentionedActivities: {
            ijtrafaqa: 'اجتماع رفقا',
            studycircle: 'سٹڈی سرکل',
            ijtkarkunan: 'اجتماع کارکنان',
            darsequran: 'درس قرآن',
            shaheenmeeting: 'شاہین میٹنگ',
            paighamevent: 'پیغام محفل',
          },
        },
        personal: {
          prayers: {
            fajarinfradi: 'فجرانفرادی ',
            fajarontime: 'فجرباجماعت',
            fajarqaza: 'فجر قضا ',
            fajartotal: 'فجر ٹوٹل',
            otherprayersinfradi: 'دیگرانفرادی',
            otherprayersontime: 'دیگرباجماعت',
            otherprayersqaza: 'دیگرقضا',
            otherprayerstotal: 'دیگرٹوٹل',
          },
          studies: {
            tafseertotaldays: 'تفسیرکتنےدن پڑہی',
            tafseertotalrakoo: 'تفسیرکےکتنے رکوع پڑہے',
            ahdeestotaldays: 'کل کتنےدن پڑہی',
            litraturetotaldays: 'لٹریچر کتنے دن پڑہا',
            hifztotaldays: 'حفظ کتنے دن کیا',
            institutionAttendance: 'تعلیمی ادارے میں حاضری',
          },
          toseeDawa: {
            genralstudentstotalmeetups: 'عام طلبہ سے کل ملاقاتیں',
            genralstudentstotallitraturedivided:
              'عام طلبہ کتنا لیٹریچرتقسیم کیا',
            genralstudentscount: 'عام طلبہ کل سے ملاقاتیں',
          },
        },
      };
      myData.labels = myData.labels.map(
        (i) => labels[reportType][selectedProperty][i]
      );
      setResponse(myData);
    } catch (error) {
      console.log(error);
      dispatch({ type: 'ERROR', payload: error?.response?.data?.message });
    }
  };
  const getAreaType = (area) => {
    if (area?.parentType === 'Maqam') {
      const name = maqams.find((i) => i?._id === area?.parentId?._id);
      return `${name?.name} (Maqam)`;
    } else if (area?.parentType === 'Tehsil') {
      const name = getDivisionByTehsil(area?.parentId, districts);
      return `${name} (Division)`;
    } else if (area?.province) {
      return maqams.find((i) => i?._id === area?._id) ? 'Maqam' : 'Division';
    }
    return 'Province';
  };
  const handleEventClick = (e) => {
    if (e?.target?.id !== 'autocomplete0') {
      if (
        !document
          ?.getElementById('autocomplete0-list')
          ?.classList?.contains('hidden')
      ) {
        document
          ?.getElementById('autocomplete0-list')
          ?.classList?.add('hidden');
      }
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleEventClick);
    return () => {
      document.removeEventListener('click', handleEventClick);
    };
  }, []);
  return (
    <GeneralLayout title={'Comparison'} active={'comparison'}>
      <div className='relative flex flex-col gap-3 h-[calc(100vh-66px-64px)] w-full p-3'>
        <div
          style={{
            overflow: 'hidden',
            overflowY: 'visible',
            overflowX: 'scroll',
          }}
          className='flex items-center justify-start lg:justify-center xl:justify-center gap-3 border-b border-t py-3 inlineQ'
        >
          <select
            value={reportType}
            onChange={(e) => {
              setReportType(e.target.value);
              if (e.target.value === 'self') {
                setAreaId(me.userAreaId._id);
              }
            }}
            className='select select-bordered'
          >
            <option value='' disabled>
              Report Type
            </option>
            <option value='halqa'>Halqa</option>
            {localStorage.getItem('@type') === 'province' && (
              <>
                <option value='maqam'>Maqam</option>
                <option value='division'>Division</option>
                <option value='province'>Province</option>
              </>
            )}
            {['umeedwar', 'rukan', 'umeedwaar-nazim', 'rukan-nazim'].includes(
              me?.nazimType
            ) && <option value='personal'>Personal</option>}
            {/* <option value='self'>Self Compare</option> */}
          </select>
          {reportType !== 'self' && reportType !== 'personal' && (
            <select
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              className='select select-bordered'
            >
              <option value='' disabled>
                Area {reportType}
              </option>
              {areas[reportType]?.map((i, index) => (
                <option key={index} value={i?._id}>
                  {i?.name} - {getAreaType(i)}
                </option>
              ))}
            </select>
          )}

          {reportType === 'personal' && (
            <div className='relative w-full min-w-[140px] max-w-[228px]'>
              <input type='hidden' name='userAreaId' id='userAreaId' />
              <input
                id='autocomplete0'
                type='search'
                className='input input-bordered input-primary w-full min-w-[140px]'
                placeholder='Select area'
                onChange={(e) => setSearchArea(e.target.value)}
                onClick={() => {
                  if (
                    document
                      .getElementById('autocomplete0-list')
                      .classList.contains('hidden')
                  ) {
                    document
                      .getElementById('autocomplete0-list')
                      .classList.remove('hidden');
                  } else {
                    document
                      .getElementById('autocomplete0-list')
                      .classList.add('hidden');
                  }
                }}
              />
              <div
                id='autocomplete0-list'
                className='fixed hidden z-50 max-h-[100px] overflow-y-scroll bg-white border border-gray-300 w-full md:max-w-[228px] mt-1 left-0 md:left-[155px]'
              >
                {nazims?.nazim
                  .sort((a, b) =>
                    a?.userAreaId?.name?.localeCompare(b?.userAreaId?.name)
                  )
                  .filter((item) => {
                    if (searchArea && searchArea !== '') {
                      if (
                        item?.userAreaId?.name
                          ?.toString()
                          ?.toLowerCase()
                          ?.includes(searchArea?.toString()?.toLowerCase()) ||
                        item?.name
                          ?.toString()
                          ?.toLowerCase()
                          ?.includes(searchArea?.toString()?.toLowerCase())
                      ) {
                        return true;
                      }
                      return false;
                    } else {
                      return true;
                    }
                  })
                  .map((area, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        document.getElementById('userAreaId').value = area?._id;
                        setAreaId(area?._id);
                        document.getElementById(
                          'autocomplete0'
                        ).value = `${area?.userAreaId?.name} - ${area?.name} `;
                        document
                          .getElementById('autocomplete0-list')
                          .classList.add('hidden');
                      }}
                      className='p-2 cursor-pointer hover:bg-gray-100'
                    >
                      {area?.userAreaId?.name} - {area?.name}
                    </div>
                  ))}
              </div>
            </div>
          )}
          <select
            value={selectedProperty}
            className='select select-bordered'
            onChange={(e) => setSelectedProperty(e.target.value)}
          >
            <option value='' disabled>
              Property
            </option>
            {reportType !== 'personal' && (
              <>
                <option value={'activities'}>Activity</option>
                <option value={'workerInfo'}>Ifradi Kuwat</option>
                <option value={'library'}>Library</option>
                <option value={'otherActivity'}>Other Activity</option>
                <option value={'toseeDawat'}>Tosee Dawat</option>
                <option value={'rozShabBedari'}>Roz-o-Shab Diary</option>
                {['maqam', 'division', 'province'].includes(reportType) && (
                  <>
                    <option value={'paighamDigest'}>Paigham Digest</option>
                    <option value={'tanzeem'}>Tanzeem</option>
                    <option value={'mentionedActivities'}>
                      Zaili Activities
                    </option>
                  </>
                )}
              </>
            )}
            {['umeedwar', 'rukan', 'umeedwaar-nazim', 'rukan-nazim'].includes(
              me?.nazimType
            ) &&
              reportType === 'personal' && (
                <>
                  <option value={'prayers'}> Prayers</option>
                  <option value={'studies'}> Mutalajaat</option>
                  <option value={'toseeDawa'}>ToseeDawat</option>
                </>
              )}
          </select>
          <select
            value={durationType}
            onChange={(e) => setDurationType(e.target.value)}
            className='select select-bordered'
          >
            <option value='' disabled>
              Duration Type
            </option>
            <option value='month'>Month</option>
            <option value='year'>Year</option>
          </select>
          <button
            onClick={() => {
              if (
                durationType !== '' &&
                reportType !== '' &&
                selectedProperty !== ''
              )
                showDates(true);
            }}
            className='btn'
          >
            Dates
          </button>
        </div>
        <div className='relative flex flex-col gap-3 h-[calc(100vh-66px-64px-73.6px)] w-full p-3 overflow-scroll'>
          {response ? (
            <ReportChart res={response} type={selectedProperty} />
          ) : (
            <div className='flex justify-center items-center top-[50%] relative left-[0%]'>
              <p className='text-2xl text-[#7a7a7a]'>No Reports Data</p>
            </div>
          )}
        </div>
      </div>
      {dates && durationType !== '' && (
        <Dates
          durationMonths={durationMonths}
          setDurationMonths={setDurationMonths}
          durationType={durationType}
          showDates={showDates}
          durationYears={durationYears}
          setDurationYears={setDurationYears}
          getData={getData}
        />
      )}
    </GeneralLayout>
  );
};
