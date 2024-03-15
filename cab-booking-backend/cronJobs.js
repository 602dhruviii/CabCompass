const cron = require("node-cron");
const Booking = require("./models/ForBooking");
const Cab = require("./models/ForCab");

function startCronJobs() {
    // cab availability after end time
    cron.schedule("* * * * *", async () => {
        try {
            const currentTime = new Date();
            // Find all bookings where the end time has passed
            const expiredBookings = await Booking.find({
                endTime: { $lt: currentTime },
            });
            // Update the availability of corresponding cabs
            for (const booking of expiredBookings) {
                const cab = await Cab.findById(booking.cabId);
                if (cab) {
                    cab.isAvailable = true;
                    await cab.save();
                }
            }
        } catch (error) {
            console.error("Error updating cab availability:", error);
        }
    });
}

module.exports = { start: startCronJobs };
