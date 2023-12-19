export const RozOShabDiary = ({ view }) => {
  return (
    <div className='p-2 py-5 relative w-full overflow-auto'>
      <h2 className='text-black py-3 text-lg'>روزوشب ڈائری</h2>
      <div className='flex flex-wrap w-full items-center justify-start'>
        <div className='flex py-2'>
          <label className='block'>کتنے ارکان فل کرتے ھیں؟</label>
          <input
            readOnly={view}
            type='number'
            name='arkanFilled'
            id='arkanFilled'
            className='border-b-2 text-center border-dashed'
          />
        </div>
        <div className='flex py-2'>
          <label className='block'>کتنے رفقا فل کرتے ھیں؟</label>
          <input
            readOnly={view}
            type='number'
            name='rafaqaFilled'
            id='rafaqaFilled'
            className='border-b-2 text-center border-dashed'
          />
        </div>
        <div className='flex py-2'>
          <label className='block'>کتنے امیدواران فل کرتے ھیں؟</label>
          <input
            readOnly={view}
            type='number'
            name='umeedwaranFilled'
            id='umeedwaranFilled'
            className='border-b-2 text-center border-dashed'
          />
        </div>
      </div>
    </div>
  );
};