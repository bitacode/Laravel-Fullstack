import React from 'react'

const CityCard = ({city}) => {
    const baseURL = 'http://127.0.0.1:8000/storage';

    return (
        <div className='card'>
            <div className='relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] overflow-hidden'>
                <div className='relative flex flex-col justify-end w-full h-full p-5 fap-[2px] bg-[linear-gradient(180deg,_rgba(0,0,0,0)_49.87%,_rgba(0,0,0,0.8)_100%)] z-10'>
                    <h3 className='font-bold text-xl leading-[30px] text-white'>
                        {city.name}
                    </h3>
                    <p className='text-white'>{city.officeSpace_count} {city.officeSpace_count <= 1 ? 'Office' : 'Offices'}</p>
                </div>
                <img
                    src={`${baseURL}/${city.photo}`}
                    className='absolute w-full h-full object-cover'
                    alt='thumbnails'
                />
            </div>
        </div>
    )
}

export default CityCard;