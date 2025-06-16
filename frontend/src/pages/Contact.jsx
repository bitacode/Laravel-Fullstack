import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import apiClient, { isAxiosError } from '../service/apiClient';
import Loading from '../components/Loading';
import Error from '../pages/Error';
import NotFound from '../pages/NotFound';
import ServerError from '../pages/ServerError';
import { messageSchema } from '../types/validationMessage';
import { Link } from 'react-router';

const Contact = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [formErrors, setFormErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        apiClient
            .get('/categories')
            .then((response) => {
                setCategories(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setCategories([]);
                    setError({
                        type: 'server',
                        message: error
                    });
                    setLoading(false);
                } if (error.response?.status === 404) {
                    setCategories([]);
                    setError({
                        type: 'not-found',
                        message: error
                    });
                    setLoading(false);
                } else {
                    setCategories([]);
                    setError({
                        type: 'other',
                        message: error
                    });
                    setLoading(false);
                }
            })
    }, []);

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Validation form data...');
        const validation = messageSchema.safeParse(formData);

        if (!validation.success) {
            console.error('Validation errors:', validation.error.issues);
            setFormErrors(validation.error.issues);
            return;
        }

        console.log('Form data is valid, submitting', formData);
        setIsLoading(true);

        try {
            const response = await apiClient.post('/send-message', formData);

            console.log('Form submitted successfully:', response.data);

            setFormData({
                name: '',
                email: '',
                message: '',
            });

            setFormErrors([]);
            setError(null);
            
        } catch (error) {
            if (isAxiosError(error)) {
                console.error('Error submitting form:', error.message);
                setError({
                    type: 'unreplied',
                    message: error.response?.data?.error || error.message
                });
            } else {
                console.error('Unexpected error:', error);
                setError({
                    type: 'other',
                    message: 'An unexpected error occured'
                });
            } 
        } finally {
            setIsLoading(false);
        }
    }

    if (loading) {
        return <Loading />
    }

    if (error) console.error(error);
    if (error && error.type === 'server') {
        return <ServerError />;
    } if (error && error.type === 'not-found') {
        return <NotFound />;
    } if (error && error.type === 'other') {
        return <Error />;
    }

    return (
        <>
            <Navbar />
            <header className='flex flex-col w-full '>
                <section
                    id='Hero-Banner'
					className='relative flex h-[720px] -mb-[93px]'
                >
                    <div
                        id='Hero-Text'
						className='relative flex flex-col w-full max-w-[650px] h-fit rounded-[30px] border border-[#E0DEF7] bg-white p-10 gap-[30px] mt-[70px] ml-[calc((100%-1130px)/2)] z-10'
                    >
                        <h1 className='font-extrabold text-[50px] leading-[60px]'>
							Send A Message
						</h1>
                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col gap-5'>
                                <div className='flex flex-col'>
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
                                            id='name'
                                            onChange={handleChange}
                                            value={formData.name}
                                            className='appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]'
                                            placeholder='Write your full name'
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div
                                        className={`
                                            flex
                                            items-center
                                            rounded-full
                                            border
                                            ${formErrors.find((error) => error.path?.includes('email')) 
                                                ? 'border-[#FB2C36]' 
                                                : 'border-[#000929]'
                                            }
                                            px-5
                                            gap-[10px]
                                            transition-all
                                            duration-300
                                            focus-within:ring-2
                                            ocus-within:ring-[#0D903A]
                                        `}
                                    >
                                        <img
                                            src='/assets/images/icons/@.svg'
                                            className='w-6 h-6'
                                            alt='icon'
                                        />
                                        <input
                                            type='text'
                                            name='email'
                                            id='email'
                                            onChange={handleChange}
                                            value={formData.email}
                                            className='appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]'
                                            placeholder='Write your email'
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div
                                        className={`
                                            flex
                                            items-center
                                            rounded-[30px]
                                            border
                                            ${formErrors.find((error) => error.path?.includes('message')) 
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
                                        <textarea
                                            type='text'
                                            name='message'
                                            id='message'
                                            onChange={handleChange}
                                            value={formData.message}
                                            className='resize-none appearance-none outline-none w-full h-[120px] py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]'
                                            placeholder='Write your message'
                                        />
                                    </div>
                                </div>
                                {error && error.type === 'unreplied' &&
                                    <div className='flex flex-col bg-red-100 p-5 rounded'>
                                        <span className='text-red-700 text-[12px]'>
                                            {error && error.message}
                                        </span>
                                    </div>
                                }
                                <button
                                    type='submit'
                                    disabled={isLoading}
                                    className='flex items-center justify-center w-full rounded-full p-[16px_26px] gap-3 bg-[#0D903A] font-bold text-[#F7F7FD]'
                                >
                                    <span>{isLoading ? 'Submitting...' : 'Submit'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                    <div
						id='Hero-Image'
						className='absolute right-0 w-[calc(100%-((100%-1130px)/2)-305px)] h-[720px] rounded-bl-[40px] overflow-hidden'
					>
						<iframe
                            className='h-full w-full border-0'
                            frameBorder={0}
                            src={`https://www.google.com/maps/embed/v1/place?q=liberty&key=${import.meta.env.GMAPS_API_KEY}`}
                        />
					</div>
                </section>
                <div className='flex flex-col pt-[150px] pb-10 px-[120px] bg-[#0D903A]'>
                    <div className='flex flex-row items-start justify-between gap-12 flex-wrap w-[1130px] mx-auto'>
                        <div className='flex flex-col'>
                            <h1 className='font-extrabold text-[22px] leading-[40px] text-white'>Office Information</h1>
                            <span className='text-white leading-[35px]'>
                                123 Business Avenue, Floor 4
                                <br />
                                Makassar, Indonesia 90123
                                <br />
                                8AM - 6PM Mon-Fri
                            </span>
                            <span className='text-white leading-[35px]'>(123) 456-7890</span>
                            <span className='text-white leading-[35px]'>hello@firstoffice.com</span>
                        </div>
                        {categories.length !== 0 &&
                            <div className='flex flex-col'>
                                <h1 className='font-extrabold text-[22px] leading-[40px] text-white'>Categories</h1>
                                {categories.filter(category => category.officeSpace_count > 0).map((category) => (
                                    <Link to={{ pathname: '/categories/', hash: `#${category.slug}` }} key={category.id} >
                                        <div className='text-white leading-[35px] cursor-pointer'>
                                            {category.name}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        }
                        <div className='flex flex-col'>
                            <h1 className='font-extrabold text-[22px] leading-[40px] text-white'>Connect With Us</h1>
                            <div className='flex flex-col gap-5'>
                                <div className='flex flex-row gap-3 mt-[10px]'>
                                    <a href='#' className='w-10 h-10 bg-white flex items-center justify-center rounded-full'>
                                        <img
                                            src='/assets/images/icons/x.svg'
                                            className='w-4 h-4'
                                            alt='icon'
                                        />
                                    </a>
                                    <a href='#' className='w-10 h-10 bg-white flex items-center justify-center rounded-full'>
                                        <img
                                            src='/assets/images/icons/facebook.svg'
                                            className='w-5 h-5'
                                            alt='icon'
                                        />
                                    </a>
                                    <a href='#' className='w-10 h-10 bg-white flex items-center justify-center rounded-full'>
                                        <img
                                            src='/assets/images/icons/instagram.svg'
                                            className='w-5 h-5'
                                            alt='icon'
                                        />
                                    </a>
                                    <a href='#' className='w-10 h-10 bg-white flex items-center justify-center rounded-full'>
                                        <img
                                            src='/assets/images/icons/linkedin.svg'
                                            className='w-5 h-5'
                                            alt='icon'
                                        />
                                    </a>
                                </div>
                                <a href='#' className='bg-white rounded-full py-[12px] flex justify-center items-centers'>
                                    <span className='text-[#0D903A] font-extrabold text-[18px]'>Book A Tour</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Contact