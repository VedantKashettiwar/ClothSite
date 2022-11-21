const express = require('express');
const router = express.Router()

const{fetchWeather} = require('../controllers/weather')
    

router.route('/fetch-weather/').get(fetchWeather)

module.exports = router

