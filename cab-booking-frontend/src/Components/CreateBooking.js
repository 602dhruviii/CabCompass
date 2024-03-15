import React, { useState } from 'react';
import CongratulationsModal from '../Components/CongratulationsModal';
import '../Styles/Createbooking.css'; // Import CSS file for styles

function CreateBooking() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [availableCabs, setAvailableCabs] = useState([]);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingData, setBookingData] = useState({ cabId: null, name: '', email: '' });
  const [bookingStarted, setBookingStarted] = useState(false); // Track if booking process has started
  const [bookingSuccess, setBookingSuccess] = useState(false); // Track if booking is successful

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://cabcompass-2.onrender.com/availableCabs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source, destination, passengers }),
      });
      const data = await response.json();
      setAvailableCabs(data.availableCabs);
    } catch (error) {
      console.error('Error fetching available cabs:', error);
      setBookingMessage('Error fetching available cabs. Please try again.');
    }
  };

  const bookCab = async () => {
    try {
      const response = await fetch('https://cabcompass-2.onrender.com/bookCab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...bookingData, source, destination, passengers }),
      });
      const data = await response.json();
      setBookingMessage(data.message);
      setBookingData({ cabId: null, name: '', email: '' }); // Reset booking data
      setBookingSuccess(true);
    } catch (error) {
      console.error('Error booking cab:', error);
    }
  };


  const handleBookClick = (cabId) => {
    setBookingData({ cabId: cabId, name: '', email: '' });
    setBookingStarted(true); // Set booking process started
  };

  const closeModal = () => {
    setBookingSuccess(false); // Reset booking success state
    setBookingMessage(''); // Clear booking message
  };

  return (
    <div className="Appi">
      <h1>Cab Booking System</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="source">Source:</label>
          <input type="text" id="source" value={source} onChange={(e) => setSource(e.target.value)} />
        </div>
        <div>
          <label htmlFor="destination">Destination:</label>
          <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
        </div>
        <div>
          <label htmlFor="passengers">Passengers:</label>
          <input type="number" id="passengers" value={passengers} onChange={(e) => setPassengers(parseInt(e.target.value))} />
        </div>
        <button type="submit" className='cbtn'>Search Cabs</button>
      </form>
      {availableCabs.length > 0 && !bookingStarted && (
        <div>
          <h2>Available Cabs</h2>
          <table className="cab-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {availableCabs.map((cab) => (
                <tr key={cab._id}>
                  <td>{cab.name}</td>
                  <td>{cab.price}</td>
                  <td><button onClick={() => handleBookClick(cab._id)} className='booknow'>Book</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {bookingSuccess && (
        <CongratulationsModal onClose={closeModal} />
      )}
      {bookingStarted && (
        <div>
          <h2>Enter Booking Details</h2>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={bookingData.name} onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })} />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={bookingData.email} onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })} />
          </div>
          <button onClick={bookCab} className='cbtn'>Confirm Booking</button>
        </div>
      )}
      {bookingMessage && <p>{bookingMessage}</p>}
      {bookingSuccess && (
        <CongratulationsModal onClose={() => setBookingSuccess(false)} />
      )}
    </div>
  );
}

export default CreateBooking;
