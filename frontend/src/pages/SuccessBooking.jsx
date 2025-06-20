import React from 'react'
import Navbar from '../components/Navbar'
import { Link, useLocation } from 'react-router';
import NotFound from './NotFound';

const SuccessBooking = () => {
    const location = useLocation();
    const { office = null, booking = null } = location.state || {};
    const baseURL = 'http://127.0.0.1:8000/storage';

    if (!office || !booking) {
        return <NotFound />
    }

    return (
        <>
            <Navbar />
            <section className='flex flex-1 py-10'>
                <div className='flex flex-col w-[450px] m-auto rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white'>
                    <div className='flex items-center gap-4'>
                        <img
                            src='/assets/images/icons/verify.svg'
                            className='w-[50px] h-[50px] flex shrink-0'
                            alt='icon'
                        />
                        <h1 className='font-extrabold text-[28px] leading-[38px]'>
                            Booking Finished
                        </h1>
                    </div>
                    <hr className='border-[#F6F5FD]' />
                    <div>
                        <div>
                            <img
                                src={`${baseURL}/${office.thumbnail}`}
                                className='w-full h-full object-cover'
                                alt='thumbnail'
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='font-bold text-xl leading-[30px]'>{office.name}</p>
                            <div className='flex items-center gap-[6px]'>
                                <img
                                    src='/assets/images/icons/location.svg'
                                    className='w-6 h-6'
                                    alt='icon'
                                />
                                <p className='font-semibold'>{office.city.name}</p>
                            </div>
                        </div>
                    </div>
                    <hr className='border-[#F6F5FD]' />
                    <div className='flex items-center gap-4'>
                        <img
                            src='/assets/images/icons/receipt-text.svg'
                            className='w-[34px] h-[34px]'
                            alt='icon'
                        />
                        <div>
                            <p className='font-bold'>{booking.booking_trx_id}</p>
                            <p className='text-sm leading-[21px] mt-[2px]'>
                                Save your booking ID securely
                            </p>
                        </div>
                    </div>
                    <hr className='border-[#F6F5FD]' />
                    <p className='font-semibold leading-[28px] text-center'>
                        Your order is currently being processed. Regularly check its payment status update.
                    </p>
                    <Link
                        to={'/check-booking'}
                    >
                        <div className='flex items-center justify-center w-full rounded-full p-[16px_26px] gap-3 bg-[#0D903A] font-bold text-[#F7F7FD]'>
                            <span>View Booking Details</span>
                        </div>
                    </Link>
                </div>
            </section>
        </>
    )
}

export default SuccessBooking