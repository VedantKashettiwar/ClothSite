const express = require('express');
const router = express.Router()

const{fetchMovies} = require('../controllers/movies')
    

router.route('/fetch-movies/').get(fetchMovies)

module.exports = router

