const express = require('express');
const router = express.Router()

const{getCustomers} = require('../controllers/customers')
const{createCustomers} = require('../controllers/customers')
const{deleteCustomers} = require('../controllers/customers')

router.route('/').get(getCustomers)
router.route('/create/').post(createCustomers)
router.route('/delete/').delete(deleteCustomers)
module.exports = router