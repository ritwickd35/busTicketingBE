const mongoose = require('mongoose')

const mongo_URL = 'mongodb://localhost:27017/busTicketing'

const Ticket = require('./models/Ticket.model')

async function main() {

    console.log('<-- connecting to mongodb via URL-->', mongo_URL)
    await mongoose.connect(mongo_URL);
    console.log('<--connected to mongo-->')
    for (let i = 0; i < 40; i++) {
        const ticket = new Ticket({
            seat_number: i + 1,
            seat_status: 'unbooked'
        })

        await ticket.save();
        console.log(`ticket ${i} saved`)

    }
}

main().then(() => {
    console.log("db updated")
})
