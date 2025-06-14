import React from 'react'
import { Link } from 'react-router'

const Navbar = () => {
    return (
        <nav>
            <div className='flex items-center justify-between  w-full max-w-[1130px] py-[22px] mx-auto'>
                <Link to='/'>
                    <img src='/assets/images/logos/RentOffice.svg' className='w-[140px]' alt='logo' />
                </Link>
                <ul className='flex items-center gap-[50px] w-fit'>
                    <Link to='/'>
                        <li>Browse</li>
                    </Link>
                    <Link to='/categories'>
                        <li>Categories</li>
                    </Link>
                    <Link to='/saved-offices'>
                        <li>My Offices</li>
                    </Link>
                    <Link to='/check-booking'>
                        <li>My Bookings</li>
                    </Link>
                    <Link to='/registration'>
                        <li>Join Us</li>
                    </Link>
                </ul>
                <a
                    href='/contact-us'
                    className='flex items-center gap-[10px] rounded-full border border-[#0000929] py-3 px-5'>
                    <img
                        src='/assets/images/icons/call.svg'
                        className='w-6 h-6'
                        alt='icon'
                    />
                    <span className='font-semibold'>Contact Us</span>
                </a>
            </div>
        </nav>
    )
}

export default Navbar