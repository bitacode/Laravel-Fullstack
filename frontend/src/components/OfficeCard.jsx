import React, { useEffect, useState } from 'react'
import FourRating from './FourRating';
import apiClient from '../service/apiClient';
import OfficeCardLoading from './OfficeCardLoading';

const OfficeCard = ({office, slug}) => {    
    const [officeDetails, setOfficeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const baseURL = 'http://127.0.0.1:8000/storage';
    
    useEffect(() => {
        apiClient.get(`/office/${slug}`)
        .then(response => {
            setOfficeDetails(response.data.data);
            setLoading(false);
        })
        .catch(err => {
            setError(err);
            setLoading(false);
        });
    }, [slug]);
    
    if (loading) {
        return <OfficeCardLoading />;
    }
    if (error) {
        return <div>Error loading office</div>
    };

    return (
        <div className='card'>
            <div className='flex flex-col rounded-[20px] border border-[#E0DEF7] bg-white overflow-hidden'>
                <div className='thumbnail-container relative w-full h-[200px]'>
                    <p className='absolute top-5 left-5 w-fit rounded-full p-[6px_16px] bg-[#0D903A] font-bold text-sm leading-[21px] text-[#F7F7FD]'>
                        Popular
                    </p>
                    <img
                        src={`${baseURL}/${office.thumbnail}`}
                        className='w-full h-full object-cover'
                        alt='thumbnail'
                    />
                </div>
                <div className='card-detail-container flex flex-col p-5 pb-[30px] gap-4'>
                    <h3 className='line-clamp-2 font-bold text-[22px] leading-[36px] h-[72px]'>
                        {office.name}
                    </h3>
                    <div className='flex items-center justify-between'>
                        <p className='font-semibold text-xl leading-[30px]'>
                            Rp {office.price.toLocaleString('ID')}
                        </p>
                        <div className='flex items-center justify-end gap-[6px]'>
                            <p className='font-semibold'>{office.duration} {office.duration === 1 ? 'day' : 'days'}</p>
                            <img
                                src='/assets/images/icons/clock.svg'
                                className='w-6 h-6'
                                alt='icon'
                            />
                        </div>
                    </div>
                    <hr className='border-[#F6F5FD]' />
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center justify-end gap-[6px]'>
                            <img
                                src='/assets/images/icons/location.svg'
                                className='w-6 h-6'
                                alt='icon'
                            />
                            <p className='font-semibold'>{office.city.name}</p>
                        </div>
                        {/* //TODO: Get real data using Places API key (costs 300 USD) */}
                        <div className='flex items-center justify-end gap-[6px]'>
                            <p className='font-semibold'>4.5/5</p>
                            <FourRating />
                        </div>
                    </div>
                    <hr className='border-[#F6F5FD]' />
                    <div className='flex items-center justify-between'>
                        {officeDetails.benefits && officeDetails.benefits.length > 0 ? (
                            officeDetails.benefits.map(benefit => (
                                <div key={benefit.id} className='flex items-center justify-end gap-[6px]'>
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
                                        className='w-6 h-6'
                                        alt='icon'
                                    />
                                    
                                    <p>{
                                            benefit.name === 'Safe Environment' ? 'Secure' :
                                            benefit.name === 'Free Printing' ? 'Free Printing' :
                                            benefit.name === 'Special Price for Student' ? 'Student Price' :
                                            benefit.name === 'Strategic Location' ? 'Strategic' :
                                            benefit.name === 'Free Mineral Water' ? 'Free Water' :
                                            benefit.name === 'Cafetaria' ? 'Cafetaria' :
                                            benefit.name === 'Fast Internet Speed' ? 'Fast Internet' :
                                            benefit.name === 'Free Snack & Beverage' ? 'Free S&B' :
                                            benefit.name === 'Various Facilities' ? 'Facilities' : null
                                        }
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className='flex items-center justify-end gap-[6px]'>
                                <p>This office has no listed benefits</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OfficeCard