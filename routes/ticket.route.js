const express = require("express");
const Ticket = require("../models/Ticket.model");
const router = express.Router();


// ticket routes


// one route to view the status of any particular seat
// one route to book a particular seat
// one to show all booked seats
// one to show all unbooked seats
// one to show all seats
// one to reset all seats to unbooked

router.get('/seat-details/:seatNum', async (req, res) => {
    const seatNum = req.params.seatNum;
    const seatDetails = await Ticket.findOne({ "seat_number": seatNum })
    if (seatDetails) {
        console.log("found seat with seat number", seatDetails)
        return void res.status(200).send({ seatDetails, status: 'success', message: 'found seat' })
    }
    return void res.status(400).send({ seatDetails: null, status: 'failure', message: 'no seat with the given details found' })

    //get a particular seat details
})

router.post('/book-seat', async (req, res) => {
    //check if seat is unbooked
    //if unbooked book seat
    const seatNum = req.body.seatNum
    const seatDetails = await Ticket.findOne({ "seat_number": seatNum })
    if (seatDetails) {
        console.log("found seat with seat number", seatDetails)
        if (seatDetails.seat_status === 'booked')
            return void res.status(400).send({ seatDetails, status: 'failure', message: 'the seat has been already booked. please choose another seat' })

        seatDetails.seat_status = 'booked'
        await seatDetails.save()

        return void res.status(200).send({ seatDetails, status: 'success', message: 'seat booked successfully' })
    }
    return void res.status(400).send({ seatDetails: null, status: 'failure', message: 'no seat found with the gib=ven detils' })

})

router.get('/all-booked-seats', async (req, res) => {
    const allBookedSeats = await Ticket.find({ "seat_status": "booked" });
    if (allBookedSeats.length > 0)
        return void res.status(200).send({ booked_seats: allBookedSeats, status: 'success', message: 'all booked seats' })
    return res.status(200).send({ booked_seats: allBookedSeats, status: 'success', message: 'no booked seats' })
    // show all booked seats
})

router.get('/all-unbooked-seats', async (req, res) => {
    // show all booked seats
    const allUnbookedSeats = await Ticket.find({ "seat_status": "unbooked" });
    if (allUnbookedSeats.length > 0)
        return void res.status(200).send({ booked_seats: allUnbookedSeats, status: 'success', message: 'all empty seats' })
    return res.status(200).send({ booked_seats: allUnbookedSeats, status: 'success', message: 'no empty seats' })

})


router.get('/all-seats', async (req, res) => {
    // show all booked seats
    const allSeats = await Ticket.find({});
    if (allSeats.length > 0)
        return void res.status(200).send({ seats: allSeats, status: 'success', message: 'all seats' })
    return res.status(200).send({ seats: allSeats, status: 'success', message: 'no seats' })

})

router.delete('/all-unbooked-seats', async (req, res) => {
    // show all booked seats
    const allSeats = await Ticket.find({});
    if (allSeats.length > 0) {
        const promisesArray = []
        allSeats.forEach(seat => {
            seat['seat_status'] = "unbooked";
            delete seat.booked_by;
            delete seat.booking_date;
            promisesArray.push(
                Ticket.findOneAndUpdate({ "_id": seat._id }, seat, { upsert: false })
            )
        })
        Promise.allSettled(promisesArray).then(() => {
            return void res.status(200).send({ status: 'success', message: 'all seats released' })
        })
    }

    return res.status(200).send({ seats: allSeats, status: 'success', message: 'no seats' })

})

module.exports = router;
