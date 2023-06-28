const ticketRouter = require('./ticket.route')
const express = require("express");
const router = express.Router();



router.use('/bus', ticketRouter)


module.exports = router