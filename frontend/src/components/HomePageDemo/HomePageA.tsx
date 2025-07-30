import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePageA = () => {
  const navigate = useNavigate();

  const handleGuestClick = () => {
    navigate('/guest-dashboard');
  };

  const handleStaffClick = () => {
    navigate('/login');
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='buttons-container shadow-md px-4 py-4 rounded-[10px] flex flex-col flex-wrap gap-5 bg-white min-w-[250px] p-10 my-[5%] mx-auto h-auto box-border w-1/2 min-h-[510px] max-w-[430px] items-center justify-start z-10'>
        <div className='flex flex-col items-center mb-20'>
          <span className='m-[20px] text-center text-lg text-[#492470] font-bold'>
            Welcome to SurgeVenger! 👋
          </span>
          <h2 className='text-[#492470] text-xl font-bold text-center'>
            Choose your access level
          </h2>
          <p className='text-gray-600 text-center mt-2 text-sm'>
            View surgery status updates or access staff dashboard
          </p>
        </div>
        <button
          onClick={handleGuestClick}
          className='rounded-md bg-[#492470] hover:bg-[#67369c] p-[10px_50px] box-border border-none text-white uppercase text-sm transition-colors duration-200'
        >
          Guest Access
        </button>
        <button
          onClick={handleStaffClick}
          className='rounded-[6px]
            bg-white
            hover:bg-slate-200     
            p-[10px_50px]
            border-[#492470]
            box-border
            border-2
            border-solid
            text-[#492470]
            uppercase
            text-sm
            transition-colors
            duration-200'
        >
          Staff Login
        </button>
      </div>
    </div>
  );
};

export default HomePageA;
