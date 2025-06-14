import React, { useState, useEffect } from 'react'
import apiClient, { isAxiosError } from '../service/apiClient';
import { useParams } from 'react-router'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading';
import Error from './Error';

const CustomerService = () => {
    const { slug } = useParams();
    const [office, setOffice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = 'http://127.0.0.1:8000/storage';

    useEffect(() => {
        apiClient.get(`/office/${slug}`)
            .then((response) => {
                setOffice(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(isAxiosError(error) ? error.message : 'An error occurred');
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    return (
        <>
           <Navbar />
           <div
                id='Banner'
                className='relative w-full h-[240px] flex items-center shrink-0 overflow-hidden -mb-[50px]'
            >
                <h1 className='text-center mx-auto font-extrabold text-[40px] leading-[60px] text-white mb-5 z-20'>
                    Customer Service
                </h1>
                <div className='absolute w-full h-full bg-[linear-gradient(180deg,_rgba(0,0,0,0)_0%,#000000_91.83%)] z-10' />
                <img
                    src={`${baseUrl}/${office.thumbnail}`}
                    className='absolute w-full h-full object-cover object-top'
                    alt='thumbnail'
                />
            </div>
            {office.contacts.map((contact) => (
                <section
                    id='Check-Booking'
                    className='relative flex flex-col w-[530px] shrink-0 mx-auto mb-[10px] z-20'
                    key={contact.id} 
                >
                    <div className='flex items-end rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[16px] bg-white'>
                        <div className='flex flex-col w-full'>
                            <div className='flex items-center justify-between gap-3'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-[60px] h-[60px] rounded-full overflow-hidden'>
                                        <img
                                            src={`${baseUrl}/${contact.photo}`}
                                            className='w-full h-full object-cover'
                                            alt='photo'
                                        />
                                    </div>
                                    <div className='flex flex-col gap-[2px]'>
                                        <p className='font-bold'>{contact.name}</p>
                                        <p className='text-sm leading-[21px]'>{contact.role}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <a href={contact.telephone_number === '-' ? '#' : `tel:${contact.telephone_number}`}>
                                        <img
                                            src={contact.telephone_number === '-' ? '/assets/images/icons/call-gray.svg' : '/assets/images/icons/call-green.svg'}
                                            className='w-10 h-10'
                                            alt='icon'
                                        />
                                    </a>
                                    <a href={contact.whatsapp_number === '-' ? '#' : `https://wa.me/${contact.whatsapp_number}`}>
                                        <img
                                            src={contact.whatsapp_number === '-' ? '/assets/images/icons/chat-gray.svg' : '/assets/images/icons/chat-green.svg'}
                                            className='w-10 h-10'
                                            alt='icon'
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ))}
        </>
    )
}

export default CustomerService