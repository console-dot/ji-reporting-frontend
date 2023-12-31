import { useContext } from 'react';
import { GeneralLayout } from '../components';
import instance from '../api/instrance';
import { MeContext, useToastState } from '../context';

export const EditProfile = () => {
  const me = useContext(MeContext);
  const { dispatch } = useToastState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const req = await instance.put(
        `/user`,
        {
          name: formData.get('name'),
          age: formData.get('age'),
          email: formData.get('email'),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('@token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch({ type: 'SUCCESS', payload: req.data?.message });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.response.data.message });
    }
  };
  return (
    <GeneralLayout>
      <div className='relative flex flex-col justify-center h-[calc(100vh-65.6px-64px)]'>
        <div className='w-full p-6 m-auto bg-white rounded-md lg:max-w-lg'>
          <h3 className='font-bold text-2xl'>Edit Profile</h3>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div>
              <label className='label'>
                <span className='text-base label-text'>Name</span>
              </label>
              <input
                type='text'
                placeholder='Full Name'
                className='w-full input input-bordered input-primary'
                name='name'
                defaultValue={me?.name}
                required
              />
            </div>
            <div>
              <label className='label'>
                <span className='text-base label-text'>Email</span>
              </label>
              <input
                type='email'
                placeholder='Email Address'
                className='w-full input input-bordered input-primary'
                name='email'
                defaultValue={me?.email}
                required
              />
            </div>
            <div>
              <label className='label'>
                <span className='text-base label-text'>Age</span>
              </label>
              <input
                type='number'
                placeholder='Enter Age'
                name='age'
                className='w-full input input-bordered input-primary'
                defaultValue={me?.age}
                required
              />
            </div>
            <div>
              <button className='btn btn-primary'>Save</button>
            </div>
          </form>
        </div>
      </div>
    </GeneralLayout>
  );
};
