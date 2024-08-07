import { FaCheck, FaTimes } from "react-icons/fa";
import instance from "../../api/instrance";
import { useToastState } from "../../context";
import { useContext, useEffect, useState } from "react";
import { Loader } from "../Loader";
import { FaBell } from "react-icons/fa6";
import moment from "moment";
import { months } from "../../pages/Reports";
import { UIContext } from "../../context/ui";

export const Notifications = ({ userRequests, type }) => {
  const { loading, setLoading } = useContext(UIContext);
  const { dispatch } = useToastState();
  const { getNazim } = useContext(UIContext);
  const { getAllRequests, getAllNotifications } = useContext(UIContext);
  const update = async (id, status) => {
    setLoading(true);
    try {
      const req = await instance.patch(
        `/user/user-requests/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      await getAllRequests();
      getNazim();
      dispatch({ type: "SUCCESS", payload: req.data?.message });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.response.data.message });
    }
    setLoading(false);
  };
  const markRead = async (id) => {
    setLoading(true);
    try {
      const req = await instance.patch(`/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
          "Content-Type": "application/json",
        },
      });
      await getAllNotifications();
      dispatch({ type: "SUCCESS", payload: req.data?.message });
    } catch (err) {
      console.log(err);
      dispatch({ type: "ERROR", payload: err.response.data.message });
    }
    setLoading(false);
  };
  return (
    <div className="card-body max-h-[320px] overflow-y-scroll">
      {type === "request" ? (
        <>
          {userRequests?.length < 1 && (
            <h1 className="p-2">No requests found!</h1>
          )}
          {loading ? (
            <Loader />
          ) : (
            userRequests?.map((req, index) => (
              <div
                key={index}
                className="relative hover:bg-slate-300 flex flex-col lg:flex-col lg:items-center justify-between"
              >
                <div className="badge absolute top-1 right-1 capitalize badge-primary">
                  {req?.nazimType}
                </div>

                <div className="flex w-full flex-col">
                  <div className="flex items-center w-full flex-col justify-start">
                    <div className="flex w-full px-3">
                      <span className="font-semibold flex gap-1">
                        {req?.name}
                      </span>
                    </div>
                    <div className="flex w-full px-3">
                      <span className="font-semibold flex gap-1 text-[#7a7a7a]">
                        <span>{req?.userAreaId?.name}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-end justify-end lg:justify-end gap-3 py-2">
                    <button
                      disabled={loading}
                      onClick={() => update(req?.req_id, "accepted")}
                      className="p-2 bg-slate-200 rounded-lg"
                    >
                      <FaCheck />
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => update(req?.req_id, "rejected")}
                      className="p-2 bg-slate-200 rounded-lg"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      ) : (
        <>
          {userRequests?.length < 1 && (
            <h1 className="p-2">No notifications found!</h1>
          )}
          {loading ? (
            <Loader />
          ) : (
            userRequests?.map((req, index) => (
              <div
                key={index}
                className="p-3 hover:bg-slate-300 flex flex-col lg:flex-row lg:items-center justify-between"
              >
                <div className="flex items-center justify-start">
                  <div className="avatar">
                    <div className="w-8 flex items-center justify-center rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <FaBell className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="flex flex-col px-3">
                    <span className="font-semibold">{req?.content}</span>
                    <span>
                      {months[moment(req?.createdAt).month()].title},
                      {moment(req?.createdAt).year()}
                    </span>
                  </div>
                </div>
                <div className="flex items-end justify-end lg:justify-end gap-3 py-2">
                  <button
                    disabled={loading}
                    onClick={() => markRead(req?._id)}
                    className="p-2 bg-slate-200 rounded-lg"
                  >
                    <FaCheck />
                  </button>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};
