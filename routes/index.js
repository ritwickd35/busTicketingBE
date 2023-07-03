const ticketRouter = require('./ticket.route')
const authRouter = require('./auth.route')
const express = require("express");
const router = express.Router();



router.use('/bus', ticketRouter)
router.use('/auth', authRouter)

//set admin user
//get all users
//global error handler
//replace with env


module.exports = router