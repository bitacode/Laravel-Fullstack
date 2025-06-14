import React, { useState } from 'react';
import { registrationSchema } from '../types/validationRegistration';
import Navbar from '../components/Navbar';
import apiClient, { isAxiosError } from '../service/apiClient';
import Error from './Error';

const Registration = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bank_name_primary: '',
        bank_account_primary: ''
    });

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Validation form data...');
        const validation = registrationSchema.safeParse(formData);

        if (!validation.success) {
            console.error('Validation errors:', validation.error.issues);
            setFormErrors(validation.error.issues);
            return;
        }

        console.log('Form data is valid, submitting', formData);
        setLoading(true);

        try {
            const response = await apiClient.post('/register', formData);

            console.log('Form submitted successfully:', response.data);

            setFormData({
                name: '',
                email: '',
                bank_name_primary: '',
                bank_account_primary: ''
            });

            setFormErrors([]);
            setError(null);
        } catch (error) {
            if (isAxiosError(error) && error.code === 'ERR_BAD_REQUEST') {
                console.error('Error submitting form:', error);
                setError({
                    type: 'duplicate',
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
            setLoading(false);
        }
    }

    if (error) console.error(error);
    if (error && error.type === 'other') {
        return <Error />;
    }

    return (
        <>
            <Navbar />
            <section className='flex flex-1 py-10'>
                <div className='flex flex-col w-[550px] m-auto rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white'>
                    <form
                        onSubmit={handleSubmit}
                        className='relative flex flex-col justify-center max-w-[1130px] mx-auto gap-[30px]  z-20'
                    >
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='name' className='font-semibold'>
                                Company Name <span className='text-red-500'>*</span>
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
                                <input
                                    type='text'
                                    name='name'
                                    onChange={handleChange}
                                    value={formData.name}
                                    id='name'
                                    className='appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]'
                                />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='email' className='font-semibold'>
                                Company Email <span className='text-red-500'>*</span>
                            </label>
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
                                        focus-within:ring-[#0D903A]
                                    `}
                            >
                                <input
                                    type='email'
                                    name='email'
                                    onChange={handleChange}
                                    value={formData.email}
                                    id='email'
                                    className='appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]'
                                />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='bank_name_primary' className='font-semibold'>
                                Bank Account <span className='text-red-500'>*</span>
                            </label>
                            <div
                                className={`
                                    flex
                                    items-center
                                    rounded-full
                                    border
                                    ${formErrors.find((error) => error.path?.includes('bank_name_primary')) 
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
                                <select
                                    name='bank_name_primary'
                                    onChange={handleChange}
                                    value={formData.bank_name_primary}
                                    id='bank_name_primary'
                                    className='appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]'
                                >
                                    <option value='' disabled selected>Select your bank</option>
                                    <option value='BRI'>BRI (Bank Rakyat Indonesia)</option>
                                    <option value='BCA'>BCA (Bank Central Asia)</option>
                                    <option value='BNI'>BNI (Bank Negara Indonesia)</option>
                                    <option value='Mandiri'>Mandiri</option>
                                </select>
                                <span className='rotate-90'>{'>'}</span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='bank_account_primary' className='font-semibold'>
                                Bank Account Number <span className='text-red-500'>*</span>
                            </label>
                            <div
                                className={`
                                        flex
                                        items-center
                                        rounded-full
                                        border
                                        ${formErrors.find((error) => error.path?.includes('bank_account_primary')) 
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
                                <input
                                    type='text'
                                    name='bank_account_primary'
                                    onChange={handleChange}
                                    value={formData.bank_account_primary}
                                    id='bank_account_primary'
                                    className='appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]'
                                />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <button
                                type='submit'
                                disabled={loading}
                                className='flex items-center justify-center w-full rounded-full p-[16px_26px] bg-[#0D903A] font-bold text-[#F7F7FD]'
                            >
                                <span>{loading ? 'Registering...' : 'Register'}</span>
                            </button>
                            <p className='text-sm'>Using our service indicates that you agree to our {' '}
                                <a href='#' className='text-[#0D903A] hover:underline'>terms of service</a>.
                            </p>
                        </div>

                        {error && error.type === 'duplicate' &&
                            <div className='flex flex-col bg-red-100 p-5 rounded'>
                                <span className='text-red-700 text-[12px]'>
                                    Your company is already registered. Duplicate registrations violate our terms and conditions. If you are not yet approved, please wait for our confirmation
                                </span>
                            </div>
                        }
                    </form>
                </div>
            </section>
        </>
    )
}

export default Registration