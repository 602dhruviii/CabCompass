// Navbar.js
import React from 'react';
import logo from '../Assets/logo.png'; // Import your logo file
import '../Styles/Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
    
        <img src={logo} alt="Company Logo" className="logo" />
        
   
    </nav>
  );
}

export default Navbar;
