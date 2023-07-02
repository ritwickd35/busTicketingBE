const mongoose = require('mongoose')

const mongo_URL = 'mongodb://127.0.0.1:27017/busTicketing'

const Ticket = require('./models/Ticket.model')

async function main() {

    await mongoose.connect(mongo_URL);
    for (let i = 0; i < 40; i++) {
        const ticket = new Ticket({
            seat_number: i + 1,
            seat_status: 'unbooked'
        })

        await ticket.save();
        console.log('ticket saved')

    }
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
    // {
    //     seat_number: {
    //         type: Number,
    //             required: true,
    //                 index: true,
    //                     unique: true
    //     },
    //     seat_status: {
    //         type: String,
    //             required: true,
    //                 index: true,
    //         enum: ['booked', 'unbooked']
    //     },
    //     booking_date: {
    //         type: Date,
    //     },
    //     booked_by: {
    //         type: mongoose.SchemaTypes.ObjectId,
    //             ref: 'user'
    //     }
    // }


    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main().then(() => {
    console.log("db updated")
})
