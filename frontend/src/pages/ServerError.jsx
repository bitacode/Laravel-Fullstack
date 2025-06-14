import React from 'react'

const ServerError = () => {
    return (
        <section className='flex flex-col justify-center items-center w-full h-screen max-w-[1130px] mx-auto'>
            <div className='flex flex-col justify-center items-center gap-[30px]'>
                <img src='/assets/images/icons/500.svg' className='w-xl' alt='500'/>
                <h1 className='font-extrabold text-[50px] leading-[60px]'>Internal Server Error</h1>
                <p className='text-lg leading-8 text-[#000929] text-center'>
                   The server encountered an error and could not
                    <br />
                    complete your request.
                </p>
            </div>
        </section>
    )
}

export default ServerError