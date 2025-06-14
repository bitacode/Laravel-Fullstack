import React from 'react'

const Empty = () => {
    return (
        <div className='bg-white rounded-[20px] border border-[#E0DEF7] justify-center items-center flex flex-col gap-3 pt-[40px] pb-[40px]'>
            <img src='/assets/images/icons/archive.svg' className='w-[200px]' alt='archive'/>
            <span className='font-bold text-[24px] leading-[48px] text-nowrap'>Currently Empty</span>
            <p className='text-lg leading-8 text-[#000929] text-center'>
                Oops! Seems like there's nothing in here yet.
            </p>
        </div>
    )
}

export default Empty