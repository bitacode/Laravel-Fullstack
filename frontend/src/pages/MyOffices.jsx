import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { getSavedItems } from '../utils/bookmarkItem';
import apiClient from '../service/apiClient';
import Loading from '../components/Loading';
import { Link } from 'react-router';
import OfficeCard from '../components/OfficeCard';
import Empty from '../components/Empty';

const MyOffices = () => {
    const [offices, setOffices] = useState([]);
    const [savedOffices, setSavedOffices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const ids = getSavedItems();
        setSavedOffices(ids);

        const fetchOffices = async () => {
            try {
                const response = await apiClient.get('/offices');
                setOffices(response.data.data);
            } catch (error) {
                setError(error.message || 'Failed to load offices')
            } finally {
                setLoading(false);
            }
        }

        fetchOffices();
    }, [])

    const bookMarked = offices.filter(office => savedOffices.includes(office.id));

    console.log(bookMarked)

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <p>Error: {error}</p>
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
                            Offices You Might <br />{' '}
                            <span className='text-[#0D903A]'>Love</span>
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
                            src='assets/images/backgrounds/banner.jpg'
                            className='w-full h-full object-cover'
                            alt='hero background'
                        />
                    </div>
                </section>
            </header>
            <section
                className='flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[70px] mb-[100px]'
            >
                {bookMarked.length >> 0 ?
                    <>
                        <h2 className='font-bold text-[32px] leading-[48px] text-nowrap'>
                            Saved Offices
                        </h2>
                            <div className='grid grid-cols-3 gap-[30px]'>
                                {bookMarked.map((office) => (
                                        <Link key={office.id} to={`/office/${office.slug}`} >
                                            <OfficeCard office={office} slug={office.slug} />
                                        </Link>
                                    ))} 
                            </div> 
                    </> :
                    <Empty />
                }
            </section>
        </>
    )
}

export default MyOffices