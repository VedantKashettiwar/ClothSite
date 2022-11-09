const express = require('express');
const router = express.Router()

const{createCustomers, getCustomers, getCustomersO, updateCustomers, deleteCustomers} = require('../controllers/main')
    

router.route('/create/').post(createCustomers)
router.route('/read/').get(getCustomers)
router.route('/reado/:_id').get(getCustomersO)
router.route('/update/:_id').patch(updateCustomers)
router.route('/delete/:_id').delete(deleteCustomers)

module.exports = router

