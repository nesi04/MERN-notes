import React from 'react'
import {IoMdClose} from 'react-icons/io';
import {FaMagnifyingGlass} from 'react-icons/fa6';

const SearchBar = ({value,onChange,handleSearch,onClearSearch }) => {
  return (
    <div className='w-80 flex items-center px-4  rounded-md bg-base-100'>
        <input type="text" placeholder='Search notes ' className='w-full text-xs bg-transparent outline-none py-[11px]' value={value} onChange={onChange} />

        {value&&(
            <IoMdClose className='text-xl text-tertiary cursor-pointer hover:text-primary mr-3' onClick={onClearSearch}/>

        )}
        <FaMagnifyingGlass className='text-tertiary cursor-pointer hover:text-primary' onClick={handleSearch}/>
    </div>
  )
}

export default SearchBar