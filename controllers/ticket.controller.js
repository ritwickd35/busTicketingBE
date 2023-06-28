const Ticket = require("../models/Ticket.model");


const getSeatDetails = async (req, res) => {
    let seatNum = req.params.seatNum;
    seatNum = +seatNum; // converting to number
    if (isNaN(seatNum)) return void res.status(400).send({ seatDetails: null, status: 'failure', message: 'invalid seat number' })
    const seatDetails = await Ticket.findOne({ "seat_number": seatNum })
    if (seatDetails) {
        return void res.status(200).send({ seatDetails, status: 'success', message: 'found seat' })
    }
    return void res.status(400).send({ seatDetails: null, status: 'failure', message: 'no seat with the given details found' })

    //get a particular seat details
}

const bookSeat = async (req, res) => {
    //check if seat is unbooked
    //if unbooked book seat
    let seatNum = req.body.seatNum
    seatNum = +seatNum; // converting to number
    if (isNaN(seatNum)) return void res.status(400).send({ seatDetails: null, status: 'failure', message: 'invalid seat number' })
    const seatDetails = await Ticket.findOne({ "seat_number": seatNum })
    if (seatDetails) {
        if (seatDetails.seat_status === 'booked')
            return void res.status(400).send({ seatDetails, status: 'failure', message: 'the seat has been already booked. please choose another seat' })

        seatDetails.seat_status = 'booked'
        await seatDetails.save()

        return void res.status(200).send({ seatDetails, status: 'success', message: 'seat booked successfully' })
    }
    return void res.status(400).send({ seatDetails: null, status: 'failure', message: 'no seat found with the given detils' })

}

const getAllBookedSeats = async (req, res) => {
    const allBookedSeats = await Ticket.find({ "seat_status": "booked" });
    if (allBookedSeats.length > 0)
        return void res.status(200).send({ booked_seats: allBookedSeats, status: 'success', message: 'all booked seats' })
    return res.status(200).send({ booked_seats: allBookedSeats, status: 'success', message: 'no booked seats' })
    // show all booked seats
}

const getAllUnbookedSeats = async (req, res) => {
    // show all booked seats
    const allUnbookedSeats = await Ticket.find({ "seat_status": "unbooked" });
    if (allUnbookedSeats.length > 0)
        return void res.status(200).send({ booked_seats: allUnbookedSeats, status: 'success', message: 'all empty seats' })
    return res.status(200).send({ booked_seats: allUnbookedSeats, status: 'success', message: 'no empty seats' })
}

const getAllSeats = async (req, res) => {
    // show all booked seats
    const allSeats = await Ticket.find({});
    if (allSeats.length > 0)
        return void res.status(200).send({ seats: allSeats, status: 'success', message: 'all seats' })
    return res.status(200).send({ seats: allSeats, status: 'success', message: 'no seats' })
}

const deleteSeats = async (req, res) => {
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

    else return res.status(200).send({ seats: allSeats, status: 'success', message: 'no seats' })
}

module.exports = { getSeatDetails, bookSeat, getAllBookedSeats, getAllSeats, getAllUnbookedSeats, deleteSeats }