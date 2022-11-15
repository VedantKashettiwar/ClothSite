const express = require('express');
const router = express.Router()

const{readPayments} = require('../controllers/payments')
    

router.route('/read/').get(readPayments)

module.exports = router

