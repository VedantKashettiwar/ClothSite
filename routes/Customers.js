const express = require('express');
const router = express.Router()

const{createCustomers, getCustomers, getCustomersO, updateCustomers, deleteCustomers} = require('../controllers/main')
    

router.route('/create/').post(createCustomers)
router.route('/read/').get(getCustomers)
router.route('/reado/').post(getCustomersO)
router.route('/update/').post(updateCustomers)
router.route('/delete/').delete(deleteCustomers)

module.exports = router

