const express = require('express');
const router = express.Router()

const{createProducts,getProducts,getProductsO,updateProducts,deleteProducts} = require('../controllers/main')


router.route('/create/').post(createProducts)
router.route('/read/').get(getProducts)
router.route('/reado/:_id').post(getProductsO)
router.route('/update/:_id').patch(updateProducts)
router.route('/delete/:_id').delete(deleteProducts)

module.exports = router

