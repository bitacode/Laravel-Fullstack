import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import apiClient from '../service/apiClient';
import Loading from '../components/Loading';
import { Link } from 'react-router';
import OfficeCard from '../components/OfficeCard';
import Empty from '../components/Empty';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [categoryDetails, setCategoryDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const detailsFetched = useRef(false);

    useEffect(() => {
        apiClient
            .get('/categories')
            .then((response) => {
                setCategories(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setError({
                        type: 'server',
                        message: error
                    });
                    setLoading(false);
                } if (error.response?.status === 404) {
                    setError({
                        type: 'not-found',
                        message: error
                    });
                    setLoading(false);
                } else {
                    setError({
                        type: 'other',
                        message: error
                    });
                    setLoading(false);
                }
            })
    }, [])

    useEffect(() => {
        if (categories.length === 0 || detailsFetched.current) return;

        const fetchCategoryDetails = async () => {
            setIsLoading(true);

            try {
                const details = {};
                
                await Promise.all(
                    categories.map(async (category) => {
                        const response = await apiClient.get(`/category/${category.slug}`);
                        details[category.slug] = response.data.data;
                    })
                );
                
                setCategoryDetails(details);
                detailsFetched.current = true;
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoryDetails();
    }, [categories]);

    if (loading) {
        return <Loading />;
    }

    if (isLoading) {
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
                            Find The Office You <br />{' '}
                            <span className='text-[#0D903A]'>Need</span>
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
                            src='assets/images/thumbnails/thumbnail-details-1.png'
                            className='w-full h-full object-cover'
                            alt='hero background'
                        />
                    </div>
                </section>
            </header>
            {!categories.length === 0 ?
                <section
                    className='flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[70px] mb-[100px]'
                >
                    <Empty /> 
                </section> :
                <>
                    {categories.filter(category => categoryDetails[category.slug]?.officeSpace?.length > 0).map((category) => (
                        <section
                            id={`${category.slug}`}
                            className='flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[70px] mb-[100px]'
                            key={category.id}
                        >
                            <h2 className='font-bold text-[32px] leading-[48px] text-nowrap'>
                                {category.name}
                            </h2>
                            <div className='grid grid-cols-3 gap-[30px]'>
                                {categoryDetails[category.slug]?.officeSpace.map((office) => (
                                    <Link key={office.id} to={`/office/${office.slug}`}>
                                        <OfficeCard office={office} slug={office.slug} />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </>
            }
        </>
    )
}

export default Categories