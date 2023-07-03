const express = require("express");
const { getSeatDetails, bookSeat, getAllBookedSeats, getAllUnbookedSeats, getAllSeats, deleteSeats, cancelSeat, getPersonDetails } = require("../controllers/ticket.controller");
const router = express.Router();
const verifyToken = require('../services/verifyToken.service')


// route to view the status of any particular seat
router.get('/seat-details/:seatNum', getSeatDetails)

// route to book a particular seat
router.post('/book-seat', verifyToken, bookSeat)

// route to show all booked seats
router.get('/all-booked-seats', getAllBookedSeats)

// route to get all unbooked seats
router.get('/all-unbooked-seats', getAllUnbookedSeats)

// route to get all seats
router.get('/all-seats', getAllSeats)

// route to cancel booking
router.patch('/cancel-booking', verifyToken, cancelSeat)

// route to reset all seats
router.delete('/reset-seats', verifyToken, deleteSeats)

//router to get person details
router.get('/person-details/:seatNum', getPersonDetails)

module.exports = router;
