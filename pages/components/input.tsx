import React from 'react';

interface InputProp {
  label: string;
  value: string;
  setvalue: React.Dispatch<React.SetStateAction<string>>;
  isPassword: boolean;
}

const Input = ({ label, isPassword, value, setvalue }: InputProp) => {
  return (
    <div className='flex flex-col w-full gap-4'>
      <label htmlFor='user_input' className='font-[600]' >{label}</label>
      <input value={value} onChange={(e) => setvalue(e.target.value)} id='user_input' className='focus:outline-none border-b-2 w-full border-black' type={isPassword ? "password" : 'text'} />
    </div>
  )
}

export default Input;