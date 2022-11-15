const Ajv = require("ajv")
const ajv = new Ajv()
const { Orders, Payments, Products } = require('./exp')

const createOrder = async (req, res) => {
    try {
        const SchemaOrderPlace = {
            type: 'object',
            properties: {
                cid: {
                    type: 'string'
                },
                pid: {
                    type: 'string'
                },
                pay_type: {
                    type: 'string'
                },
                pay_status: {
                    type: 'string'
                },
                colors: {
                    type: 'array'
                },
                sizes: {
                    type: 'array'
                },
                quantity
                    : {
                    type: 'integer'
                }
            },
            required: ["cid", "pid", "pay_type", "pay_status", "colors", "sizes", "quantity"]
        }
        const data = req.body
        const validate = ajv.compile(SchemaOrderPlace)
        const valid = validate(data)
        if (!valid) throw new Error(validate.errors[0].message)
        else {
            let fetchAmount = await Products.findOne({ _id: req.body.pid }, { price: 1, _id: 0 })
            fetchAmount = fetchAmount.price * req.body.quantity
            const newOrder = {
                pid: data.pid,
                cid: data.cid,
                quantity: data.quantity,
                colors: data.colors,
                sizes: data.sizes,
                amount: fetchAmount,
                total: ((fetchAmount * 18) / 100) + fetchAmount
            }
            const addOrder = new Orders(newOrder)
            const order = await addOrder.save()
            const pay = {
                amount: order.amount,
                pay_type: data.pay_type,
                pay_status: data.pay_status,
                oid: order._id,
                cid: data.cid,
                total: order.total
            }
            let addPayment = new Payments(pay)
            addPayment = await addPayment.save()
            await Orders.updateOne({ _id: order._id }, { $set: { pay_id: addPayment._id } })
            await Products.updateOne({ _id: req.body.pid }, { $inc: { stock: -req.body.quantity } })
            const showDetails = await Orders.findOne({ _id: order._id }).populate('cid').populate('pid').populate('pay_id')
            res.status(200).json(showDetails)
        }
    }
    catch (err) {
        res.status(500).json(err.message)
        console.log(err)
    }
}


const readOrderOne = async (req,res) => {
    try{
        const id = req.query.id
        const showDetails = await Orders.findOne({_id:id}).populate('cid').populate('pid').populate('pay_id')
        res.status(200).json(showDetails)
    }
    catch(err){
        res.status(500).json(err.message)
    }
}


const readOrder = async (req,res) => {
    try{
        const showDetails = await Orders.find()
        res.status(200).json(showDetails)
    }
    catch(err){
        res.status(500).json(err.message)
    }
}


const updateOrder = async (req,res) => {
    try{
        const id = req.params.id
        const data = req.body
        const result = await Orders.findByIdAndUpdate({ _id:id }, data, { new: true, runValidators: true })
        res.status(200).json(result)
    }
    catch(err){
        res.status(500).json(err.message)
    }
}


const deleteOrder = async (req,res) => {
    try{
        const data = req.params._id
        const result = await Orders.findByIdAndDelete({ _id: data })
        res.status(200).json(result)
    }
    catch(err){
        res.status(500).json(err.message)
    }
}
module.exports = { createOrder,readOrderOne,readOrder,updateOrder,deleteOrder}