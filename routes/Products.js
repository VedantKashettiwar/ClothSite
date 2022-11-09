const express = require('express');
const router = express.Router()

const{createProducts,getProducts,getProductsO,updateProducts,deleteProducts} = require('../controllers/main')


router.route('/create/').post(createProducts)
router.route('/read/').get(getProducts)
router.route('/reado/').post(getProductsO)
router.route('/update/').post(updateProducts)
router.route('/delete/').delete(deleteProducts)

module.exports = router

