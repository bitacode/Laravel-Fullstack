import React from 'react'

const NotFound = () => {
    return (
        <section className='flex flex-col justify-center items-center w-full h-screen max-w-[1130px] mx-auto'>
            <div className='flex flex-col justify-center items-center gap-[30px]'>
                <img src='/assets/images/icons/404.svg' className='w-xl' alt='404'/>
                <h1 className='font-extrabold text-[50px] leading-[60px]'>Page Not Found</h1>
                <p className='text-lg leading-8 text-[#000929] text-center'>
                    We're sorry, the page you requested could not be found
                    <br />
                    please go back to the homepage.
                </p>
                <a
                    href='/'
                    className='flex items-center rounded-full p-[20px_40px] gap-3 bg-[#0D903A]'
                >
                    <span className='font-bold text-xl leading-[30px] text-[#F7F7FD]'>
                        Go Home
                    </span>
                </a>
            </div>
        </section>
    )
}

export default NotFound