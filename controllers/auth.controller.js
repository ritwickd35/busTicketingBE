const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const secret = 'samplesecret';

const getAllUsers = async (req, res) => {
    const users = await User.find({});
    res.status(200).send({ status: "success", users })
}

const setAdminUser = async (req, res) => {
    const userId = req.userId;
    const user = await User.findOne({ "_id": userId });
    if (user) {
        if (user.user_type === 'admin') return void res.status(409).send({ status: "failure", message: "user is already admin", user })
        const writeableUserDoc = user.toObject()
        writeableUserDoc.user_type = 'admin';
        await User.findOneAndUpdate({ "_id": writeableUserDoc._id }, writeableUserDoc, { upsert: false })
        return void res.status(200).send({ status: "success", message: "user type updated to admin", user: writeableUserDoc })
    }
    else return void res.status(404).send({ status: "failure", message: "no user found from the decoded token" })
}

const registerController = async (req, res) => {
    const { name, email, password } = req.body; // getting name, email, password

    if (!name || !email || !password) return void res.status(500).send({ status: 'failure', message: "required fields missing to create an user" }) //name, email or password missing

    try {
        const userExist = await User.findOne({ email })
        if (userExist) return void res.status(409).send({ status: "failure", message: "user already exists. please login", userExist })

        const user = await User.create({
            name, email, password, user_type: 'normal'
        })
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: 3600 }) // creating a new token

        res.status(200).send({ status: 'success', message: 'user created', token })
    } catch (e) {
        return void res.status(500).send({ status: 'failure', message: "There was a problem in registering the user" + e })
    }
}

const loginController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return void res.status(500).send({ status: 'failure', message: "required fields missing to log in an user" })

    const user = await User.findOne({ "email": email })
    if (user) // if user found, compare 
    {
        bcrypt.compare(password, user.password, function (err, isMatch) {
            if (err) return void res.status(500).send({ status: 'failure', message: "there was a problem in logging in the user" });

            if (isMatch) {
                const token = jwt.sign({ id: user._id }, secret, {
                    expiresIn: 3600 // expires in 24 hours
                });
                return void res.status(200).send({ status: 'success', message: 'logged in', token, user })
            }
            else return void res.status(401).send({ status: 'failure', message: "wrong password" })
        });
    }

    else return void res.status(404).send({ status: 'failure', message: 'No user found.' });
}

module.exports = { registerController, loginController, setAdminUser, getAllUsers }