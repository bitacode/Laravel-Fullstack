import React, { useCallback, useEffect, useState } from 'react';
import apiClient from '../service/apiClient';
import { Link } from 'react-router';
import OfficeCard from '../components/OfficeCard';
import LoadingDots from '../components/LoadingDots';
import OfficeWrapperLoading from '../components/OfficeWrapperLoading';
import Empty from '../components/Empty';
import ServerError from '../pages/ServerError';
import NotFound from '../pages/NotFound';
import Error from '../pages/Error';

const BrowseOfficeWrapper = () => {
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPageUrl, setNextPageUrl] = useState('/offices');
    const [isFetching, setIsFetching] = useState(false);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const loadOffices = useCallback(async () => {
        if (!nextPageUrl || isFetching) return;

        setIsFetching(true);
        if (!initialLoadDone) setLoading(true);

        try {
            const response = await apiClient.get(nextPageUrl);
            setOffices(prev => {
                const newOffices = response.data.data.filter(
                    newOffice => !prev.some(office => office.id === newOffice.id)
                );
                return [...prev, ...newOffices];
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
            loadOffices();
        }
    }, [loadOffices, initialLoadDone])
    
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 500 &&
                !isFetching &&
                nextPageUrl
            ) {
                loadOffices();
            }
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadOffices, nextPageUrl, isFetching])

    if (loading) {
        return <OfficeWrapperLoading />
    }

    if (error && error.type === 'server') {
        return <ServerError />;
    } if (error && error.type === 'not-found') {
        return <NotFound />;
    } if (error && error.type === 'other') {
        return <Error />;
    }

    return (
        <section id='Fresh-Space' className='flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[100px] mb-[120px]' >
			<h2 className='font-bold text-[32px] leading-[48px] text-nowrap text-center'>
				Browse Our Fresh Space. <br />
				For Your Better Productivity.
			</h2>
            {offices.length === 0 ?
                <Empty /> :
                <div className='grid grid-cols-3 gap-[30px]'>
                    {offices.map((office) => (
                        <Link key={office.id} to={`/office/${office.slug}`}>
                            <OfficeCard office={office} slug={office.slug} />
                        </Link>
                    ))}
                </div>
            }
            {isFetching && <LoadingDots />}
        </section>
    )
}

export default BrowseOfficeWrapper