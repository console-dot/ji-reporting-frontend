import React, { useContext } from 'react';
import { GeneralLayout, Loader, GeneralInfo, calcultate } from '../components';
import { convertDataFormat, reverseDataFormat, toJson } from '../utils';
import instance from '../api/instrance';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  DivisionReportContext,
  HalqaReportContext,
  MaqamReportContext,
  MeContext,
  useToastState,
} from '../context';
import { useEffect } from 'react';
import { getData } from './Maqam';
import { UIContext } from '../context/ui';
import { Tanzeem } from '../components/divisionReport/Tanzeem';
import { IfradiKuwat } from '../components/divisionReport/IfradiKuwat';
import { MarkaziActivities } from '../components/divisionReport/MarkaziActivities';
import ZailiActivities from '../components/divisionReport/ZailiActivities';
import { OtherActivities } from '../components/divisionReport/OtherActivities';
import { ToseeDawat } from '../components/divisionReport/ToseeDawat';
import { Library } from '../components/divisionReport/Library';
import { PaighamDigest } from '../components/divisionReport/PaighamDigest';
import { RozOShabDiary } from '../components/divisionReport/RozOShabDiary';

export const Division = () => {
  // EDIT CODE START
  const halqa = useContext(HalqaReportContext);
  const maqam = useContext(MaqamReportContext);
  const division = useContext(DivisionReportContext);
  const params = useParams();
  const [id, setId] = useState(null);
  const { dispatch } = useToastState();
  const [data, setData] = useState({});
  const { loading, setLoading, getDivisionReports } = useContext(UIContext);
  const [view, setView] = useState(false);
  const [month, setMonth] = useState('');
  const me = useContext(MeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const autoFill = () => {
    const halq = {};
    document.getElementById('division-form').reset();
    if (halqa.filter((i) => i?.month.includes(month)).length < 1) {
      [
        'rafaqa-start',
        'karkunan-start',
        'rafaqa-increase',
        'karkunan-increase',
        'rafaqa-decrease',
        'karkunan-decrease',
        'rafaqa-end',
        'karkunan-end',
        'rafaqa-annual',
        'karkunan-annual',
        'ijtRafaqa-decided',
        'ijtRafaqa-done',
        'ijtRafaqa-averageAttendance',
        'studyCircleMentioned-decided',
        'studyCircleMentioned-done',
        'studyCircleMentioned-averageAttendance',
        'ijtKarkunan-decided',
        'ijtKarkunan-done',
        'ijtKarkunan-averageAttendance',
        'darseQuran-decided',
        'darseQuran-done',
        'darseQuran-averageAttendance',
        'dawatiWafud',
        'rawabitParties',
        'shabBedari',
        'nizamSalah',
        'rawabitDecided',
        'current',
        'meetings',
        'literatureDistribution',
        'commonStudentMeetings',
        'commonLiteratureDistribution',
        'totalLibraries',
        'totalBooks',
        'meetings',
        'literatureDistribution',
        'commonStudentMeetings',
        'commonLiteratureDistribution',
        'totalLibraries',
        'totalBooks',
        'totalIncrease',
        'totalDecrease',
        'totalBookRent',
        'rafaqaFilled',
      ].forEach((i) => {
        document.getElementById(i).value = 0;
      });
      document.getElementById('name').value = me?.userAreaId?.name;
    }
    halqa
      .filter((i) => i?.month.includes(month))
      .forEach((i) => {
        const sim = reverseDataFormat(i);
        Object.keys(sim)?.forEach((j) => {
          if (halq?.[j]) {
            try {
              halq[j] += parseInt(sim[j]) || 0;
            } catch {
              halq[j] += sim[j] || 0;
            }
          } else {
            try {
              halq[j] = parseInt(sim[j]) || 0;
            } catch {
              halq[j] = sim[j] || 0;
            }
          }
        });
      });
    Object.keys(halq).forEach((i) => {
      let j;
      if (i === 'studyCircle-decided') {
        j = 'studyCircleMentioned-decided';
      } else if (i === 'studyCircle-completed') {
        j = 'studyCircleMentioned-done';
      } else if (i === 'studyCircle-attendance') {
        j = 'studyCircleMentioned-averageAttendance';
      } else {
        if (i.split('-')[1] === 'completed') {
          j = i.split('-')[0] + '-done';
        } else if (i.split('-')[1] === 'attendance') {
          j = i.split('-')[0] + '-averageAttendance';
        } else if (i === 'books') {
          j = 'totalBooks';
        } else if (i === 'bookRent') {
          j = 'totalBookRent';
        } else if (i === 'increase') {
          j = 'totalIncrease';
        } else if (i === 'decrease') {
          j = 'totalDecrease';
        } else {
          j = i;
        }
      }
      const elem = document.getElementById(j);
      if (elem) {
        if (j === 'month') {
        } else {
          if (elem.type === 'checkbox') {
          }
          if (j.split('-')[1] === 'attendance') {
            document.getElementById(
              `${j.split('-')[0]}-averageAttendance`
            ).value = halq[i];
          } else {
            if (i === 'name' && !view) {
              elem.value = me?.userAreaId?.name;
            } else {
              elem.value = halq[i];
            }
          }
        }
      }
    });
    Object.keys(data).forEach((i) => {
      const elem = document.getElementById(i);
      if (elem) {
        if (i === 'month') {
          elem.value = data[i]?.split('')?.slice(0, 7)?.join('');
        } else {
          if (elem.type === 'checkbox') {
            elem.checked = data[i];
          } else {
            elem.value = data[i];
          }
        }
      }
    });
    const afd = [
      'rehaishHalqay',
      'taleemHalqay',
      'totalHalqay',
      'subRehaishHalqay',
      'subTaleemHalqay',
      'subTotalHalqay',
      'busmSchoolUnits',
      'busmRehaishUnits',
      'busmTotalUnits',
      'arkan',
      'umeedWaran',
      'rafaqa',
      'karkunan',
      'members',
      'shaheen',
    ];
    afd.forEach((i) => {
      calcultate(i);
    });
    document.getElementById('studyCircle-averageAttendance').value = 0;
    document.getElementById('studyCircle-done').value = 0;
    document.getElementById('umeedwaranFilled').value = 0;
    document.getElementById('arkanFilled').value = 0;
    ['arkan', 'umeedWaran'].forEach((i) => {
      document.getElementById(`${i}-start`).value = 0;
      document.getElementById(`${i}-end`).value = 0;
      document.getElementById(`${i}-increase`).value = 0;
      document.getElementById(`${i}-decrease`).value = 0;
      document.getElementById(`${i}-annual`).value = 0;
    });
  };

  useEffect(() => {
    const l = location.pathname?.split('/')[2];
    if (l === 'view') {
      setView(true);
    }
    setId(params?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  useEffect(() => {
    if (id) getData('division', id, setData, { halqa, maqam, division });
    else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    if (!id) autoFill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, halqa, month]);
  // EDIT CODE END

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const jsonData = convertDataFormat(toJson(formData));
    setLoading(true);
    try {
      if (id) {
        const req = await instance.put(`/reports/division/${id}`, jsonData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('@token')}`,
          },
        });
        await getDivisionReports();
        dispatch({ type: 'SUCCESS', payload: req.data?.message });
        navigate('/reports');
      } else {
        const req = await instance.post('/reports/division', jsonData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('@token')}`,
          },
        });
        await getDivisionReports();
        dispatch({ type: 'SUCCESS', payload: req.data?.message });
        navigate('/reports');
      }

      e.target.reset();
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.response.data.message });
    }
    setLoading(false);
  };
  useEffect(() => {
    Object.keys(data).forEach((i) => {
      const elem = document.getElementById(i);
      if (elem) {
        if (i === 'month') {
          elem.value = data[i]?.split('')?.slice(0, 7)?.join('');
        } else {
          if (elem.type === 'checkbox') {
            elem.checked = data[i];
          } else {
            elem.value = data[i];
          }
        }
      }
    });
    const afd = [
      'rehaishHalqay',
      'taleemHalqay',
      'totalHalqay',
      'subRehaishHalqay',
      'subTaleemHalqay',
      'subTotalHalqay',
      'busmSchoolUnits',
      'busmRehaishUnits',
      'busmTotalUnits',
      'arkan',
      'umeedWaran',
      'rafaqa',
      'karkunan',
      'members',
      'shaheen',
    ];
    afd.forEach((i) => {
      calcultate(i);
    });
  }, [data]);
  return (
    <GeneralLayout>
      <div className='reports h-[calc(100vh-64.4px-64px)] overflow-hidden overflow-y-scroll w-full'>
        <form
          className='flex w-full flex-col justify-center items-center p-4 font-notoUrdu mb-5'
          dir='rtl'
          onSubmit={handleSubmit}
          id='division-form'
        >
          {/* <fieldset disabled={view} className="w-full"> */}
          <h2 className='text-2xl mb-4'>جا ئزءکارکردگی رپورٹ (براے ڈویژن)</h2>
          <div className='w-full'>
            <div className='mb-4'>
              <GeneralInfo
                month={month}
                me={me}
                setMonth={setMonth}
                area={'ڈویژن'}
              />
            </div>
            <div className='mb-4'>
              {/* <TanzeemDivision view={view} /> */}
              <Tanzeem view={view} data={data} />
            </div>
            <div className='mb-4'>
              {/* <MenTableDivision view={view} /> */}
              <IfradiKuwat view={view} data={data} />
            </div>
            <div className='mb-4'>
              {/* <CentralActivitiesDivision view={view} /> */}
              <MarkaziActivities view={view} />
            </div>
            <div className='mb-4'>
              {/* <ZailiActivitesDivision view={view} /> */}
              <ZailiActivities view={view} />
            </div>
            <div className=' mb-4'>
              {/* <OtherActivitiesDivision arr={arr} view={view} /> */}
              <OtherActivities view={view} />
            </div>
            <div className=' mb-4'>
              {/* <ExpandPartyDivision view={view} /> */}
              <ToseeDawat />
            </div>
            <div className=' mb-4'>
              {/* <LibraryDivision view={view} /> */}
              <Library />
            </div>
            <div className=' mb-4'>
              {/* <MessageDigestDivision view={view} /> */}
              <PaighamDigest view={view} />
            </div>
            <div className=' mb-4'>
              {/* <EveningDiaryDivision view={view} /> */}
              <RozOShabDiary view={view} />
            </div>
          </div>
          <div className='w-full flex p-2'>
            <label htmlFor='comments'>تبصرہ</label>
            <input
              type='text'
              name='comments'
              required
              className='border-b-2 border-dashed w-full'
              id='comments'
              readOnly={view}
            />
          </div>
          {!view && (
            <div className='w-full flex flex-col items-end gap-3 p-2'>
              <div>
                <label htmlFor='nazim'>نام ناظمِ:</label>
                <input
                  type='text'
                  className='border-b-2 border-dashed text-center'
                  id='nazim'
                  defaultValue={me?.name || ''}
                  readOnly
                />
              </div>
            </div>
          )}
          {!view && (
            <div className='w-full'>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={loading}
              >
                {id ? 'Update' : 'Add'}
              </button>
            </div>
          )}
          {/* </fieldset> */}
        </form>
      </div>
      {loading && <Loader />}
    </GeneralLayout>
  );
};
