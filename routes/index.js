const ticketRouter = require('./ticket.route')
const authRouter = require('./auth.route')
const express = require("express");
const router = express.Router();



router.use('/bus', ticketRouter)
router.use('/auth', authRouter)


module.exports = router