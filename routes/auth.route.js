const express = require('express');
const { loginController, registerController, setAdminUser, getAllUsers } = require('../controllers/auth.controller');
const verifyToken = require('../services/verifyToken.service');

const router = express.Router();

router.post('/register', registerController)

router.post('/login', loginController)

router.patch('/set-admin-user', verifyToken, setAdminUser)

router.get('/all-users', getAllUsers)

module.exports = router;