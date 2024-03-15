import React, { useState, useEffect } from 'react';
import axios from 'axios';
import car from '../Assets/car.png';
import '../Styles/CabDetails.css'; // Import CSS file for styles

const CabDetails = () => {
  const [cabs, setCabs] = useState([]);
  const [filter, setFilter] = useState('All');

  const [newCab, setNewCab] = useState({
    name: '',
    pricePerMinute: '',
    maxPassengers: '',
    isAvailable: true // Assuming new cabs are available by default
  });

  useEffect(() => {
    fetchCabs();
  }, []);

  const fetchCabs = async () => {
    try {
      const response = await axios.get('https://cabcompass-2.onrender.com/cabs');
      setCabs(response.data);
    } catch (error) {
      console.error('Error fetching cabs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCab(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://cabcompass-2.onrender.com/cabs', newCab);
      alert('Cab details added successfully!');
      fetchCabs(); // Fetch updated list of cabs after adding a new one
      setNewCab({
        name: '',
        type: '',
        pricePerMinute: '',
        maxPassengers: '',
        isAvailable: true
      });
    } catch (error) {
      console.error('Error adding cab details:', error);
    }
  };

  const handleEdit = async (id) => {
    // Find the cab object to edit by its id
    const cabToEdit = cabs.find(cab => cab._id === id);
  
    // Prompt the user for new values or use existing ones as defaults
    const newName = prompt('Enter new name:', cabToEdit.name) || cabToEdit.name;
    const newPricePerMinute = prompt('Enter new price per minute:', cabToEdit.pricePerMinute) || cabToEdit.pricePerMinute;
    const newMaxPassengers = prompt('Enter new max passengers:', cabToEdit.maxPassengers) || cabToEdit.maxPassengers;
    const isAvailableInput = prompt('Is available? (Yes/No)', cabToEdit.isAvailable ? 'Yes' : 'No');
    const newIsAvailable = isAvailableInput.toLowerCase() === 'yes';
  
    // Update the cab details in the backend
    try {
      await axios.put(`https://cabcompass-2.onrender.com/cabs/${id}`, {
        name: newName,
        pricePerMinute: newPricePerMinute,
        maxPassengers: newMaxPassengers,
        isAvailable: newIsAvailable
      });
      alert('Cab details updated successfully!');
      fetchCabs(); // Fetch updated list of cabs after editing
    } catch (error) {
      console.error('Error updating cab details:', error);
    }
  };
  
  
  const handleDelete = async (id) => {
    // Confirm with the user before deleting
    const confirmDelete = window.confirm('Are you sure you want to delete this cab?');
    if (!confirmDelete) return;
  
    // Send a DELETE request to the backend
    try {
      await axios.delete(`http://localhost:5000/cabs/${id}`);
      alert('Cab deleted successfully!');
      fetchCabs(); // Fetch updated list of cabs after deleting
    } catch (error) {
      console.error('Error deleting cab:', error);
    }
  };
  
  const filteredCabs = cabs.filter(cab => {
    if (filter === 'Available') {
      return cab.isAvailable;
    } else if (filter === 'Not Available') {
      return !cab.isAvailable;
    }
    return true; // 'All' option, return all cabs
  });
  return (
    <>
    <h2>Cab Details</h2>
    <div className="cab-form-container">
      <form onSubmit={handleSubmit} className="cab-form">
        <label>
          Name:
          <input type="text" name="name" value={newCab.name} onChange={handleChange} required />
        </label>
        <label>
          Price Per Minute:
          <input type="number" name="pricePerMinute" value={newCab.pricePerMinute} onChange={handleChange} required />
        </label>
        <label>
          Max Passengers:
          <input type="number" name="maxPassengers" value={newCab.maxPassengers} onChange={handleChange} required />
        </label>
        <button type="submit">Add Cab</button>
      </form>
      <img
        src={car}
        className="car-moving" // Apply moving class conditionally    
      />
    </div>
    <div className="filter-container">
        Search By Availability:&nbsp;&nbsp;&nbsp;
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className='filter-dropdown'>
          <option value="All">All</option>
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
        </select>
      </div>
      <table className="cab-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price Per Minute</th>
            <th>Max Passengers</th>
            <th>Is Available</th>
            <th>Action</th> {/* New column for actions */}
          </tr>
        </thead>
        <tbody>
          {filteredCabs.map((cab, index) => (
            <tr key={index}>
              <td>{cab.name}</td>
              <td>{cab.pricePerMinute}</td>
              <td>{cab.maxPassengers}</td>
              <td>{cab.isAvailable ? 'Yes' : 'No'}</td>
              <td>
              <td>
              <button className="edit-btn" onClick={() => handleEdit(cab._id)}>Edit</button> {/* Edit button */}
              <button className="delete-btn" onClick={() => handleDelete(cab._id)}>Delete</button> {/* Delete button */}
            </td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default CabDetails;
