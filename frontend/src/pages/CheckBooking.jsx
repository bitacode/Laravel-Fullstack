import React, { useState, useEffect } from 'react'
import { viewBookingSchema } from '../types/validationBooking';
import apiClient, { isAxiosError } from '../service/apiClient';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { Link } from 'react-router';

const CheckBooking = () => {
    const [formErrors, setFormErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isReporting, setIsReporting] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [reported, setReported] = useState(false);
    const [loading, setLoading] = useState(true);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [officeDetails, setOfficeDetails] = useState(null);
    const [error, setError] = useState(null);
    const [reportError, setReportError] = useState(null);

    const [formData, setFormData] = useState({
        phone_number: '',
        booking_trx_id: ''
    });

    const baseURL = 'http://127.0.0.1:8000/storage';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                if (bookingDetails?.office?.slug) {
                    const slug = bookingDetails?.office?.slug;

                    const response = await apiClient.get(`/office/${slug}`);
                    setOfficeDetails(response.data.data);
                }

                if (!bookingDetails?.reports || bookingDetails.reports.length === 0) {
                    setReported(false);
                } else {
                    const checkReport = bookingDetails.reports.find(
                        report => report.booking_transaction_id === bookingDetails.id
                    );
                    setReported(checkReport?.is_traced === 0);
                }
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false);
            } 
        }

        fetchData();

    }, [bookingDetails]);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmitReport = async () => {
        if (!bookingDetails) {
            setError('Verify your booking first');
            return;
        }

        setIsReporting(true);

        try {
            const response = await apiClient.post('/report', {
                booking_transaction_id: bookingDetails?.id,
            });

            console.log('Report submitted:', response.data);
            setIsModalOpen(false);

        } catch (error) {
            if (isAxiosError) {
                console.error('Error submitting report:', error);
                setReportError(error.response?.data?.message || 'Failed to submit report');
            } else {
                console.log('Unexpected error:', error);
                setReportError('An unexpected error occured');
            }
        } finally {
            setIsReporting(false);
            setReported(true);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('Validating form data...');
        const validation = viewBookingSchema.safeParse(formData);

        if(!validation.success) {
            console.error('Validation errors:', validation.error.issues);
            setFormErrors(validation.error.issues);
            return;
        }

        console.log('Form data is valid. Submiting...', formData);

        setIsLoading(true);

        try {
            const response = await apiClient.post(
                '/check-booking',
                {
                    ...formData,
                }
            );

            console.log('We are checking your booking:', response.data.data);
            setBookingDetails(response.data.data);
            setError(null);
        } catch (error) {
            if (isAxiosError) {
                console.log('Error submitting form:', error.message);
                setError(error.message);
            } else {
                console.log('Unexpected error:', error);
                setError('An unexpected error occured');
            }
        } finally {
            setIsLoading(false);
        }
    }

    const openModal = () => {
        if (!bookingDetails?.reports || bookingDetails.reports.length === 0) {
            setIsModalOpen(true);
            return;
        }
      
        const checkReport = bookingDetails.reports.find(
            report => report.booking_transaction_id === bookingDetails.id
        );
      
        if (checkReport) {
            setIsModalOpen(checkReport.is_traced !== 0);
        } else {
            setIsModalOpen(true);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Navbar />
            <div
                id='Banner'
                className='relative w-full h-[240px] flex items-center shrink-0 overflow-hidden -mb-[50px]'
            >
                <h1 className='text-center mx-auto font-extrabold text-[40px] leading-[60px] text-white mb-5 z-20'>
                    View Your Booking Details
                </h1>
                <div className='absolute w-full h-full bg-[linear-gradient(180deg,_rgba(0,0,0,0)_0%,#000000_91.83%)] z-10' />
                <img
                    src='assets/images/thumbnails/thumbnail-details-5.png'
                    className='absolute w-full h-full object-cover object-top'
                    alt='thumbnail'
                />
            </div>
            <section
                id='Check-Booking'
                className='relative flex flex-col w-[930px] shrink-0 gap-[30px] mx-auto mb-[100px] z-20'
            >
                <form
                    onSubmit={handleSubmit}
                    className='flex items-end rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[16px] bg-white'
                >
                    <div className='flex flex-col w-full gap-2'>
                        <label htmlFor='name' className='font-semibold'>
                            Booking TRX ID
                            {formErrors.find((error) => error.path?.includes('booking_trx_id')) && '*'}
                        </label>
                        <div
                            className={`
                                flex
                                items-center
                                gap-[10px]
                                rounded-full
                                border 
                                px-5
                                transition-all duration-300 ease-in-out
                                ${formErrors.find((error) => error.path?.includes('booking_trx_id')) 
                                  ? 'border-[#FB2C36]' 
                                  : 'border-[#000929]'
                                }
                                focus-within:ring-2
                                focus-within:ring-[#0D903A]
                                focus-within:ring-offset-2
                              `}
                        >
                            <img
                                src='assets/images/icons/receipt-text-black.svg'
                                className='w-6 h-6'
                                alt='icon'
                            />
                            <input
                                type='text'
                                name='booking_trx_id'
                                onChange={handleChange}
                                value={formData.booking_trx_id}
                                id='name'
                                className='appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]'
                                placeholder='Write your booking trx id'
                            />
                        </div>
                    </div>
                    <div className='flex flex-col w-full gap-2'>
                        <label htmlFor='phone' className='font-semibold'>
                            Phone Number
                        </label>
                        <div
                            className={`
                                flex items-center gap-[10px]
                                rounded-full border 
                                px-5
                                transition-all duration-300 ease-in-out
                                ${formErrors.find((error) => error.path?.includes('phone_number')) 
                                  ? 'border-[#FB2C36]' 
                                  : 'border-[#000929]'
                                }
                                focus-within:ring-2
                                focus-within:ring-[#0D903A]
                                focus-within:ring-offset-2
                              `}
                        >
                            <img
                                src='assets/images/icons/call-black.svg'
                                className='w-6 h-6'
                                alt='icon'
                            />
                            <input
                                type='tel'
                                name='phone_number'
                                onChange={handleChange}
                                value={formData.phone_number}
                                id='phone'
                                className='appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]'
                                placeholder='Write your registered number'
                            />
                        </div>
                    </div>
                    <button
                        disabled={isLoading}
                        type='submit'
                        className='flex items-center justify-center rounded-full p-[12px_30px] gap-3 bg-[#0D903A] font-bold text-[#F7F7FD]'
                    >
                        <span className='text-nowrap'>
                            {isLoading ? 'Loading' : 'Check Booking'}
                        </span>
                    </button>
                </form>
                {bookingDetails && (
                    <div id='Result' className='grid grid-cols-2 gap-[30px]'>
                        <div className='flex flex-col h-fit shrink-0 rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white'>
                            <div className='flex items-center gap-4'>
                                <div className='flex shrink-0 w-[140px] h-[100px] rounded-[20px] overflow-hidden'>
                                    <img
                                        src={`${baseURL}/${bookingDetails.office.thumbnail}`}
                                        className='w-full h-full object-cover'
                                        alt='thumbnail'
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <p className='font-bold text-xl leading-[30px]'>
                                        {bookingDetails.office.name}
                                    </p>
                                    <div className='flex items-center gap-[6px]'>
                                        <img
                                            src='assets/images/icons/location.svg'
                                            className='w-6 h-6'
                                            alt='icon'
                                        />
                                        <p className='font-semibold'>{bookingDetails.office.city.name}</p>
                                    </div>
                                </div>
                            </div>
                            <hr className='border-[#F6F5FD]' />
                            <div className='flex flex-col gap-4'>
                                <h2 className='font-bold'>Customer Details</h2>
                                <div className='flex flex-col gap-2'>
                                    <h3 className='font-semibold'>Full Name</h3>
                                    <div className='flex items-center rounded-full px-5 py-3 gap-[10px] bg-[#F7F7FD]'>
                                        <img
                                            src='assets/images/icons/security-user-black.svg'
                                            className='w-6 h-6'
                                            alt='icon'
                                        />
                                        <p className='font-bold'>{bookingDetails.name}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <h3 className='font-semibold'>Started At</h3>
                                    <div className='flex items-center rounded-full px-5 py-3 gap-[10px] bg-[#F7F7FD]'>
                                        <img
                                            src='assets/images/icons/calendar-black.svg'
                                            className='w-6 h-6'
                                            alt='icon'
                                        />
                                        <p className='font-bold'>{bookingDetails.started_at}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <h3 className='font-semibold'>Ended At</h3>
                                    <div className='flex items-center rounded-full px-5 py-3 gap-[10px] bg-[#F7F7FD]'>
                                        <img
                                            src='assets/images/icons/calendar-black.svg'
                                            className='w-6 h-6'
                                            alt='icon'
                                        />
                                        <p className='font-bold'>{bookingDetails.ended_at}</p>
                                    </div>
                                </div>
                            </div>
                            <hr className='border-[#F6F5FD]' />
                            <div className='flex items-center gap-3'>
                                <img
                                    src='assets/images/icons/shield-tick.svg'
                                    className='w-[30px] h-[30px]'
                                    alt='icon'
                                />
                                <p className='font-semibold leading-[28px]'>
                                    Your privacy is secure with us.
                                </p>
                            </div>
                        </div>
                        <div className='flex flex-col h-fit shrink-0 rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white'>
                            <h2 className='font-bold'>Order Details</h2>
                            <div className='flex flex-col gap-5'>
                                {bookingDetails.is_paid ? (
                                    <div className='flex items-center justify-between'>
                                        <p className='font-semibold'>Payment Status</p>
                                        <p className='rounded-full w-fit p-[6px_16px] bg-[#0D903A] font-bold text-sm leading-[21px] text-[#F7F7FD]'>
                                            SUCCESS
                                        </p>
                                    </div>
                                ) : (
                                    <div className='flex items-center justify-between'>
                                        <p className='font-semibold'>Payment Status</p>
                                        <p className='rounded-full w-fit p-[6px_16px] bg-[#FF852D] font-bold text-sm leading-[21px] text-[#F7F7FD]'>
                                            PENDING
                                        </p>
                                    </div>
                                )}
                                <div className='flex items-center justify-between'>
                                    <p className='font-semibold'>Booking TRX ID</p>
                                    <p className='font-bold'>{bookingDetails.booking_trx_id}</p>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <p className='font-semibold'>Duration</p>
                                    <p className='font-bold'>{bookingDetails.duration} {bookingDetails.duration === 1 ? 'Day' : 'Days'} Working</p>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <p className='font-semibold'>Total Amount</p>
                                    <p className='font-bold text-[22px] leading-[33px] text-[#0D903A]'>
                                        Rp {bookingDetails.total_amount.toLocaleString('ID')}
                                    </p>
                                </div>
                            </div>
                            <hr className='border-[#F6F5FD]' />
                            <h2 className='font-bold'>Bonus Packages For You</h2>
                            <div className='flex justify-between'>
                                {officeDetails?.benefits && officeDetails?.benefits?.length > 0 ? (
                                    officeDetails?.benefits?.map(benefit => (
                                        <div key={benefit.id} className='flex items-center gap-4'>
                                            <img
                                                src={
                                                    benefit.name === 'Safe Environment' ? '/assets/images/icons/security-user.svg' :
                                                    benefit.name === 'Fast Internet Speed' ? '/assets/images/icons/wifi.svg' :
                                                    benefit.name === 'Cafetaria' ? '/assets/images/icons/coffee.svg' : 
                                                    benefit.name === 'Free Printing' ? '/assets/images/icons/printer.svg' : 
                                                    benefit.name === 'Strategic Location' ? '/assets/images/icons/map.svg' : 
                                                    benefit.name === 'Free Snack & Beverage' ? '/assets/images/icons/snack.svg' : 
                                                    benefit.name === 'Free Mineral Water' ? '/assets/images/icons/glass-water.svg' : 
                                                    benefit.name === 'Special Price for Student' ? '/assets/images/icons/coin.svg' : 
                                                    benefit.name === 'Various Facilities' ? '/assets/images/icons/couch.svg' : null
                                                }
                                                className='w-[34px] h-[34px]'
                                                alt='icon'
                                            />
                                            <div className='flex flex-col gap-[2px]'>
                                                <p className='font-bold'>
                                                    {benefit.name}
                                                </p>
                                                <p className='text-sm leading-[21px]'>
                                                {
                                                    benefit.name === 'Safe Environment' ? 'Your Peace Zone' :
                                                    benefit.name === 'Free Printing' ? 'Ink on Us' :
                                                    benefit.name === 'Special Price for Student' ? 'Learners Save More' :
                                                    benefit.name === 'Strategic Location' ? 'Close to You' :
                                                    benefit.name === 'Free Mineral Water' ? 'Hydration, On Us' :
                                                    benefit.name === 'Cafetaria' ? 'Your Food Haven' :
                                                    benefit.name === 'Fast Internet Speed' ? 'Speed You Need' :
                                                    benefit.name === 'Free Snack & Beverage' ? 'Treats on Us' :
                                                    benefit.name === 'Various Facilities' ? 'More for You' : null
                                                }
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                        <div className='flex items-center justify-end gap-[6px]'>
                                            <p>This office has no listed benefits</p>
                                        </div>
                                )}
                            </div>
                            <hr className='border-[#F6F5FD]' />
                            <div className='flex flex-col gap-[12px]'>
                                <Link to={`/customer-service/${bookingDetails?.office.slug}`}>
                                    <div
                                        href='#'
                                        className='flex items-center justify-center w-full rounded-full border border-[#000929] p-[12px_20px] gap-3 bg-white font-semibold'
                                    >
                                        <img
                                            src='assets/images/icons/call-black.svg'
                                            className='w-6 h-6'
                                            alt='icon'
                                        />
                                        <span>Call Customer Service</span>
                                    </div>
                                </Link>
                                <div>
                                    <div
                                        href='#'
                                        className={`
                                                cursor-pointer
                                                flex
                                                items-center
                                                justify-center
                                                w-full
                                                rounded-full
                                                border
                                                p-[12px_20px]
                                                gap-3
                                                ${reported ? 'bg-gray-300' : 'bg-red-600'} 
                                                font-semibold
                                            `}
                                        onClick={reported ? null : openModal}
                                    >
                                        <img
                                            src='assets/images/icons/exclamation.svg'
                                            className='w-6 h-6'
                                            alt='icon'
                                        />
                                        <span className='text-white'>Report</span>
                                    </div>
                                    {isModalOpen &&
                                        <div className='modal'>
                                            <div className='modal-content'>
                                                <div className='pb-[20px]'>
                                                    <h1 className='font-bold text-xl pb-[20px]'>Report Your Order</h1>
                                                    <p className='text-justify'>
                                                        Submitting a report means  your payment status {' '}
                                                        <a href='#' className='text-[#0D903A] hover:underline'>has not been confirmed within 24 hours</a>. 
                                                        You may receive a penalty if it turns out that you were mistaken.
                                                    </p>
                                                </div>
                                                <div className='flex flex-row gap-4 justify-end'>
                                                    <div
                                                        onClick={() => setIsModalOpen(false)}
                                                        className='cursor-pointer flex items-center justify-center rounded-full p-[12px_30px] gap-3 border border-[#000929] font-bold'
                                                    >
                                                        <span className='text-nowrap'>
                                                            Cancel
                                                        </span>
                                                    </div>
                                                    <div
                                                        className='cursor-pointer flex items-center justify-center rounded-full p-[12px_30px] gap-3 bg-[#0D903A] font-bold text-[#F7F7FD]'
                                                        onClick={handleSubmitReport}
                                                    >
                                                        <span className='text-nowrap'>
                                                            {isReporting ? 'Reporting' : 'Report'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                                {reportError && 
                                    <p className='text-sm'>Cannot submit your report. {' '}
                                        <a href='#' className='text-[#0D903A] hover:underline'>See what can you do</a>.
                                    </p>
                                }
                            </div>
                        </div>
                    </div>
                )}
                {error && (
                    <div className='bg-white flex justify-center items-center rounded-[20px] border border-[#E0DEF7] p-[30px]'>
                        <span className='font-extrabold text-red-500 '>Cannot find the data you requested</span>
                    </div>
                )}
            </section>
        </>
    )
}

export default CheckBooking