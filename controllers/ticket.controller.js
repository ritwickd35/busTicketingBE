const { HttpStatusCode } = require("axios");
const Ticket = require("../models/Ticket.model");
const User = require("../models/User.model");

// check for valid auth message where i) user loggin in reqrd ii)Admin user type required
// create a service for user verification(user id extracted from token exists )
// check all api

const getSeatDetails = async (req, res) => {
    let seatNum = req.params.seatNum;
    seatNum = +seatNum; // converting to number

    if (isNaN(seatNum) || seatNum < 1 || seatNum > 40) return void res.status(400).send({ seatDetails: null, status: 'failure', message: 'invalid seat number' })

    const seatDetails = await Ticket.findOne({ "seat_number": seatNum }).catch(err => next(err))  // passing errors to express handler 

    if (seatDetails) {
        return void res.status(200).send({ seatDetails, status: 'success', message: 'found seat' })
    }

    return void res.status(400).send({ seatDetails: null, status: 'failure', message: 'seat not found' })
}

const getPersonDetails = async (req, res) => {
    let seatNum = req.params.seatNum;
    seatNum = +seatNum; // converting to number

    if (isNaN(seatNum) || seatNum < 1 || seatNum > 40) return void res.status(400).send({ seatDetails: null, status: 'failure', message: 'invalid seat number' })

    const seatDetails = await Ticket.findOne({ "seat_number": seatNum }).catch(err => next(err))  // passing errors to express handler 

    if (seatDetails)
        if (seatDetails.seat_status === 'booked') {
            const user = await User.findOne({ "_id": seatDetails.booked_by }, { "password": -1, "user_type": -1 }).catch(err => next(err))
            console.log(user)
            return void res.status(HttpStatusCode.Ok).send({ user, status: 'success', message: 'user details' })
        }
        else return void res.status(HttpStatusCode.NotFound).send({ seatDetails: null, status: 'failure', message: `seat number ${seatNum} not booked` })

    return void res.status(400).send({ seatDetails: null, status: 'failure', message: 'seat not found' })
}



const bookSeat = async (req, res) => {
    const userId = req.userId;
    const user = await User.findOne({ "_id": userId }).catch(err => next(err)) // passing errors to express to handle

    if (user) {
        let seatNum = req.body.seatNum;
        seatNum = +seatNum; // converting to number


        if (isNaN(seatNum) || seatNum < 1 || seatNum > 40) return void res.status(HttpStatusCode.NotFound).send({ seatDetails: null, status: 'failure', message: 'invalid seat number' })

        const seatDetails = await Ticket.findOne({ "seat_number": seatNum }).catch(err => next(err)) // passing errors to express handler

        if (seatDetails) {
            if (seatDetails.seat_status === 'booked')
                return void res.status(400).send({ seatDetails, status: 'failure', message: `seat number ${seatNum} already booked` })

            seatDetails.seat_status = 'booked'
            seatDetails.booked_by = userId
            seatDetails.booking_date = Date.now()

            await seatDetails.save().catch(err => next(err)) // passing errors to express handler

            return void res.status(HttpStatusCode.Created).send({ seatDetails, status: 'success', message: 'seat booked successfully' })
        }
        return void res.status(HttpStatusCode.NotFound).send({ seatDetails: null, status: 'failure', message: `seat number ${seatNum} not found` })
    }
    return void res.status(HttpStatusCode.NotFound).send({ seatDetails: null, status: 'failure', message: 'user not found' })
}

const cancelSeat = async (req, res) => {
    const userId = req.userId;
    const user = await User.findOne({ "_id": userId }).catch(err => next(err)) // passing errors to express to handle

    if (user) {
        const userId = req.userId;

        let seatNum = req.body.seatNum;
        seatNum = +seatNum; // converting to number

        if (isNaN(seatNum) || seatNum < 1 || seatNum > 40) return void res.status(HttpStatusCode.NotFound).send({ seatDetails: null, status: 'failure', message: 'invalid seat number' })

        const seatDetails = await Ticket.findOne({ "seat_number": seatNum }).catch(err => next(err)) // passing errors to express handler

        if (seatDetails) {
            if (seatDetails.seat_status === 'unbooked')
                return void res.status(400).send({ seatDetails, status: 'failure', message: `seat number ${seatNum} not booked` })

            const seatBookedBy = seatDetails.booked_by;
            
            if (seatBookedBy.equals(userId)) { // user match, proceed to cancellation
                await Ticket.updateOne({"_id": seatDetails._id}, { "seat_status": "unbooked", "$unset": { "booking_date": 1, "booked_by": 1 } }).catch(err => next(err)) // passing errors to express handler
                return void res.status(HttpStatusCode.Created).send({ seatDetails, status: 'success', message: 'seat cancelled successfully' })
            }
            
            return void res.status(HttpStatusCode.Unauthorized).send({ seatDetails: null, status: 'failure', message: 'this seat is not under your booking. you can only cancel a seat you have booked' })
        }
        else return void res.status(HttpStatusCode.NotFound).send({ seatDetails: null, status: 'failure', message: `seat number ${seatNum} not found` })
    }
    return void res.status(HttpStatusCode.Unauthorized).send({ seatDetails: null, status: 'failure', message: 'user not found' })
}


const getAllBookedSeats = async (req, res) => {
    // show all booked seats
    const allBookedSeats = await Ticket.find({ "seat_status": "booked" }).catch(err => next(err)) // passing errors to express to handle;
    return void res.status(HttpStatusCode.Ok).send({ booked_seats: allBookedSeats, status: 'success', message: 'booked seats' })
}

const getAllUnbookedSeats = async (req, res) => {
    // show all unbooked seats
    const allUnbookedSeats = await Ticket.find({ "seat_status": "unbooked" }).catch(err => next(err)) // passing errors to express to handle;
    return void res.status(HttpStatusCode.Ok).send({ booked_seats: allUnbookedSeats, status: 'success', message: 'empty seats' })

}

const getAllSeats = async (req, res) => {
    // show all seats
    const allSeats = await Ticket.find({}).catch(err => next(err)) // passing errors to express to handle;

    return void res.status(HttpStatusCode.Ok).send({ seats: allSeats, status: 'success', message: 'all seats' })

}

const deleteSeats = async (req, res) => {
    // fetch user details to check whether user type is admin or not
    const user = await User.findOne({ "_id": req.userId }).catch(err => next(err)) // passing errors to express to handle
    if (user)
        if (user.user_type === 'admin') {
            const start = new Date().getTime();

            await Ticket.updateMany({}, { "seat_status": "unbooked", "$unset": { "booking_date": 1, "booked_by": 1 } }).catch(err => next(err)) // passing errors to express handler;
            const end = new Date().getTime();
            return void res.status(HttpStatusCode.Ok).send({ status: 'success', message: `all seats released in ${end - start}ms` })
        }
        else return void res.status(HttpStatusCode.Unauthorized).send({ auth: false, message: 'user is not authorized for this task' })

    else return void res.status(HttpStatusCode.NotFound).send({ seatDetails: null, status: 'failure', message: 'user not found' })
}

module.exports = { getSeatDetails, bookSeat, getAllBookedSeats, getAllSeats, getAllUnbookedSeats, deleteSeats, cancelSeat, getPersonDetails }