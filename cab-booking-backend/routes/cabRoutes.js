// routes/cabRoutes.js

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Graph } = require('../graph');
const Cab = require('../models/ForCab'); 


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

// Get list of available cabs
router.post('/availableCabs', async (req, res) => {
    const { source, destination, passengers } = req.body;

    try {
        const cabsWithPriceAndDuration = await fetchAvailableCabsAndCalculatePrices(source, destination, passengers);
        res.json({ availableCabs: cabsWithPriceAndDuration });
    } catch (error) {
        console.error('Error fetching available cabs:', error);
        res.status(500).json({ success: false, message: 'Error fetching available cabs' });
    }
});

// Get list of available cabs
router.get('/cabs', async (req, res) => {
    try {
        const availableCabs = await Cab.find();
        res.json(availableCabs);
    } catch (error) {
        console.error('Error fetching available cabs:', error);
        res.status(500).json({ success: false, message: 'Error fetching available cabs' });
    }
});

router.get('/cabs/:id', async (req, res) => {
    const cabId = req.params.id;

    try {
        const cab = await Cab.findById(cabId);
        if (!cab) {
            return res.status(404).json({ success: false, message: 'Cab not found' });
        }

        res.json(cab);
    } catch (error) {
        console.error('Error fetching cab details:', error);
        res.status(500).json({ success: false, message: 'Error fetching cab details' });
    }
});


// Edit cab details
router.put('/cabs/:id', async (req, res) => {
    const { name, type, pricePerMinute, maxPassengers, isAvailable } = req.body;
    const { id } = req.params;

    try {
        const cab = await Cab.findById(id);
        if (!cab) {
            return res.status(404).json({ success: false, message: 'Cab not found' });
        }

        cab.name = name;
        cab.type = type;
        cab.pricePerMinute = pricePerMinute;
        cab.maxPassengers = maxPassengers;
        cab.isAvailable = isAvailable;

        await cab.save();
        res.status(200).json({ success: true, message: 'Cab details updated successfully', cab });
    } catch (error) {
        console.error('Error updating cab details:', error);
        res.status(500).json({ success: false, message: 'Error updating cab details' });
    }
});

// Delete a cab
router.delete('/cabs/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const cab = await Cab.findById(id);
        if (!cab) {
            return res.status(404).json({ success: false, message: 'Cab not found' });
        }

        await cab.remove();
        res.status(200).json({ success: true, message: 'Cab deleted successfully' });
    } catch (error) {
        console.error('Error deleting cab:', error);
        res.status(500).json({ success: false, message: 'Error deleting cab' });
    }
});

// Create a new cab
router.post('/cabs', async (req, res) => {
    const { name, pricePerMinute, maxPassengers, isAvailable } = req.body;

    try {
        const newCab = new Cab({
            name,
            pricePerMinute,
            maxPassengers,
            isAvailable
        });

        await newCab.save();
        res.status(201).json({ success: true, message: 'Cab created successfully', cab: newCab });
    } catch (error) {
        console.error('Error creating cab:', error);
        res.status(500).json({ success: false, message: 'Error creating cab' });
    }
});

module.exports = router;
