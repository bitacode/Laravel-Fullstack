import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

const CityWrapperLoading = () => {

    return (
        <section className='flex flex-col gap-[30px] mt-[100px]' >
            <div className='w-full max-w-[1130px] mx-auto flex items-center justify-between'>
                <div className='flex flex-col gap-[10px]'>
                    <div className='bg-gray-300 w-[200px] h-[38px] rounded-full' />
                    <div className='bg-gray-300 w-[280px] h-[38px] rounded-full' />

                </div>
                <div className='bg-gray-300 w-[150px] h-[48px] rounded-full' />
            </div>
            <div className='swiper w-full'>
                <div className='swiper-wrapper'>
                    <Swiper
                        direction='horizontal'
                        spaceBetween={30}
                        slidesPerView='auto'
                        slidesOffsetAfter={30}
                        slidesOffsetBefore={30}
                    >
                        <SwiperSlide
                            className='!w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]'
                        >
                            <div className='card'>
                                <div className='relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] bg-gray-300 overflow-hidden' />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide
                            className='!w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]'
                        >
                            <div className='card'>
                                <div className='relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] bg-gray-300 overflow-hidden' />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide
                            className='!w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]'
                        >
                            <div className='card'>
                                <div className='relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] bg-gray-300 overflow-hidden' />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide
                            className='!w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]'
                        >
                            <div className='card'>
                                <div className='relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] bg-gray-300 overflow-hidden' />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide
                            className='!w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]'
                        >
                            <div className='card'>
                                <div className='relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] bg-gray-300 overflow-hidden' />
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>

            </div>
        </section>
    )
}

export default CityWrapperLoading