import React from 'react'

const Loading = () => {
    return (
        <section className='flex flex-col w-full max-w-[1130px] h-screen mx-auto'>
            <div className='flex flex-col w-full h-screen items-center justify-center' >
                <div className='w-12 h-12 rounded-full bg-[#0D903A] pulse' />
            </div>
        </section>
    )
}

export default Loading