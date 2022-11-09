// const mongoose = require('mongoose')
// const Ajv = require("ajv")
// const ajv = new Ajv()
// const { Products } = require('./exp')
// mongoose.connect("mongodb://localhost:27017/ClothSite").then(console.log('Connected....')).catch((err) => { console.log(err) })
// // "catid":"636a22c4e0127a08d9712b02",
// //     "name":"Oversize",
// //     "stock":"500",
// //     "price":"780",
// //     "colours":["Black","Red","Blue","Green"],
// //     "sizes":["S","M","L"],
// //     "material":"Cotton",
// //     "product_detail":"Don't wash in washing machine"

// const SchemaP = {
//     type: 'object',
//     properties: {
//     catid:{
//             type:'string'
//         },
//     name:{
//         type:'string'
//     },
//     stock:{
//         type:'integer'
//     },
//     price:{
//         type:'integer'
//     },
//     colors:{
//         type:'array'
//     },
//     sizes:{
//         type:'array'
//     },
//     material:{
//         type:'string'
//     },
//     product_detail:{
//         type:'string'
//     }
//     },
//     required:["catid","name","stock","price","colors","sizes","material","product_detail"]

// }



// const getProducts = async (req, res) => {
//     try {
//         const result = await Products.find()
//         res.send(result)
//     }
//     catch (err) {
//         res.send(err.message)
//     }
// }


// const getProductsO = async (req, res) => {
//     try {
//         const data = req.body._id
//         const result = await Products.findOne({ _id: data })
//         res.send(result)
//     }
//     catch (err) {
//         res.send(err.message)
//     }
// }


// const createProducts = async (req, res) => {
//     try {
//         const data = req.body
//         const validate = ajv.compile(SchemaP)
//         const valid = validate(data)
//         if (!valid) throw new Error(validate.errors[0].message)
//         else {
//         const result = await Products.insertMany([data])
//         res.send(result)
//         }
//     }
//     catch (err) {
//         res.send(err.message)
//     }
// }


// const updateProducts = async (req, res) => {
//     try {
//         const data = req.body
//         const result = await Products.findByIdAndUpdate({ _id: data._id }, data, { new: true, runValidators: true })
//         res.send(result)
//     }
//     catch (err) {
//         res.send(err.message)
//     }
// }


// const deleteProducts = async (req, res) => {
//     try {
//         const data = req.body._id
//         const result = await Products.deleteOne({ _id: data })
//         res.send("Deleted Succesfully")
//     }
//     catch (err) {
//         res.send(err.message)
//     }
// }

// module.exports = { getProducts, createProducts, deleteProducts, getProductsO, updateProducts }