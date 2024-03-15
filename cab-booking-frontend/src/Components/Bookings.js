import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/Bookings.css';

const Bookings= () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [cabNameFilter, setCabNameFilter] = useState('');
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://cabcompass-2.onrender.com/bookings');
      const bookingData = await Promise.all(response.data.map(async booking => {
        const cabResponse = await axios.get(`https://cabcompass-2.onrender.com/cabs/${booking.cabId}`);
        const cabName = cabResponse.data.name;
        return { ...booking, cabName };
      }));
      setBookings(bookingData);
      setFilteredBookings(bookingData); // Initially set filtered bookings to all bookings
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

const handleFilter = () => {
  let filtered = bookings;
  // Apply cab name filter
  if (cabNameFilter) {
    filtered = filtered.filter(booking => booking.cabName.toLowerCase().includes(cabNameFilter.toLowerCase()));
  }
  setFilteredBookings(filtered);
};


  return (
    <div className="booking-container">
      <h2>Bookings</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by cab name"
          value={cabNameFilter}
          onChange={(e) => setCabNameFilter(e.target.value)}
        />
        <button onClick={handleFilter}>Apply Filters</button>
      </div>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Cab</th>
            <th>Name</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Final Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking, index) => (
            <tr key={index}>
              <td>{booking.cabName}</td>
              <td>{booking.name}</td>
              <td>{booking.source}</td>
              <td>{booking.destination}</td>
              <td>{new Date(booking.startTime).toLocaleString()}</td>
              <td>{new Date(booking.endTime).toLocaleString()}</td>
              <td>{booking.finalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bookings;
