const mongoose = require('mongoose')

const ticket_schema = mongoose.Schema(
    {
        seat_number: {
            type: Number,
            required: true,
            index: true,
            unique: true
        },
        seat_status: {
            type: String,
            required: true,
            index: true,
            enum: ['booked', 'unbooked']
        },
        booking_date: {
            type: Date,
        },
        booked_by: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user'
        }
    }
)

const Ticket = mongoose.model('Ticket', ticket_schema)

module.exports = Ticket;