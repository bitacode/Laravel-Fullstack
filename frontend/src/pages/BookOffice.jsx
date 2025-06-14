import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import apiClient, { isAxiosError } from '../service/apiClient';
import Navbar from '../components/Navbar';
import { bookingSchema } from '../types/validationBooking';
import Loading from '../components/Loading';
import Error from './Error';
import LoadingDots from '../components/LoadingDOts';

const BookOffice = () => {
    const { slug } = useParams();
    const [office, setOffice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        phone_number: '',
        started_at: '',
        office_space_id: '',
        total_amount: ''
    });

    const [uniqueCode, setUniqueCode] = useState({
        unique_code: '',
    });
    const [voucher, setVoucher] = useState(null);
    const [voucherError, setVoucherError] = useState(null);

    const [formErrors, setFormErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadUniqueCode, setLoadUniqueCode] = useState(false);

    const [calculatedPrice, setCalculatedPrice] = useState(0);
    
    const navigate = useNavigate();
    const baseURL = 'http://127.0.0.1:8000/storage';

    useEffect(() => {
        console.log('Fetching office data...');
        apiClient
            .get(`/office/${slug}`)
            .then((response) => {
                console.log('Office data fetched successfully: ', response.data.data);
                setOffice(response.data.data);

                const officeSpaceId = response.data.data.id;
                const originalPrice = response.data.data.price;

                let discount = 0;
                if (voucher && originalPrice >= voucher.min_eligible_price) {
                    if (voucher.discount_type === 'percentage') {
                        discount = originalPrice * (voucher.discount_value / 100);
                    } else if (voucher.discount_type === 'fixed') {
                        discount = voucher.discount_value;
                    }
                }

                const total = Math.max(originalPrice - discount, 0);

                setCalculatedPrice(total);
                setFormData((prevData) => ({
                    ...prevData,
                    office_space_id: officeSpaceId,
                    total_amount: total
                }));

                setLoading(false);
            })
            .catch((error) => {
                if (isAxiosError(error)) {
                    console.error('Error fetching office data:', error.message);
                    setError(error.message);
                } else {
                    console.error('Unexpected error: ', error);
                    setError('An unexpected error occured');
                }
                setLoading(false);
            });
    }, [slug, voucher]);
    
    const handleUniqueCode = (e) => {
        setUniqueCode((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    }

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('Validating form data...');
        const validation = bookingSchema.safeParse(formData);
        
        if (!validation.success) {
            console.error('Validation errors:', validation.error.issues);
            setFormErrors(validation.error.issues);
            return;
        }
        
        console.log('Form data is valid, Submitting...', formData);
        setIsLoading(true);
        
        try {
            const response = await apiClient.post('/booking-transaction', formData);
            
            console.log('Form submitted successfully:', response.data);

            navigate('/success-booking', { //
                state: {
                    office,
                    booking: response.data.data,
                },
            });

        } catch (error) {
            if (isAxiosError(error)) {
                console.error('Error submitting form:', error.message);
                setError(error.response?.data?.message || error.message);
            } else {
                console.error('Unexpected error:', error);
                setError('An unexpected error occured');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const submitUniqueCode = async (e) => {
        e.preventDefault();

        setLoadUniqueCode(true);
        setVoucherError(null);
        try {
            const response = await apiClient.post(
                '/check-voucher',
                {
                    ...uniqueCode
                }
            );
            console.log('We are checking your voucher:', response.data.data);
            setVoucher(response.data.data);
            setVoucherError(null);
        } catch (error) {
            if (isAxiosError) {
                console.log('Error submitting form:', error.message);
                if (error.code === 'ERR_BAD_REQUEST') {
                    setVoucherError({type: 'not-found', message: error.message});
                } else {
                    setVoucherError({type: 'other', message: error.message});
                }
            } else {
                console.log('Unexpected error:', error);
                setVoucherError('An unexpected error occured');
            }
        } finally {
            setLoadUniqueCode(false);
        }
    }
    
    if (loading) {
        return <Loading />;
    }
    
    if (error) {
        return <Error />;
    }
    
    if (!office) {
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
                    Start Booking Your Office
                </h1>
                <div className='absolute w-full h-full bg-[linear-gradient(180deg,_rgba(0,0,0,0)_0%,#000000_91.83%)] z-10' />
                <img
                    src={`${baseURL}/${office.thumbnail}`}
                    className='absolute w-full h-full object-cover object-top'
                    alt=''
                />
            </div>
            <form
                onSubmit={handleSubmit}
                action='booking-finished.html'
                className='relative flex justify-center max-w-[1130px] mx-auto gap-[30px] mb-20 z-20'
            >
                <div className='flex flex-col shrink-0 w-[500px] h-fit rounded-[2px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white'>
                    <div className='flex items-center gap-4'>
                        <div className='flex shrink-0 w-[140px] h-[100px] rounded-[20px] overflow-hidden'>
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
                    <div className='flex flex-col gap-4'>
                        <h2 className='font-bold'>Complete The Details</h2>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='name' className='font-semibold'>
                                Full Name
                            </label>
                            <div
                                className={`
                                        flex
                                        items-center
                                        rounded-full
                                        border
                                        ${formErrors.find((error) => error.path?.includes('name')) 
                                            ? 'border-[#FB2C36]' 
                                            : 'border-[#000929]'
                                        }
                                        px-5
                                        gap-[10px]
                                        transition-all
                                        duration-300
                                        focus-within:ring-2
                                        focus-within:ring-[#0D903A]
                                    `}
                            >
                                <img
                                    src='/assets/images/icons/security-user-black.svg'
                                    className='w-6 h-6'
                                    alt='icon'
                                />
                                <input
                                    type='text'
                                    name='name'
                                    onChange={handleChange}
                                    value={formData.name}
                                    id='name'
                                    className='appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]'
                                    placeholder='Write your full name'
                                />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='phone_number' className='font-semibold'>
                                Phone Number
                            </label>
                            <div
                                className={`
                                        flex
                                        items-center
                                        rounded-full
                                        border
                                        ${formErrors.find((error) => error.path?.includes('phone_number')) 
                                            ? 'border-[#FB2C36]' 
                                            : 'border-[#000929]'
                                        }
                                        px-5
                                        gap-[10px]
                                        transition-all
                                        duration-300
                                        focus-within:ring-2
                                        focus-within:ring-[#0D903A]
                                    `}
                            >
                                <img
                                    src='/assets/images/icons/call-black.svg'
                                    className='w-6 h-6'
                                    alt='icon'
                                />
                                <input
                                    type='tel'
                                    name='phone_number'
                                    onChange={handleChange}
                                    value={formData.phone_number}
                                    id='phone_number'
                                    className='appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]'
                                    placeholder='Write your valid number'
                                />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='started_at' className='font-semibold'>
                                Started At
                            </label>
                            <div
                                className={`
                                        flex
                                        items-center
                                        rounded-full
                                        border
                                        ${formErrors.find((error) => error.path?.includes('started_at')) 
                                            ? 'border-[#FB2C36]' 
                                            : 'border-[#000929]'
                                        }
                                        px-5
                                        gap-[10px]
                                        transition-all
                                        duration-300
                                        focus-within:ring-2
                                        focus-within:ring-[#0D903A]
                                        overflow-hidden
                                    `}
                            >
                                <img
                                    src='/assets/images/icons/calendar-black.svg'
                                    className='w-6 h-6'
                                    alt='icon'
                                />
                                <input
                                    type='date'
                                    name='started_at'
                                    onChange={handleChange}
                                    value={formData.started_at}
                                    id='started_at'
                                    className='relative appearance-none outline-none w-full py-3 font-semibold [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0'
                                />
                            </div>
                        </div>
                    </div>
                    <hr className='border-[#F6F5FD]' />
                    <div className='flex items-center gap-3'>
                        <img
                            src='/assets/images/icons/shield-tick.svg'
                            className='w-[30px] h-[30px]'
                            alt='icon'
                        />
                        <p className='font-semibold leading-[28px]'>
                            We will protect your privacy to the best of our ability, allowing you to focus on your work.
                        </p>
                    </div>
                    <hr className='border-[#F6F5FD]' />
                    <div className='flex flex-col gap-[30px]'>
                        <h2 className='font-bold'>Bonus Packages For You</h2>
                        <div className='grid grid-cols-2 gap-[30px]'>
                            {office.benefits.map((benefit) => (
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
                                        <p className='font-bold text-lg leading-[24px]'>{benefit.name}</p>
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
                            ))}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col shrink-0 w-[400px] h-fit rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white'>
                    <h2 className='font-bold'>Your Order Details</h2>
                    <div className='flex flex-col gap-5'>
                        <div className='flex items-center justify-between'>
                            <p className='font-semibold'>Duration</p>
                            <p className='font-bold'>
                                {office.duration} {office.duration === 1 ? 'Day' : 'Days'} Workings
                            </p>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className='font-semibold'>Sub Total</p>
                            <p className='font-bold'>
                                Rp {office.price.toLocaleString('ID')}
                            </p>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className='font-semibold'>Unique Code</p>                            
                            {loadUniqueCode ?
                                <LoadingDots /> :
                                <>
                                    {voucher ? 
                                        <>
                                            {voucher?.discount_type === 'fixed' ?
                                                <p className='font-bold text-red-600'>
                                                    -Rp {voucher?.discount_value.toLocaleString('ID')}
                                                </p> :
                                                <p className='font-bold text-red-600'>
                                                    {voucher?.discount_value}% OFF
                                                </p>
                                            }
                                        </> :
                                <div
                                    className={`
                                            w-[150px]
                                            flex
                                            items-center
                                            rounded-full
                                            border
                                            ${(voucherError && voucherError.type === 'not-found') 
                                                ? 'border-[#FB2C36]' 
                                                : 'border-[#000929]'
                                            }
                                            pl-5
                                            pr-1
                                            gap-[10px]
                                            transition-all
                                            duration-300
                                            focus-within:ring-2
                                            focus-within:ring-[#0D903A]
                                        `}
                                >
                                    <input
                                        type='text'
                                        name='unique_code'
                                        onChange={handleUniqueCode}
                                        value={uniqueCode.unique_code}
                                        id='unique_code'
                                        className='appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]'
                                        placeholder=''
                                    />
                                    <img
                                        src='/assets/images/icons/search.svg'
                                        className='w-10 h-10 cursor-pointer'
                                        alt='icon'
                                        onClick={uniqueCode.unique_code.length < 1 ? null : submitUniqueCode}
                                    />
                                </div>
                                    }
                                </>
                            }
                        </div>
                        
                        <div className='flex items-center justify-between'>
                            <p className='font-semibold'>Grand Total</p>
                            <p className='font-bold text-[22px] leading-[33px] text-[#0D903A]'>
                                Rp{' '}
                                {calculatedPrice.toLocaleString('ID')}
                            </p>
                        </div>
                        {voucher?.min_eligible_price &&
                        
                            <span className='text-[12px]'>
                                Not applicable for transactions of Rp {voucher?.min_eligible_price.toLocaleString('ID')} or below.
                            </span>
                        }
                        <div className='relative rounded-xl p-[10px_20px] gap-[10px] bg-[#000929] text-white'>
                            <img
                                src='/assets/images/icons/Polygon 1.svg'
                                className='absolute -top-[15px] right-[10px]'
                                alt=''
                            />
                            <p className='font-semibold text-sm leading-[24px] z-10'>
                                Please pay attention to the following unique code when making the office payment.
                            </p>
                        </div>
                    </div>
                    <hr className='border-[#F6F5FD]' />
                    <h2 className='font-bold'>Send Payment To</h2>
                    <div className='flex flex-col gap-[30px]'>
                        <div className='flex items-center gap-3'>
                            <div className='w-[71px] flex shrink-0'>
                                {
                                    office.registration?.bank_name_primary === 'Mandiri' ?  
                                        <img
                                            src='/assets/images/logos/mandiri.svg'
                                            className='w-full object-contain'
                                            alt='bank logo'
                                        /> :
                                    office.registration?.bank_name_primary === 'BRI' ? 
                                        <img
                                            src='/assets/images/logos/bri.svg'
                                            className='w-full object-contain'
                                            alt='bank logo'
                                        /> :
                                    office.registration?.bank_name_primary === 'BNI' ? 
                                        <img
                                            src='/assets/images/logos/bni.svg'
                                            className='w-full object-contain'
                                            alt='bank logo'
                                        /> :
                                        <img
                                            src='/assets/images/logos/bca.svg'
                                            className='w-full object-contain'
                                            alt='bank logo'
                                        />
                                }
                            </div>
                            <div className='flex flex-col gap-[2px]'>
                                <div className='flex items-center gap-1'>
                                    <p className='font-semibold'>
                                        {office.registration?.name}
                                    </p>
                                    <img
                                        src='/assets/images/icons/verify.svg'
                                        className='w-[18px] h-[18px]'
                                        alt='icon'
                                    />
                                </div>
                                <p>{office.registration?.bank_account_primary}</p>
                            </div>
                        </div>
                        {office.registration?.bank_account_secondary &&
                            <div className='flex items-center gap-3'>
                                <div className='w-[71px] flex shrink-0'>
                                    {
                                        office.registration?.bank_name_secondary === 'Mandiri' ?  
                                            <img
                                                src='/assets/images/logos/mandiri.svg'
                                                className='w-full object-contain'
                                                alt='bank logo'
                                            /> :
                                        office.registration?.bank_name_secondary === 'BRI' ? 
                                            <img
                                                src='/assets/images/logos/bri.svg'
                                                className='w-full object-contain'
                                                alt='bank logo'
                                            /> :
                                        office.registration?.bank_name_secondary === 'BNI' ? 
                                            <img
                                                src='/assets/images/logos/bni.svg'
                                                className='w-full object-contain'
                                                alt='bank logo'
                                            /> :
                                            <img
                                                src='/assets/images/logos/bca.svg'
                                                className='w-full object-contain'
                                                alt='bank logo'
                                            />
                                    }
                                </div>
                                <div className='flex flex-col gap-[2px]'>
                                    <div className='flex items-center gap-1'>
                                        <p className='font-semibold'>
                                            {office.registration?.name}
                                        </p>
                                        <img
                                            src='/assets/images/icons/verify.svg'
                                            className='w-[18px] h-[18px]'
                                            alt='icon'
                                        />
                                    </div>
                                    <p>{office.registration?.bank_account_secondary}</p>
                                </div>
                            </div>
                        }
                    </div>
                    <hr className='border-[#F6F5FD]' />
                    <div className='flex flex-col gap-2'>
                        <button
                            type='submit'
                            disabled={isLoading}
                            className='flex items-center justify-center w-full rounded-full p-[16px_26px] bg-[#0D903A] font-bold text-[#F7F7FD]'
                        >
                            <span>{isLoading ? 'Loading...' : "I've Already Paid"}</span>
                        </button>
                        <p className='text-sm'>Using our service indicates that you agree to our {' '}
                            <a href='#' className='text-[#0D903A] hover:underline'>terms of service</a>.
                        </p>
                    </div>
                </div>
            </form>
        </>
    )
}

export default BookOffice;