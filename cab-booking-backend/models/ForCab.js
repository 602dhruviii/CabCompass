const mongoose = require('mongoose');

const cabSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pricePerMinute: { type: Number, required: true },
    maxPassengers: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true }
});

const Cab = mongoose.model('Cab', cabSchema);

module.exports = Cab;
