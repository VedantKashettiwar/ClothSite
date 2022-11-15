const express = require('express');
const router = express.Router()

const{createCustomers, createCustomersMany, createCustomersManyByloop, getCustomers, getCustomerOne, updateCustomer, deleteCustomer, getCustomersWithProject, getCustomersByPagination, getCustomersByKeyword, getCustomersUsingPaginationByKeyword} = require('../controllers/customers')
    

router.route('/create/').post(createCustomers)
router.route('/createmany/').post(createCustomersMany)
router.route('/createmanycustomers/').post(createCustomersManyByloop)
router.route('/read/').get(getCustomers)
router.route('/readone/').get(getCustomerOne)
router.route('/readbykeyword/').get(getCustomersByKeyword)
router.route('/readwithproject/').get(getCustomersWithProject)
router.route('/readbypagination/').get(getCustomersByPagination)
router.route('/readusingkeywordbypagination/').get(getCustomersUsingPaginationByKeyword)
router.route('/update/:_id').put(updateCustomer)
router.route('/delete/:_id').delete(deleteCustomer)

module.exports = router

