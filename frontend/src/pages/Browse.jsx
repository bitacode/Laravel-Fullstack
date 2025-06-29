import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BrowseCityWrapper from '../wrappers/BrowseCityWrapper';
import BrowseOfficeWrapper from '../wrappers/BrowseOfficeWrapper';
import { initializeApiKey } from '../service/apiClient';
import Loading from '../components/Loading';

const Browse = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [videoUrl, setVideoUrl] = useState('');

	useEffect(() => {
		const initializeApp = async () => {
			try {
				await initializeApiKey();
				setIsLoading(false);
			} catch (error) {
				console.error('App initialization failed', error);
				setIsLoading(false);
			}
		}
	
	  initializeApp()
	}, [])
	

	const handleWatchStoryClick = () => {
		setVideoUrl('https://www.youtube.com/embed/UuOxINgTTFQ?autoplay=1');
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setVideoUrl('');
	};

	if (isLoading) {
		return <Loading />
	}

	return (
		<>
			<Navbar />
			<header className='flex flex-col w-full'>
				<section
					id='Hero-Banner'
					className='relative flex h-[720px] -mb-[93px]'
				>
					<div
						id='Hero-Text'
						className='relative flex flex-col w-full max-w-[650px] h-fit rounded-[30px] border border-[#E0DEF7] bg-white p-10 gap-[30px] mt-[70px] ml-[calc((100%-1130px)/2)] z-10'
					>
						<div className='flex items-center w-fit rounded-full py-2 px-4 gap-[10px] bg-[#000929]'>
							<img
								src='/assets/images/icons/crown-white.svg'
								className='w-5 h-5'
								alt='icon'
							/>
							<span className='font-semibold text-white'>
								We've won top productivity 500 fortunes
							</span>
						</div>
						<h1 className='font-extrabold text-[50px] leading-[60px]'>
							All Great Offices.
							<br />
							Grow Your Business.
						</h1>
						<p className='text-lg leading-8 text-[#000929]'>
							The right workplace can significantly enhance job performance and
							foster a healthy environment for career growth.
						</p>
						<div className='flex items-center gap-5'>
							<a
								href='#Fresh-Space'
								className='flex items-center rounded-full p-[20px_26px] gap-3 bg-[#0D903A]'
							>
								<img
									src='/assets/images/icons/slider-horizontal-white.svg'
									className='w-[30px] h-[30px]'
									alt='icon'
								/>
								<span className='font-bold text-xl leading-[30px] text-[#F7F7FD]'>
									Explore Now
								</span>
							</a>
							<div>
								<a
									href='#'
									className='flex items-center rounded-full border border-[#000929] p-[20px_26px] gap-3 bg-white'
									onClick={(e) => {
										e.preventDefault();
										handleWatchStoryClick();
									}}
								>
									<img
										src='/assets/images/icons/video-octagon.svg'
										className='w-[30px] h-[30px]'
										alt='icon'
									/>
									<span className='font-semibold text-xl leading-[30px]'>
										Watch Story
									</span>
								</a>

								{ isModalOpen && (
									<div className='modal'>
										<div className='modal-content'>
											<span className='close-btn' onClick={handleCloseModal}>
												X Close
											</span>
											<iframe
												width='560'
												height='315'
												src={videoUrl}
												frameBorder='0'
												allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
												allowFullScreen
											/>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
					<div
						id='Hero-Image'
						className='absolute right-0 w-[calc(100%-((100%-1130px)/2)-305px)] h-[720px] rounded-bl-[40px] overflow-hidden'
					>
						<img
							src='/assets/images/backgrounds/banner.jpg'
							className='w-full h-full object-cover'
							alt='hero-background'
						/>
					</div>
				</section>
				<div className='flex flex-col pt-[150px] pb-10 px-[120px] gap-10 bg-[#0D903A]'>
					<div className='logo-container flex items-center justify-center flex-wrap max-w-[1130px] h-[38px] mx-auto gap-[60px]'>
						<img
							src='/assets/images/logos/TESLA.svg'
							alt='clients logo'
						/>
						<img
							src='/assets/images/logos/Libra 2.svg'
							alt='clients logo'
						/>
						<img
							src='/assets/images/logos/Binance logo.svg'
							alt='clients logo'
						/>
						<img
							src='/assets/images/logos/Facebook 7.svg'
							alt='clients logo'
						/>
						<img
							src='/assets/images/logos/Microsoft 6.svg'
							alt='clients logo'
						/>
					</div>
					<div className='flex justify-center gap-[50px]'>
						<div className='flex flex-col gap[2px] text-center'>
							<p className='text-xl leading-[30px] text-[#F7F7FD]'>
								Comfortable Space
							</p>
							<p className='font-bold text-[30px] leading-[57px] text-white'>
								580M+
							</p>
						</div>
						<div className='flex flex-col gap[2px] text-center'>
							<p className='text-xl leading-[30px] text-[#F7F7FD]'>
								Startups Succeed
							</p>
							<p className='font-bold text-[30px] leading-[57px] text-white'>
								98%
							</p>
						</div>
						<div className='flex flex-col gap[2px] text-center'>
							<p className='text-xl leading-[30px] text-[#F7F7FD]'>
								Countries
							</p>
							<p className='font-bold text-[30px] leading-[57px] text-white'>
								90+
							</p>
						</div>
						<div className='flex flex-col gap[2px] text-center'>
							<p className='text-xl leading-[30px] text-[#F7F7FD]'>
								Supportive Events
							</p>
							<p className='font-bold text-[30px] leading-[57px] text-white'>
								139M+
							</p>
						</div>
					</div>
				</div>
			</header>
			<BrowseCityWrapper />
			<section
				id='Benefits'
				className='flex items-center justify-center w-[1015px] mx-auto gap-[100px] mt-[100px]'
			>
				<h2 className='font-bold text-[32px] leading-[48px] text-nowrap' >
					We Might Good <br />
					For Your Business
				</h2>
				<div className='grid grid-cols-2 gap-[30px]'>
					<div className='flex items-center gap-4'>
						<div className='flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden'>
							<img
								src='/assets/images/icons/security-user.svg'
								className='w-[34px] h-[34px]'
								alt='icon'
							/>
						</div>
						<div className='flex flex-col gap-[5px]'>
							<p className='font-bold text-lg leading-[27px]'>
								Easy Move Access
							</p>
							<p className='text-sm leading-[24px]'>
								Seamlessly accessible with minimal hassle.
							</p>
						</div>
					</div>
					<div className='flex items-center gap-4'>
						<div className='flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden'>
							<img
								src='/assets/images/icons/3dcube.svg'
								className='w-[34px] h-[34px]'
								alt='icon'
							/>
						</div>
						<div className='flex flex-col gap-[5px]'>
							<p className='font-bold text-lg leading-[27px]'>
								Flexibility Spaces
							</p>
							<p className='text-sm leading-[24px]'>
								Adaptable workspaces tailored to your needs.
							</p>
						</div>
					</div>
					<div className='flex items-center gap-4'>
						<div className='flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden'>
							<img
								src='/assets/images/icons/cup.svg'
								className='w-[34px] h-[34px]'
								alt='icon'
							/>
						</div>
						<div className='flex flex-col gap-[5px]'>
							<p className='font-bold text-lg leading-[27px]'>
								Top-Rated Office
							</p>
							<p className='text-sm leading-[24px]'>
								Recognized for exellence in workplace quality.
							</p>
						</div>
					</div>
					<div className='flex items-center gap-4'>
						<div className='flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden'>
							<img
								src='/assets/images/icons/coffee.svg'
								className='w-[34px] h-[34px]'
								alt='icon'
							/>
						</div>
						<div className='flex flex-col gap-[5px]'>
							<p className='font-bold text-lg leading-[27px]'>
								Extra Snacks Available
							</p>
							<p className='text-sm leading-[24px]'>
								Complimentary refreshments to keep you energized.
							</p>
						</div>
					</div>
					<div className='flex items-center gap-4'>
						<div className='flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden'>
							<img
								src='/assets/images/icons/home-trend-up.svg'
								className='w-[34px] h-[34px]'
								alt='icon'
							/>
						</div>
						<div className='flex flex-col gap-[5px]'>
							<p className='font-bold text-lg leading-[27px]'>
								Sustain for Business
							</p>
							<p className='text-sm leading-[24px]'>
								Designed for long-term business growth and success.
							</p>
						</div>
					</div>
				</div>
			</section>
			<BrowseOfficeWrapper />
		</>
	)
}

export default Browse;
