import React, { useState } from 'react'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6'

const PasswordInput = ({value,onChange,placeholder}) => {

  const[ isShowPassword, setIsShowPassword ] = useState(false);
  const togglePassword=()=>{
    setIsShowPassword(!isShowPassword);
  };
  return (
    <div className='flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3'>
        <input value={value} onChange={onChange} placeholder={placeholder} type={isShowPassword?'text':'password'} className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none'></input>
        {isShowPassword?<FaRegEye size={22} onClick={()=>togglePassword()} className='text-primary cursor-pointer'/>:<FaRegEyeSlash size={22} onClick={()=>togglePassword()} className='text-secondary cursor-pointer'/>}
    </div>
  )
}

export default PasswordInput