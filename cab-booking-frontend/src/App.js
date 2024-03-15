// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Bookings from './Components/Bookings';
import createbookinglogo from './Assets/createbook.png';
import CabDetails from './Components/CabDetails';
import CreateBooking from './Components/CreateBooking';
import Navbar from './Components/Navbar'; // Import your Navbar component
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="app">
        {/* Left panel */}
        <div className="left-panel">
          <ul>
            <li>
              <Link to="/">
              <img  src="https://img.icons8.com/ios-filled/50/000000/dashboard.png" alt="dashboard" className='link-icon'/>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/bookings">
              <img src="https://img.icons8.com/ios-filled/50/000000/booking.png" alt="booking" className='link-icon'/>
                Bookings
              </Link>
            </li>
            <li>
              <Link to="/cab-details">
              <img  src="https://img.icons8.com/ios-filled/50/000000/details-pane.png" alt="details-pane" className='link-icon'/>
                Cab Details
              </Link>
            </li>
            
            <li>
            <Link to="/createbooking">
            <img src={createbookinglogo} className='createbooking'/>
              </Link>
              
            </li>
            
          </ul>
        </div>

        {/* Right panel */}
        <div className="right-panel">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/cab-details" element={<CabDetails />} />
            <Route path="/createbooking" element={<CreateBooking />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
