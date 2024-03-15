// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import map from '../Assets/map.gif';
import totalbooklogo from '../Assets/totalbook.png';
import totalcabslogo from '../Assets/totalcabs.png';
import totalearninglogo from '../Assets/totalearning.png';
import '../Styles/Dashboard.css'; // Import CSS file

const Dashboard = () => {
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalCabs, setTotalCabs] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [latestBookings, setLatestBookings] = useState([]);
  useEffect(() => {
    fetchDashboardData();
    fetchLatestBookings();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const bookingResponse = await axios.get('https://cabcompass-2.onrender.com/bookings');
      const cabResponse = await axios.get('https://cabcompass-2.onrender.com/cabs');

      const totalBookingsCount = bookingResponse.data.length;
      const totalCabsCount = cabResponse.data.length;
      const totalEarningsCount = calculateTotalEarnings(bookingResponse.data);

      setTotalBookings(totalBookingsCount);
      setTotalCabs(totalCabsCount);
      setTotalEarnings(totalEarningsCount);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const calculateTotalEarnings = (bookings) => {
    return bookings.reduce((total, booking) => total + booking.finalPrice, 0);
  };
  const fetchLatestBookings = async () => {
    try {
      const response = await axios.get('https://cabcompass-2.onrender.com/bookings');
      const latestBookingsData = response.data.slice(0, 5); // Get the latest 5 bookings
      setLatestBookings(latestBookingsData);
    } catch (error) {
      console.error('Error fetching latest bookings:', error);
    }
  };

  return (
    <>
    <h2>Reports</h2>
    <div className="dashboard-container"> 
      <div className="dashboard-box"> 
      <img src={totalbooklogo} className='dashlogos'/>
        <h3>Total Bookings</h3>
        <p>{totalBookings}</p>
      </div>
      <div className="dashboard-box">
      <img src={totalcabslogo} className='dashlogos'/>
        <h3>Total Cabs</h3>
        <p>{totalCabs}</p>
      </div>
      <div className="dashboard-box"> 
      <img src={totalearninglogo} className='dashlogos'/>
        <h3>Total Earnings</h3>
        <p>&#8377;{totalEarnings}</p>
      </div>
      <div className="db"> 
      <img src={map} className='mapimg' height={'300px'} width={'420px'}style={{margin:'0%', borderRadius: '15px'}}/>
      </div>
    </div>
    <h2>Bookings</h2>
      <table className="latest-bookings-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Final Price (in Rupees)</th>
            
          </tr>
        </thead>
        <tbody>
          {latestBookings.map((booking, index) => (
            <tr key={index}>
              <td>{booking.name}</td>
              <td>{booking.source}</td>
              <td>{booking.destination}</td>
              <td>{booking.finalPrice}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Dashboard;
