const express = require('express')
const router = express.Router()

const { predictJob } = require('../controllers/ml')

router.post('/predict', predictJob)


module.exports = router