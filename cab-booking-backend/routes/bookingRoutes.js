const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Graph } = require('../graph');
const Booking = require('../models/ForBooking');
const Cab = require('../models/ForCab');
const nodemailer = require('nodemailer');
const cronJobs = require('../cronJobs');
const fs = require('fs');
const emailimage = fs.readFileSync('./routes/emailimage.gif');

async function sendEmail(email, subject, text) {
    // Create a transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'dhruvi1267.be21@chitkarauniversity.edu.in', 
        pass: 'nnpk xidl uynk afqz' 
      }
    });
  
    // Define email options
    let mailOptions = {
      from: 'dhruvi1267.be21@chitkarauniversity.edu.in', 
      to: email, 
      subject: subject, 
      html: text,
      attachments: [{
        filename: 'emailimage.gif',
        content: emailimage,
        encoding: 'base64',
        cid: 'unique@nodemailer.com' // Same cid value as used in the HTML
    }]
    };
    await transporter.sendMail(mailOptions);
  }

  // Define the graph
const graph = new Graph();
const edges = [
    ['A', 'B', 5],
    ['A', 'C', 7],
    ['B', 'E', 20],
    ['B', 'D', 15],
    ['C', 'D', 5],
    ['C', 'E', 35],
    ['D', 'F', 20],
    ['E', 'F', 10]
];

edges.forEach(([source, destination, weight]) => {
    graph.addNode(source);
    graph.addNode(destination);
    graph.addEdge(source, destination, weight);
});

cronJobs.start();

// Function to fetch available cabs and calculate prices
async function fetchAvailableCabsAndCalculatePrices(source, destination, passengers) {
    try {
      // Calculate shortest path and duration
      const { path, distance } = graph.shortestPath(source, destination);
      console.log("Shortest path:", path);
      console.log("Shortest duration:", distance);
  
      const availableCabs = await Cab.find({ isAvailable: true, maxPassengers: { $gte: passengers } });
      const cabsWithPriceAndDuration = availableCabs.map((cab) => {
        const price = distance * cab.pricePerMinute;
        return { ...cab.toObject(), duration: distance, price };
      });
      return cabsWithPriceAndDuration;
    } catch (error) {
      console.error('Error fetching available cabs:', error);
      throw new Error('Error fetching available cabs');
    }
  }

router.post('/bookCab', async (req, res) => {
    const { email, name, source, destination, cabId, passengers } = req.body;
  
    try {
        // Fetch the selected cab
        const selectedCab = await Cab.findById(cabId);
        if (!selectedCab) {
            return res.status(404).json({ success: false, message: 'Cab not found' });
        }
  
        // Fetch available cabs and calculate prices
        const cabsWithPriceAndDuration = await fetchAvailableCabsAndCalculatePrices(source, destination, passengers);
  
        // Find the corresponding cab with price from available cabs list
        const cabWithPrice = cabsWithPriceAndDuration.find(cab => cab._id.toString() === cabId);
        if (!cabWithPrice) {
            return res.status(404).json({ success: false, message: 'Cab not found in the available list' });
        }
  
        // Use the price from the available cabs list as the final price
        const finalPrice = cabWithPrice.price;
  
        // Calculate end time by adding duration to current time
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + (cabWithPrice.duration * 60000)); // Convert duration to milliseconds
  
        // Create a new booking
        const booking = new Booking({
            email,
            name,
            source,
            destination,
            cabId,
            finalPrice,
            startTime,
            endTime
        });
  
        // Save the booking to the database
        await booking.save();

        selectedCab.isAvailable = false;
        await selectedCab.save();
        // Send email to user
        const emailSubject = '🚖 CabCompass: Congratulations on Your Booking Confirmation! 🌟';
        const emailHTML = `
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              border-radius: 5px;
              padding: 20px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: orange;
            }
            p {
              line-height: 1.6;
            }
            .details {
              margin-top: 20px;
              padding: 10px;
              background-color: #f9f9f9;
              border-radius: 5px;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 5px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚖 CabCompass</h1>
            <p>Hello ${name},</p>
            <p>We are delighted to inform you that your booking with CabCompass has been confirmed!</p>
            <div class="details">
              <p><strong>Source:</strong> ${source}</p>
              <p><strong>Destination:</strong> ${destination}</p>
              <p><strong>Final Price:</strong> ${finalPrice}</p>
              <p><strong>Start Time:</strong> ${startTime}</p>
              <p><strong>End Time:</strong> ${endTime}</p>
            </div>
            <p>We are committed to providing you with the best service and ensuring a comfortable journey for you.</p>
            <p>If you have any questions or need further assistance, please feel free to reach out to us at any time.</p>
            <p>Thank you for choosing CabCompass. We look forward to serving you soon!</p>
            <p>Best regards,</p>
            <p>The CabCompass Team 🚗</p>
          </div>
        </body>
        </html>
        `;
        
        // You can then use this emailHTML in your sendEmail function
        await sendEmail(email, emailSubject, emailHTML);  

  
        res.status(201).json({ success: true, message: 'Booking confirmed', booking });
    } catch (error) {
        console.error('Error booking cab:', error);
        res.status(500).json({ success: false, message: 'Error booking cab' });
    }
  });

  // Add a new route to fetch all bookings
// Get list of bookings
router.get('/bookings', async (req, res) => {
    try {
      const bookings = await Booking.find({});
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ success: false, message: 'Error fetching bookings' });
    }
  });

module.exports = router;
