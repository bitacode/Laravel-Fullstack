import React, { useEffect, useState, useCallback } from 'react'
import Navbar from '../components/Navbar';
import apiClient from '../service/apiClient';
import Loading from '../components/Loading';
import LoadingDots from '../components/LoadingDots';
import CityCard from '../components/CityCard';
import { Link } from 'react-router';
import Empty from '../components/Empty';
import ServerError from '../pages/ServerError';
import NotFound from '../pages/NotFound';
import Error from '../pages/Error';

const Cities = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPageUrl, setNextPageUrl] = useState('/cities');
    const [isFetching, setIsFetching] = useState(false);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    
    const loadCities = useCallback(async () => {
        if (!nextPageUrl || isFetching) return;

        setIsFetching(true);
        if (!initialLoadDone) setLoading(true);

        try {
            const response = await apiClient.get(nextPageUrl);
            setCities(prev => {
                const newCities = response.data.data.filter(
                    newCity => !prev.some(city => city.id === newCity.id)
                );
                return [...prev, ...newCities];
            });
            setNextPageUrl(response.data.next_page_url || null);
            setInitialLoadDone(true);
        } catch (error) {
            if (error.response?.status === 500) {
                setError({
                    type: 'server',
                    message: error
                });
                setLoading(false);
                setIsFetching(false);
            } if (error.response?.status === 404) {
                setError({
                    type: 'not-found',
                    message: error
                });
                setLoading(false);
                setIsFetching(false);
            } else {
                setError({
                    type: 'other',
                    message: error
                });
                setLoading(false);
                setIsFetching(false);
            }
        } finally {
            setIsFetching(false);
            setLoading(false);
        }

    }, [nextPageUrl, isFetching, initialLoadDone])

    useEffect(() => {
        if (!initialLoadDone) {
            loadCities();
        }
    }, [loadCities, initialLoadDone])

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 100 &&
                !isFetching &&
                nextPageUrl
            ) {
                loadCities();
            }
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadCities, nextPageUrl, isFetching])

    if (loading) {
        return <Loading />;
    }

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
            <header className='flex flex-col w-full'>
                <section id='Hero-Banner' className='relative flex h-[434px]'>
                    <div
                        id='Hero-Text'
                        className='relative flex flex-col w-full max-w-[650px] h-fit rounded-[30px] border border-[#E0DEF7] p-10 gap-[30px] bg-white mt-[70px] ml-[calc((100%-1130px)/2)] z-10'
                    >
                        <h1 className='font-extrabold text-[50px] leading-[60px]'>
                            Offices Across The <br />{' '}
                            <span className='text-[#0D903A]'>World</span>
                        </h1>
                        <p className='text-lg leading-8 text-[#000929]'>
                            The right workplace can significantly enhance job performance and foster a healthy environment for career growth.
                        </p>
                    </div>
                    <div
                        id='Hero-Image'
                        className='absolute right-0 w-[calc(100%-((100%-1130px)/2)-305px)] h-[434px] rounded-bl-[40px] overflow-hidden'
                    >
                        <img
                            src='assets/images/thumbnails/thumbnails-3.png'
                            className='w-full h-full object-cover'
                            alt='hero background'
                        />
                    </div>
                </section>
            </header>
            {cities.length === 0 ?
                <section
                    className='flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[70px] mb-[120px]'
                >
                    <Empty />
                </section> :
                <>
                    <section
                        id='Fresh-Space'
                        className='flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[70px] mb-[120px]'
                        
                    >
                        <h2 className='font-bold text-[32px] leading-[48px] text-nowrap'>
                            Browse Cities
                        </h2>
                        <div className='grid grid-cols-4 gap-[55px]'>
                            {cities.map((city) => (
                                <Link key={city.id} to={`/city/${city.slug}`}>
                                    <CityCard city={city} />
                                </Link>
                            ))}
                        </div>
                    </section>
                </>
            }
            {isFetching && <LoadingDots />}
        </>
    )
}

export default Cities