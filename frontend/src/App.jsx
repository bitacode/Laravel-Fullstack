import { BrowserRouter, Route, Routes } from 'react-router';
import Browse from './pages/Browse';
import Details from './pages/Details';
import BookOffice from './pages/BookOffice';
import SuccessBooking from './pages/SuccessBooking';
import CheckBooking from './pages/CheckBooking';
import CustomerService from './pages/CustomerService';
import CityDetails from './pages/CityDetails';
import Categories from './pages/Categories';
import Cities from './pages/Cities';
import MyOffices from './pages/MyOffices';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Registration from './pages/Registration';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Browse />} />
				<Route path='/cities' element={<Cities />} />
				<Route path='/categories' element={<Categories />} />
				<Route path='/saved-offices' element={<MyOffices />} />
				<Route path='/check-booking' element={<CheckBooking />} />
				<Route path='/success-booking' element={<SuccessBooking />} />
				<Route path='/registration' element={<Registration />} />
				<Route path='/contact-us' element={<Contact />} />
				<Route path='/office/:slug' element={<Details />} />
				<Route path='/office/:slug/book' element={<BookOffice />} />
				<Route path='/customer-service/:slug' element={<CustomerService />} />
				<Route path='/city/:slug' element={<CityDetails />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
