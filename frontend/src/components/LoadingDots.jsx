import React from 'react'

const LoadingDots = () => {
  return (
    <div className='flex space-x-1 justify-center items-center bg-white dark:invert'>
        <span className='sr-only'>Loading...</span>
        <div className='h-2 w-2 bg-[#0D903A] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
        <div className='h-2 w-2 bg-[#0D903A] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
        <div className='h-2 w-2 bg-[#0D903A] rounded-full animate-bounce'></div>
    </div>
  )
}

export default LoadingDots