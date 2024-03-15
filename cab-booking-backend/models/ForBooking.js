const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    cabId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cab', required: true },
    finalPrice: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
