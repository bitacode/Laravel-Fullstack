import React, { useCallback, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import apiClient from '../service/apiClient';
import { Link } from 'react-router';
import CityCard from '../components/CityCard';
import CityWrapperLoading from '../components/CityWrapperLoading';
import Empty from '../components/Empty';
import ServerError from '../pages/ServerError';
import NotFound from '../pages/NotFound';
import Error from '../pages/Error';

const BrowseCityWrapper = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPageUrl, setNextPageUrl] = useState('/cities');
    const [isFetching, setIsFetching] = useState(false);

    const loadCities = useCallback(() => {
        if (!nextPageUrl || isFetching) return;

        setIsFetching(true);

        apiClient
            .get(nextPageUrl)
            .then((response) => {
                setCities(prevCities => [...prevCities, ...response.data.data]);
                setNextPageUrl(response.data.next_page_url);
                setIsFetching(false);
                setLoading(false);
            })
            .catch((error) => {
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
            })

    }, [nextPageUrl, isFetching])

    useEffect(() => {
        if (cities.length === 0) {
            loadCities();
        }
    }, [loadCities, cities.length])

    
    if (loading) {
        return <CityWrapperLoading />
    }

    if (error && error.type === 'server') {
        return <ServerError />;
    } if (error && error.type === 'not-found') {
        return <NotFound />;
    } if (error && error.type === 'other') {
        return <Error />;
    }

    return (
        <section id='Cities' className='flex flex-col gap-[30px] mt-[100px]' >
            <div className='w-full max-w-[1130px] mx-auto flex items-center justify-between'>
                <h2 className='font-bold text-[32px] leading-[48px] text-nowrap'>
                    You Can Choose <br />
                    Our Favorites Cities
                </h2>
                {cities.length !== 0 && 
                    <a
                        href='/cities'
                        className='rounded-full py-3 px-5 bg-white font-bold'
                    >
                        Explore All City
                    </a>
                }
            </div>
            {cities.length === 0 ?
                <section className='flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto '>
                    <Empty />
                </section> :
                <div className='swiper w-full'>
                    <div className='swiper-wrapper'>
                        <Swiper
                            direction='horizontal'
                            spaceBetween={30}
                            slidesPerView='auto'
                            slidesOffsetAfter={30}
                            slidesOffsetBefore={30}
                        >
                            {cities.map((city) => (
                                <SwiperSlide
                                    key={city.id}
                                    className='!w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]'
                                >
                                    <Link to={`/city/${city.slug}`}>
                                        <CityCard city={city} />
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            }
        </section>
    )
}

export default BrowseCityWrapper