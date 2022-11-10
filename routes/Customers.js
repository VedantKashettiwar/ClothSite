const express = require('express');
const router = express.Router()

const{createCustomers, createCustomersmany, getCustomers, getCustomerOne, updateCustomers, deleteCustomers, getCustomersWithProject, getCustomersByPagination} = require('../controllers/customers')
    

router.route('/create/').post(createCustomers)
router.route('/createmany/').post(createCustomersmany)
router.route('/read/').get(getCustomers)
router.route('/readone/').get(getCustomerOne)
router.route('/readwithproject/').get(getCustomersWithProject)
router.route('/readbypagination/').get(getCustomersByPagination)
router.route('/update/:_id').put(updateCustomers)
router.route('/delete/:_id').delete(deleteCustomers)

module.exports = router

