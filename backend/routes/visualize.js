const express = require('express')
const router = express.Router()

const VisualizeController = require('../controllers/visual')

router.get('/getVisaulizeData', VisualizeController.getCountingData)


module.exports = router