const express = require('express');
const router = express.Router()

const{createOrder,readOrderOne,readOrder,updateOrder,deleteOrder} = require('../controllers/orders')
    

router.route('/create/').post(createOrder)
router.route('/readorderone/').get(readOrderOne)
router.route('/readorder/').get(readOrder)
router.route('/updateorder/:id/').put(updateOrder)
router.route('/deleteorder/:id/').delete(deleteOrder)

module.exports = router

