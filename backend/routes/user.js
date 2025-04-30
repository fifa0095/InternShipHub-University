const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user')

router.post('/register', UserController.register)

router.post('/login', UserController.login)

router.get('/getResume/:uid', UserController.getResume)

router.get('/getUser/:uid', UserController.getUserdata)

router.post('/updateUser', UserController.editUser)

module.exports = router