import React, { useEffect, useState } from "react";
import "./MaqamReport.css";
import { useParams } from "react-router-dom";
import instance from "../../api/instrance";
import { PrintDocument } from "../../components";

export const MaqamReport = () => {
  const [data, setData] = useState();
  const params = useParams();
  const printReport = async (id) => {
    const req = await instance.get(`/reports/maqam/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("@token")}`,
      },
    });
    if (req.status === 200) {
      setData(req?.data?.data);
    }
  };
  useEffect(() => {
    if (params?.id) printReport(params?.id);
  }, [params]);
  return (
    <div className="wrapper reports" style={{ marginBottom: "2rem" }} dir="rtl">
      <PrintDocument />
      <h3 style={{ textAlign: "center", fontWeight: "bold" }}>
        جائزہ کارکردگی رپورٹ برائے مقام
      </h3>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
        className="tableContainer"
      >
        <div
          style={{
            display: "flex",
            justifyItems: "flex-start",
            alignItems: "flex-start",
            gap: "1rem",
          }}
        >
          <h4 className="header"> مقام کا نام:</h4>
          <h6>
            {data?.maqamAreaId?.name}- ({data?.maqamAreaId?.province?.name})
          </h6>
        </div>
        <div
          style={{
            display: "flex",
            justifyItems: "flex-start",
            alignItems: "flex-start",
            gap: "1rem",
          }}
        >
          <h4 className="header">برائے ماہ:</h4>
          <h6>{data?.month.split("T")[0]}</h6>
        </div>
      </div>
      <div className="flex w-full p-4 justify-start items-center font-bold text-2xl">
        جامعات
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
        }}
        className="tableContainer"
      >
        <p className="header" style={{ width: "100%", padding: "8px 5px" }}>
          <strong>کیٹیگری</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong>آغازمیں</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong>اضافہ</strong>
        </p>

        <p className="header" style={{ width: "100%" }}>
          <strong>اختتام پر</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong> ماہانہ ہدف</strong>
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "2rem",
        }}
        className="tableContainer"
      >
        <div className="row">
          <p className="header">A </p>
          <p>{data?.jamiaatId?.jamiaatA?.start}</p>
          <p>{data?.jamiaatId?.jamiaatA?.increase}</p>
          <p>
            {data?.jamiaatId?.jamiaatA?.start +
              data?.jamiaatId?.jamiaatA?.increase}
          </p>
          <p>{data?.jamiaatId?.jamiaatA?.monthly}</p>
        </div>
        <div className="row">
          <p className="header">B </p>
          <p>{data?.jamiaatId?.jamiaatB?.start}</p>
          <p>{data?.jamiaatId?.jamiaatB?.increase}</p>
          <p>{data?.jamiaatId?.jamiaatB?.end}</p>
          <p>{data?.jamiaatId?.jamiaatB?.monthly}</p>
        </div>
        <div className="row">
          <p className="header">C</p>
          <p>{data?.jamiaatId?.jamiaatC?.start}</p>
          <p>{data?.jamiaatId?.jamiaatC?.increase}</p>
          <p>{data?.jamiaatId?.jamiaatC?.end}</p>
          <p>{data?.jamiaatId?.jamiaatC?.monthly}</p>
        </div>
        <div className="row">
          <p className="header">D</p>
          <p>{data?.jamiaatId?.jamiaatD?.start}</p>
          <p>{data?.jamiaatId?.jamiaatD?.increase}</p>
          <p>{data?.jamiaatId?.jamiaatD?.end}</p>
          <p>{data?.jamiaatId?.jamiaatD?.monthly}</p>
        </div>
        <div className="row">
          <p className="header">E</p>
          <p>{data?.jamiaatId?.jamiaatE?.start}</p>
          <p>{data?.jamiaatId?.jamiaatE?.increase}</p>
          <p>{data?.jamiaatId?.jamiaatE?.end}</p>
          <p>{data?.jamiaatId?.jamiaatE?.monthly}</p>
        </div>
      </div>
      <div className="flex w-full p-4 justify-start items-center font-bold text-2xl">
        کالجز
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
        }}
        className="tableContainer"
      >
        <p className="header" style={{ width: "100%", padding: "8px 5px" }}>
          <strong>کیٹیگری</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong>آغازمیں</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong>اضافہ</strong>
        </p>

        <p className="header" style={{ width: "100%" }}>
          <strong>اختتام پر</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong> ماہانہ ہدف</strong>
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "2rem",
        }}
        className="tableContainer"
      >
        <div className="row">
          <p className="header">A </p>
          <p>{data?.collegesId?.collegesA?.start}</p>
          <p>{data?.collegesId?.collegesA?.increase}</p>
          <p>{data?.collegesId?.collegesA?.end}</p>
          <p>{data?.collegesId?.collegesA?.monthly}</p>
        </div>
        <div className="row">
          <p className="header">B </p>
          <p>{data?.collegesId?.collegesB?.start}</p>
          <p>{data?.collegesId?.collegesB?.increase}</p>
          <p>{data?.collegesId?.collegesB?.end}</p>
          <p>{data?.collegesId?.collegesB?.monthly}</p>
        </div>
        <div className="row">
          <p className="header">C</p>
          <p>{data?.collegesId?.collegesC?.start}</p>
          <p>{data?.collegesId?.collegesC?.increase}</p>
          <p>{data?.collegesId?.collegesC?.end}</p>
          <p>{data?.collegesId?.collegesC?.monthly}</p>
        </div>
        <div className="row">
          <p className="header">D</p>
          <p>{data?.collegesId?.collegesD?.start}</p>
          <p>{data?.collegesId?.collegesD?.increase}</p>
          <p>{data?.collegesId?.collegesD?.end}</p>
          <p>{data?.collegesId?.collegesD?.monthly}</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
        }}
      >
        <p className="header" style={{ width: "100%" }}>
          <strong>تنظیم</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong>آغازمیں</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong>اضافہ</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong>کمی</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong>اختتام پر</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong>فعال</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong>غیرفعال</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong>ماہانہ ہدف</strong>
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "2rem",
        }}
        className="tableContainer"
      >
        <div className="row">
          <p className="header">رہائشی حلقے</p>
          <p>{data?.maqamTanzeemId?.rehaishHalqay?.start}</p>
          <p>{data?.maqamTanzeemId?.rehaishHalqay?.increase}</p>
          <p>{data?.maqamTanzeemId?.rehaishHalqay?.decrease}</p>
          <p>
            {data?.maqamTanzeemId?.rehaishHalqay?.start +
              data?.maqamTanzeemId?.rehaishHalqay?.increase -
              data?.maqamTanzeemId?.rehaishHalqay?.decrease}
          </p>
          <p>{data?.maqamTanzeemId?.rehaishHalqay?.continue}</p>
          <p>{data?.maqamTanzeemId?.rehaishHalqay?.paused}</p>
          <p>{data?.maqamTanzeemId?.rehaishHalqay?.monthly}</p>
        </div>
        <div className="row">
          <p className="header"> تعلیمی حلقے</p>
          <p>{data?.maqamTanzeemId?.taleemHalqay?.start}</p>
          <p>{data?.maqamTanzeemId?.taleemHalqay?.increase}</p>
          <p>{data?.maqamTanzeemId?.taleemHalqay?.decrease}</p>
          <p>
            {data?.maqamTanzeemId?.taleemHalqay?.start +
              data?.maqamTanzeemId?.taleemHalqay?.increase -
              data?.maqamTanzeemId?.taleemHalqay?.decrease}
          </p>
          <p>{data?.maqamTanzeemId?.taleemHalqay?.continue}</p>
          <p>{data?.maqamTanzeemId?.taleemHalqay?.paused}</p>
          <p>{data?.maqamTanzeemId?.taleemHalqay?.monthly}</p>
        </div>
        <div className="row">
          <p className="header">کل حلقے</p>
          <p>{data?.maqamTanzeemId?.totalHalqay?.start}</p>
          <p>{data?.maqamTanzeemId?.totalHalqay?.increase}</p>
          <p>{data?.maqamTanzeemId?.totalHalqay?.decrease}</p>
          <p>
            {data?.maqamTanzeemId?.totalHalqay?.start +
              data?.maqamTanzeemId?.totalHalqay?.increase -
              data?.maqamTanzeemId?.totalHalqay?.decrease}
          </p>
          <p>{data?.maqamTanzeemId?.totalHalqay?.continue}</p>
          <p>{data?.maqamTanzeemId?.totalHalqay?.paused}</p>
          <p>{data?.maqamTanzeemId?.totalHalqay?.monthly}</p>
        </div>
        <div className="row">
          <p className="header">رہائشی زیلی حلقے</p>
          <p>{data?.maqamTanzeemId?.subRehaishHalqay?.start}</p>
          <p>{data?.maqamTanzeemId?.subRehaishHalqay?.increase}</p>
          <p>{data?.maqamTanzeemId?.subRehaishHalqay?.decrease}</p>
          <p>
            {data?.maqamTanzeemId?.subRehaishHalqay?.start +
              data?.maqamTanzeemId?.subRehaishHalqay?.increase -
              data?.maqamTanzeemId?.subRehaishHalqay?.decrease}
          </p>
          <p>{data?.maqamTanzeemId?.subRehaishHalqay?.continue}</p>
          <p>{data?.maqamTanzeemId?.subRehaishHalqay?.paused}</p>
          <p>{data?.maqamTanzeemId?.subRehaishHalqay?.monthly}</p>
        </div>
        <div className="row">
          <p className="header">تعلیمی زیلی حلقے</p>
          <p>{data?.maqamTanzeemId?.subTaleemHalqay?.start}</p>
          <p>{data?.maqamTanzeemId?.subTaleemHalqay?.increase}</p>
          <p>{data?.maqamTanzeemId?.subTaleemHalqay?.decrease}</p>
          <p>
            {data?.maqamTanzeemId?.subTaleemHalqay?.start +
              data?.maqamTanzeemId?.subTaleemHalqay?.increase -
              data?.maqamTanzeemId?.subTaleemHalqay?.decrease}
          </p>
          <p>{data?.maqamTanzeemId?.subTaleemHalqay?.continue}</p>
          <p>{data?.maqamTanzeemId?.subTaleemHalqay?.paused}</p>
          <p>{data?.maqamTanzeemId?.subTaleemHalqay?.monthly}</p>
        </div>
        <div className="row">
          <p className="header">کل زیلی حلقے</p>
          <p>{data?.maqamTanzeemId?.subTotalHalqay?.start}</p>
          <p>{data?.maqamTanzeemId?.subTotalHalqay?.increase}</p>
          <p>{data?.maqamTanzeemId?.subTotalHalqay?.decrease}</p>
          <p>
            {data?.maqamTanzeemId?.subTotalHalqay?.start +
              data?.maqamTanzeemId?.subTotalHalqay?.increase -
              data?.maqamTanzeemId?.subTotalHalqay?.decrease}
          </p>
          <p>{data?.maqamTanzeemId?.subTotalHalqay?.continue}</p>
          <p>{data?.maqamTanzeemId?.subTotalHalqay?.paused}</p>
          <p>{data?.maqamTanzeemId?.subTotalHalqay?.monthly}</p>
        </div>

        <div className="row">
          <p className="header">بزم کے سکول یونٹس</p>
          <p>{data?.maqamTanzeemId?.busmSchoolUnits?.start}</p>
          <p>{data?.maqamTanzeemId?.busmSchoolUnits?.increase}</p>
          <p>{data?.maqamTanzeemId?.busmSchoolUnits?.decrease}</p>
          <p>
            {data?.maqamTanzeemId?.busmSchoolUnits?.start +
              data?.maqamTanzeemId?.busmSchoolUnits?.increase -
              data?.maqamTanzeemId?.busmSchoolUnits?.decrease}
          </p>
          <p>{data?.maqamTanzeemId?.busmSchoolUnits?.continue}</p>
          <p>{data?.maqamTanzeemId?.busmSchoolUnits?.paused}</p>
          <p>{data?.maqamTanzeemId?.busmSchoolUnits?.monthly}</p>
        </div>
        <div className="row">
          <p className="header">بزم کے رہائشی یونٹس</p>
          <p>{data?.maqamTanzeemId?.busmRehaishUnits?.start}</p>
          <p>{data?.maqamTanzeemId?.busmRehaishUnits?.increase}</p>
          <p>{data?.maqamTanzeemId?.busmRehaishUnits?.decrease}</p>
          <p>
            {data?.maqamTanzeemId?.busmRehaishUnits?.start +
              data?.maqamTanzeemId?.busmRehaishUnits?.increase -
              data?.maqamTanzeemId?.busmRehaishUnits?.decrease}
          </p>
          <p>{data?.maqamTanzeemId?.busmRehaishUnits?.continue}</p>
          <p>{data?.maqamTanzeemId?.busmRehaishUnits?.paused}</p>
          <p>{data?.maqamTanzeemId?.busmRehaishUnits?.monthly}</p>
        </div>
        <div className="row">
          <p className="header">بزم کے کل یونٹس</p>
          <p>{data?.maqamTanzeemId?.busmTotalUnits?.start}</p>
          <p>{data?.maqamTanzeemId?.busmTotalUnits?.increase}</p>
          <p>{data?.maqamTanzeemId?.busmTotalUnits?.decrease}</p>
          <p>
            {data?.maqamTanzeemId?.busmTotalUnits?.start +
              data?.maqamTanzeemId?.busmTotalUnits?.increase -
              data?.maqamTanzeemId?.busmTotalUnits?.decrease}
          </p>
          <p>{data?.maqamTanzeemId?.busmTotalUnits?.continue}</p>
          <p>{data?.maqamTanzeemId?.busmTotalUnits?.paused}</p>
          <p>{data?.maqamTanzeemId?.busmTotalUnits?.monthly}</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
        }}
        className="tableContainer"
      >
        <p className="header" style={{ width: "100%", padding: "8px 5px" }}>
          <strong>افرادی قوت</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong>آغازمیں</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong>اضافہ</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong>کمی</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong>اختتام پر</strong>
        </p>
        <p className="header" style={{ width: "100%" }}>
          <strong> ماہانہ ہدف</strong>
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "2rem",
        }}
        className="tableContainer"
      >
        <div className="row">
          <p className="header">ارکان</p>
          <p>{data?.wiId?.arkan?.start}</p>
          <p>{data?.wiId?.arkan?.increase}</p>
          <p>{data?.wiId?.arkan?.decrease}</p>
          <p>
            {data?.wiId?.arkan?.start +
              data?.wiId?.arkan?.increase -
              data?.wiId?.arkan?.decrease}
          </p>
          <p>{data?.wiId?.arkan?.monthly}</p>
          {/* <p>{data?.wiId?.arkan?.}</p> */}
        </div>
        <div className="row">
          <p className="header">امیدواران </p>
          <p>{data?.wiId?.umeedWaran?.start}</p>
          <p>{data?.wiId?.umeedWaran?.increase}</p>
          <p>{data?.wiId?.umeedWaran?.decrease}</p>
          <p>
            {data?.wiId?.umeedWaran?.start +
              data?.wiId?.umeedWaran?.increase -
              data?.wiId?.umeedWaran?.decrease}
          </p>
          <p>{data?.wiId?.umeedWaran?.monthly}</p>
          {/* <p>Data 3</p> */}
        </div>
        <div className="row">
          <p className="header">رفقا </p>
          <p>{data?.wiId?.rafaqa?.start}</p>
          <p>{data?.wiId?.rafaqa?.increase}</p>
          <p>{data?.wiId?.rafaqa?.decrease}</p>
          <p>
            {data?.wiId?.rafaqa?.start +
              data?.wiId?.rafaqa?.increase -
              data?.wiId?.rafaqa?.decrease}
          </p>
          <p>{data?.wiId?.rafaqa?.monthly}</p>
          {/* <p>Data 3</p> */}
        </div>
        <div className="row">
          <p className="header">کارکنان </p>
          <p>{data?.wiId?.karkunan?.start}</p>
          <p>{data?.wiId?.karkunan?.increase}</p>
          <p>{data?.wiId?.karkunan?.decrease}</p>
          <p>
            {data?.wiId?.karkunan?.start +
              data?.wiId?.karkunan?.increase -
              data?.wiId?.karkunan?.decrease}
          </p>
          <p>{data?.wiId?.karkunan?.monthly}</p>
          {/* <p>Data 3</p> */}
        </div>
        <div className="row">
          <p className="header"> شاہین</p>
          <p>{data?.wiId?.shaheen?.start}</p>
          <p>{data?.wiId?.shaheen?.increase}</p>
          <p>{data?.wiId?.shaheen?.decrease}</p>
          <p>
            {data?.wiId?.shaheen?.start +
              data?.wiId?.shaheen?.increase -
              data?.wiId?.shaheen?.decrease}
          </p>
          <p>{data?.wiId?.shaheen?.monthly}</p>
          {/* <p>Data 3</p> */}
        </div>
        <div className="row">
          <p className="header">ممبرز </p>
          <p>{data?.wiId?.members?.start}</p>
          <p>{data?.wiId?.members?.increase}</p>
          <p>{data?.wiId?.members?.decrease}</p>
          <p>
            {data?.wiId?.members?.start +
              data?.wiId?.members?.increase -
              data?.wiId?.members?.decrease}
          </p>
          <p>{data?.wiId?.members?.monthly}</p>
          {/* <p>Data 3</p> */}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
        }}
      >
        <p className="header" style={{ width: "100%", padding: "8px 5px" }}>
          <strong>مرکزی طے شدہ سرگرمیاں</strong>
        </p>
        <p className="header">
          <strong> طے شدہ </strong>
        </p>
        <p className="header">
          <strong>منعقدہ</strong>
        </p>
        <p className="header">
          <strong>اوسط حاضری</strong>
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "2rem",
        }}
        className="tableContainer"
      >
        <div className="row">
          <p className="header">اجتماع ارکان</p>
          <p>{data?.maqamActivityId?.ijtArkan?.decided}</p>
          <p>{data?.maqamActivityId?.ijtArkan?.done}</p>
          <p>{data?.maqamActivityId?.ijtArkan?.averageAttendance}</p>
        </div>
        <div className="row">
          <p className="header">سٹڈی سرکل</p>
          <p>{data?.maqamActivityId?.studyCircle?.decided}</p>
          <p>{data?.maqamActivityId?.studyCircle?.done}</p>
          <p>{data?.maqamActivityId?.studyCircle?.averageAttendance}</p>
        </div>
        <div className="row">
          <p className="header">اجتماعِ ناظمین </p>
          <p>{data?.maqamActivityId?.ijtNazmeen?.decided}</p>
          <p>{data?.maqamActivityId?.ijtNazmeen?.done}</p>
          <p>{data?.maqamActivityId?.ijtNazmeen?.averageAttendance}</p>
        </div>
        <div className="row">
          <p className="header">اجتماعِ امیدوران </p>
          <p>{data?.maqamActivityId?.ijtUmeedwaran?.decided}</p>
          <p>{data?.maqamActivityId?.ijtUmeedwaran?.done}</p>
          <p>{data?.maqamActivityId?.ijtUmeedwaran?.averageAttendance}</p>
        </div>
        <div className="row">
          <p className="header"> صدور میٹینگ</p>
          <p>{data?.maqamActivityId?.sadurMeeting?.decided}</p>
          <p>{data?.maqamActivityId?.sadurMeeting?.done}</p>
          <p>{data?.maqamActivityId?.sadurMeeting?.averageAttendance}</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
        }}
      >
        <p className="header" style={{ width: "100%", padding: "8px 5px" }}>
          <strong>زیلی طے شدہ سرگرمیاں</strong>
        </p>
        <p className="header">
          <strong> طے شدہ </strong>
        </p>
        <p className="header">
          <strong>منعقدہ</strong>
        </p>
        <p className="header">
          <strong>اوسط حاضری</strong>
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "2rem",
        }}
        className="tableContainer"
      >
        <div className="row">
          <p className="header">اجتماع رفقا</p>
          <p>{data?.mentionedActivityId?.ijtRafaqa?.decided}</p>
          <p>{data?.mentionedActivityId?.ijtRafaqa?.done}</p>
          <p>{data?.mentionedActivityId?.ijtRafaqa?.averageAttendance}</p>
        </div>
        <div className="row">
          <p className="header">سٹڈی سرکل </p>
          <p>{data?.mentionedActivityId?.studyCircle?.decided}</p>
          <p>{data?.mentionedActivityId?.studyCircle?.done}</p>
          <p>{data?.mentionedActivityId?.studyCircle?.averageAttendance}</p>
        </div>
        <div className="row">
          <p className="header">اجتماعِ کارکنان </p>
          <p>{data?.mentionedActivityId?.ijtKarkunan?.decided}</p>
          <p>{data?.mentionedActivityId?.ijtKarkunan?.sum}</p>
          <p>{data?.mentionedActivityId?.ijtKarkunan?.averageAttendance}</p>
        </div>
        <div className="row">
          <p className="header"> درس قرآن </p>
          <p>{data?.mentionedActivityId?.darseQuran?.decided}</p>
          <p>{data?.mentionedActivityId?.darseQuran?.sum}</p>
          <p>{data?.mentionedActivityId?.darseQuran?.averageAttendance}</p>
        </div>
        <div className="row">
          <p className="header"> شاہین میٹینگ</p>
          <p>{data?.mentionedActivityId?.shaheenMeeting?.decided}</p>
          <p>{data?.mentionedActivityId?.shaheenMeeting?.done}</p>
          <p>{data?.mentionedActivityId?.shaheenMeeting?.averageAttendance}</p>
        </div>
        <div className="row">
          <p className="header"> پیغام محفل</p>
          <p>{data?.mentionedActivityId?.paighamEvent?.decided}</p>
          <p>{data?.mentionedActivityId?.paighamEvent?.done}</p>
          <p>{data?.mentionedActivityId?.paighamEvent?.averageAttendance}</p>
        </div>
      </div>
      <div className="flex w-full items-start justify-start font-bold p-2 ">
        دیگر سرگرمیاں
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: "1rem",
        }}
        className="tableContainer"
      >
        <h6 style={{ width: "100%", textAlign: "start" }}>
          دعوتی وفود:{data?.otherActivityId?.dawatiWafud}
        </h6>
        <h6 style={{ width: "100%", textAlign: "start" }}>
          روابط پارٹیز:{data?.otherActivityId?.rawabitParties}
        </h6>
        <h6 style={{ width: "100%", textAlign: "start" }}>
          شب بیداری:{data?.otherActivityId?.shabBedari}
        </h6>
        <h6 style={{ width: "100%", textAlign: "start" }}>
          نِطام الصلوۃ:{data?.otherActivityId?.nizamSalah}
        </h6>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          textAlign: "start",
          flexDirection: "row",
          gap: "10px",
        }}
        className="tableContainer mb-4"
      >
        <h3>کوئی اور سرگرمی:</h3>
        <h6>{data?.otherActivityId?.anyOther}</h6>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          textAlign: "start",
          flexDirection: "column",
          gap: "10px",
        }}
        className="tableContainer"
      >
        <h3
          style={{ textAlign: "start", fontWeight: "bolder", marginTop: "8px" }}
        >
          توسیع دعوت
        </h3>
        <h3 style={{ textAlign: "start", fontWeight: "bold" }}>روابط</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "1rem",
            width: "100%",
          }}
        >
          <h6 style={{ width: "100%", textAlign: "start" }}>
            طے شدہ:{data?.tdId?.rawabitDecided}
          </h6>
          <h6 style={{ width: "100%", textAlign: "start" }}>
            موجودہ :{data?.tdId?.currentSum}
          </h6>
          <h6 style={{ width: "100%", textAlign: "start" }}>
            روابط سے ملاقاتوں کا ہدف:{data?.tdId?.rwabitMeetingsGoal}
          </h6>
          <h6 style={{ width: "100%", textAlign: "start" }}>
            ملاقاتوں کی تعداد:{data?.tdId?.meetingsSum}
          </h6>

          <h6 style={{ width: "100%", textAlign: "start" }}>
            تقسیم لٹریچر:{data?.tdId?.literatureDistribution}
          </h6>
        </div>
        <h3 style={{ textAlign: "start", fontWeight: "bold" }}>عام طلبہ</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "1rem",
            width: "100%",
          }}
        >
          <h6 style={{ width: "100%", textAlign: "start" }}>
            ملاقاتیں:{data?.tdId?.commonStudentMeetings}
          </h6>
          <h6 style={{ width: "100%", textAlign: "start" }}>
            تقسیم لٹریچر:{data?.tdId?.commonLiteratureDistribution}
          </h6>
        </div>
        <h3 style={{ textAlign: "start", fontWeight: "bolder" }}>لائبریری </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "1rem",
            width: "100%",
          }}
        >
          <h6 style={{ width: "100%", textAlign: "start" }}>
            کل تعداد لائبریری:{data?.maqamDivisionLibId?.totalLibraries}
          </h6>
          <h6 style={{ width: "100%", textAlign: "start" }}>
            کل تعداد کتب:{data?.maqamDivisionLibId?.totalBooks}
          </h6>
          <h6 style={{ width: "100%", textAlign: "start" }}>
            اضافہ کتب :{data?.maqamDivisionLibId?.totalIncrease}
          </h6>
          <h6 style={{ width: "100%", textAlign: "start" }}>
            کمی کتب :{data?.maqamDivisionLibId?.totalDecrease}
          </h6>
          <h6 style={{ width: "100%", textAlign: "start" }}>
            کل اجراےَ کتب :{data?.maqamDivisionLibId?.totalBookRent}
          </h6>
        </div>
        <h3 style={{ textAlign: "start", fontWeight: "bolder" }}>
          ہمقدم ڈائجسٹ
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "1rem",
            width: "100%",
          }}
        >
          <h6 style={{ width: "100%", textAlign: "start" }}>
            کل موصولہ :{data?.paighamDigestId?.totalReceived}
          </h6>
          <h6 style={{ width: "100%", textAlign: "start" }}>
            فروخت کردہ :{data?.paighamDigestId?.totalSold}
          </h6>
          <h6 style={{ width: "100%", textAlign: "start" }}>
            ڈائجسٹ موصول کرنے کا ماہانہ ہدف:
            {data?.paighamDigestId?.monthlyReceivingGoal}
          </h6>
        </div>
        <h3 style={{ textAlign: "start", fontWeight: "bolder" }}>بیت المال</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "1rem",
            width: "100%",
          }}
        >
          <h6 style={{ width: "100%", textAlign: "start" }}>
            ماہانہ آمدن:{data?.baitulmalId?.monthlyIncome}
          </h6>

          <h6 style={{ width: "100%", textAlign: "start" }}>
            ماہانہ خرچ:{data?.baitulmalId?.monthlyExpenditure}
          </h6>
          <h6 style={{ width: "100%", textAlign: "start" }}>
            بدست:{data?.baitulmalId?.savings}
          </h6>
          <h6 style={{ width: "100%", textAlign: "start" }}>
            خسارہ:{data?.baitulmalId?.loss}
          </h6>
        </div>
        <h3 style={{ textAlign: "start", fontWeight: "bolder" }}>
          روز شب ڈائری
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "1rem",
            width: "100%",
          }}
        >
          <h6 style={{ width: "100%", textAlign: "start" }}>
            کتنے امیدوران فل کرتے ہیں :{data?.rsdId?.umeedwaranFilledSum}
          </h6>

          <h6 style={{ width: "100%", textAlign: "start" }}>
            کتنےرفقا فل کرتے ہیں :{data?.rsdId?.rafaqaFilled}
          </h6>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            textAlign: "start",
            flexDirection: "column",
            gap: "10px",
          }}
          className="tableContainer"
        >
          <h3 style={{ fontWeight: "bolder" }}> تبصرہ </h3>
          <h6>{data?.comments}</h6>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            justifyContent: "flex-start",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <h3 style={{ fontWeight: "bolder" }}>نام ناظم</h3>
            <h6>{data?.userId?.name}</h6>
          </div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <h3 style={{ fontWeight: "bolder" }}> رپورٹ جمع کروانے کی تاریخ</h3>
            <h6>{data?.createdAt.split("T")[0]}</h6>
          </div>
        </div>
      </div>
    </div>
  );
};
