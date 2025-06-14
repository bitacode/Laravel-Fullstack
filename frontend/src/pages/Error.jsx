import React from 'react'

const Error = () => {
    return (
        <section className='flex flex-col justify-center items-center w-full h-screen max-w-[1130px] mx-auto'>
            <div className='flex flex-col justify-center items-center gap-[30px]'>
                <h1 className='text-[100px] font-extrabold text-[#0D903A]'>:'(</h1>
                <h1 className='font-extrabold text-[50px] leading-[60px]'>Oh-oh!</h1>
                <p className='text-lg leading-8 text-[#000929] text-center'>
                   Something went wrong while displaying our web.
                </p>
            </div>
        </section>
    )
}

export default Error