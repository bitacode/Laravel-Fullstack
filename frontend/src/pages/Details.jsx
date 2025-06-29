import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import apiClient, { isAxiosError } from '../service/apiClient';
import Navbar from '../components/Navbar';
import FiveRating from '../components/FiveRating';
import { Swiper, SwiperSlide } from 'swiper/react';
import Loading from '../components/Loading';
import { isItemSaved, saveItem, unsaveItem } from '../utils/bookmarkItem';
import NotFound from './NotFound';
import Error from './Error';

const Details = () => {
    const { slug } = useParams();
    const [office, setOffice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [error, setError] = useState(null);

    const baseUrl = 'http://127.0.0.1:8000/storage';

    useEffect(() => {
        const fetchOfficeData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/office/${slug}`);
                setOffice(response.data.data);
                const saved = isItemSaved(response.data.data.id);
                setIsSaved(saved);
            } catch (error) {
                setError(isAxiosError(error) ? error.message : 'An error occured');
            } finally {
                setLoading(false);
            }
        }
        
        fetchOfficeData();
    }, [slug]);

    const bookMark = () => {
        if (!office) return;

        if (isSaved) {
            unsaveItem(office.id);
            setIsSaved(false);
            console.log('Office removed from saved items');
        } else {
            saveItem(office.id);
            setIsSaved(true);
            console.log('Office saved for later');
        }
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error />;
    }

    if (!office) {
        return <NotFound />;
    }

    return (
        <>
            <Navbar />
            <section id='Gallery' className='-mb-[50px]'>
                <div className='swiper w-full'>
                    <div className='swiper-wrapper'>
                        <Swiper
                            direction='horizontal'
                            spaceBetween={10}
                            slidesPerView='auto'
                            slidesOffsetAfter={10}
                            slidesOffsetBefore={10}
                        >
                            <SwiperSlide className='!w-fit'>
                                <div className='w-[700px] h-[550px] overflow-hidden'>
                                    <img
                                        src={`${baseUrl}/${office.thumbnail}`}
                                        className='w-full h-full object-cover'
                                        alt='thumbnail'
                                    />
                                </div>
                            </SwiperSlide>
                            {office.photos.map((photo) => (
                                <SwiperSlide key={photo.id} className='!w-fit'>
                                    <div className='w-[700px] h-[550px] overflow-hidden'>
                                        <img
                                            src={`${baseUrl}/${photo.photo}`}
                                            className='w-full h-full object-cover'
                                            alt='thumbnail'
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>
            <section id='Details' className='relative flex max-w-[1130px] mx-auto gap-[30px] mb-20 z-10'>
                <div className='flex flex-col w-full rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white'>
                    <p className='w-fit rounded-full p-[6px_16px] bg-[#0D903A] font-bold text-sm leading-[21px] text-[#F7F7FD]'>
                        Popular
                    </p>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='font-extrabold text-[32px] leading-[44px]'>
                                {office.name}
                            </h1>
                            <div className='flex items-center gap-[6px] mt-[10px]'>
                                <img
                                    src='/assets/images/icons/location.svg'
                                    className='w-6 h-6'
                                    alt='icon'
                                />
                                <p className='font-semibold'>
                                    {office.city.name}
                                </p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-[6px]'>
                            <FiveRating />
                            <p className='font-semibold text-right'>4.5/5 (19,384)</p>
                        </div>
                    </div>
                    <p className='leading-[30px]'>{office.about}</p>
                    <hr className='border-[#F6F5FD]' />
                    <h2 className='font-bold'>You Get What You Need Most</h2>
                    <div className='grid grid-cols-3 gap-x-5 gap-y-[30px]'>
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
                    <hr className='border-[#F6F5FD]' />
                    <div className='flex flex-col gap-[6px]'>
                        <h2 className='font-bold'>Office Address</h2>
                        <p>{office.name}</p>
                        <p>{office.address}</p>
                    </div>
                    <div className='overflow-hidden w-full h-[280px]'>
                        <div
                            id='my-map-display'
                            className='h-full w-full max-w-[none] bg-none'
                        >
                            <iframe
                                className='h-full w-full border-0'
                                frameBorder={0}
                                src={`https://www.google.com/maps/embed/v1/place?q=${office?.name}&key=${import.meta.env.GMAPS_API_KEY}`}
                            />
                        </div>
                    </div>
                </div>
                <div className='w-[392px] flex flex-col shrink-0 gap-[30px]'>
                    <div className='flex flex-col rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white'>
                        <div>
                            <p className='font-extrabold text-[32px] leading-[48px] text-[#0D903A]'>
                                Rp {office.price.toLocaleString('ID')}
                            </p>
                            <p className='font-semibold mt-1'>
                                For {office.duration} {office.duration === 1 ? 'day' : 'days'} working
                            </p>
                        </div>
                        <hr className='border-[#F6F5FD]' />
                        <div className='flex flex-col gap-5'>
                            {office.benefits.map((benefit) => (
                                <div key={benefit.id} className='flex items-center gap-3'>
                                    <img
                                        src='/assets/images/icons/verify.svg'
                                        className='w-[30px] h-[30px]'
                                        alt='icon'
                                    />
                                    <p className='font-semibold leading-[28px]'>{benefit.name}</p>
                                </div>
                            ))}
                        </div>
                        <hr className='border-[#F6F5FD]' />
                        <div className='flex flex-col gap-[14px]'>
                            <Link to={`/office/${office.slug}/book`} >
                                <div className='flex items-center justify-center w-full rounded-full p-[16px_26px] gap-3 bg-[#0D903A] font-bold text-[#F7F7FD]'>
                                    <img
                                        src='/assets/images/icons/slider-horizontal-white.svg'
                                        className='w-6 h-6'
                                        alt='icon'
                                    />
                                    <span>Book This Office</span>
                                </div>
                            </Link>
                            <button onClick={bookMark} className={`flex items-center justify-center w-full rounded-full border border-[#000929] p-[16px_26px] gap-3 ${isSaved ? 'bg-[#000929]' : 'bg-white'} font-semibold`}>
                                <img
                                    src={isSaved ? '/assets/images/icons/saved-added.svg' : '/assets/images/icons/save-add.svg'}
                                    className='w-6 h-6'
                                    alt='icon'
                                />
                                <span className={isSaved ? 'text-white' : 'text-black'}>{isSaved ? 'Saved' : 'Save For Later'}</span>
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[20px] bg-white'>
                        <h2 className='font-bold'>Contact Us</h2>
                        <div className='flex flex-col gap-[30px]'>
                            {office.contacts.map((contact) => (
                                <div key={contact.id} className='flex items-center justify-between gap-3'>
                                    <div className='flex items-center gap-4 min-w-0'>
                                        <div className='w-[60px] h-[60px] rounded-full overflow-hidden'>
                                            <img
                                                src={`${baseUrl}/${contact.photo}`}
                                                className='w-full h-full object-cover'
                                                alt='photo'
                                            />
                                        </div>
                                        <div className='flex flex-col gap-[2px] min-w-0 flex-1'>
                                            <p className='font-bold truncate'>{contact.name}</p>
                                            <p className='text-sm leading-[21px]'>{contact.role}</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3 shrink-0'>
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
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Details