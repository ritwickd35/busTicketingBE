const express = require("express");
const { getSeatDetails, bookSeat, getAllBookedSeats, getAllUnbookedSeats, getAllSeats, deleteSeats } = require("../controllers/ticket.controller");
const router = express.Router();


// route to view the status of any particular seat
router.get('/seat-details/:seatNum', getSeatDetails)

// route to book a particular seat
router.post('/book-seat', bookSeat)

// route to show all booked seats
router.get('/all-booked-seats', getAllBookedSeats)

// route to get all unbooked seats
router.get('/all-unbooked-seats', getAllUnbookedSeats)

// route to get all seats
router.get('/all-seats', getAllSeats)

// route to reset all seats
router.delete('/reset-seats', deleteSeats)

module.exports = router;
