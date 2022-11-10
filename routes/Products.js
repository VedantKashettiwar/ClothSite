const express = require('express');
const router = express.Router()

const{createProducts,getProducts,getProductOne, getProductOneWithPopulate, getProductsByPagination,updateProducts,deleteProducts} = require('../controllers/products')


router.route('/create/').post(createProducts)
router.route('/read/').get(getProducts)
router.route('/readone/:_id').get(getProductOne)
router.route('/readonewithpopulate/:_id').get(getProductOneWithPopulate)
router.route('/readbypagination/').get(getProductsByPagination)
router.route('/update/:_id').put(updateProducts)
router.route('/delete/:_id').delete(deleteProducts)

module.exports = router

