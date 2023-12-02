import { FaCheck, FaTimes } from 'react-icons/fa';
import instance from '../../api/instrance';
import { useToastState } from '../../context';
import { useState } from 'react';

export const Notifications = ({ userRequests, getAllRequests }) => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useToastState();
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
            Authorization: `Bearer ${localStorage.getItem('@token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      await getAllRequests();
      dispatch({ type: 'SUCCESS', payload: req.data?.message });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.response.data.message });
    }
    setLoading(false);
  };
  return (
    <div className='card-body max-h-[320px] overflow-y-scroll'>
      {userRequests.length < 1 && <h1 className='p-2'>No requests found!</h1>}
      {userRequests.map((req, index) => (
        <div
          key={index}
          className='p-3 hover:bg-slate-300 flex flex-col lg:flex-row lg:items-center justify-between'
        >
          <div className='flex items-center justify-start'>
            <div className='avatar'>
              <div className='w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'>
                <img
                  src='https://cdn-icons-png.flaticon.com/512/1159/1159740.png'
                  alt='logo'
                />
              </div>
            </div>
            <div className='flex flex-col px-3'>
              <span className='font-semibold'>{req?.name}</span>
              <span>{req?.email}</span>
            </div>
          </div>
          <div className='flex items-center justify-end lg:justify-start gap-3 py-2'>
            <button
              disabled={loading}
              onClick={() => update(req?.req_id, 'accepted')}
              className='p-2 bg-slate-200 rounded-lg'
            >
              <FaCheck />
            </button>
            <button
              disabled={loading}
              onClick={() => update(req?.req_id, 'rejected')}
              className='p-2 bg-slate-200 rounded-lg'
            >
              <FaTimes />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
