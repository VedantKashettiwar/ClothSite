// const mongoose = require('mongoose')
// const Ajv = require("ajv")
// const ajv = new Ajv()
// const { Orders, Categorys, Customer_Infos, Payments, Products } = require('./exp')
// mongoose.connect("mongodb://localhost:27017/ClothSite").then(console.log('Connected....')).catch((err) => { console.log(err) })


// const SchemaC = {
//     type: 'object',
//     properties: {
//     name:{
//         type:'string'
//     },
//     phone:{
//         // type:Number,
//         type:'string'
//     },
//     email:{
//         type:'string'
//     },
//     dob:{
//         type:'string'
//     },
//     pass:{
//         type:'string'
//     },
//     address:{
//         type:'string'
//         }
//         },
//         required:["name","phone","email","dob","pass","address"]

// }


// const getCustomers = async (req, res) => {
//     try {
//         const result = await Customer_Infos.find()
//         res.send(result)
//     }
//     catch (err) {
//         res.send(err.message)
//     }
// }


// const getCustomersO = async (req, res) => {
//     try {
//         const data = req.body._id
//         const result = await Customer_Infos.findOne({ _id: data })
//         res.send(result)
//     }
//     catch (err) {
//         res.send(err.message)
//     }
// }


// const createCustomers = async (req, res) => {
//     try {
//         const data = req.body
//         const validate = ajv.compile(SchemaC)
//         const valid = validate(data)
//         if (!valid) throw new Error(validate.errors[0].message)
//         else {
//             const result = await Customer_Infos.insertMany([data])
//             res.send("Added Succesfully")
//         }
//     }
//     catch (err) {
//         res.send(err.message)
//     }
// }


// const updateCustomers = async (req, res) => {
//     try {
//         const data = req.body
//         const result = await Customer_Infos.findByIdAndUpdate({ _id: data._id }, data, { new: true, runValidators: true })
//         res.send(result)
//     }
//     catch (err) {
//         res.send(err.message)
//     }
// }


// const deleteCustomers = async (req, res) => {
//     try {
//         const data = req.body._id
//         const result = await Customer_Infos.deleteOne({ _id: data })
//         res.send("Deleted Succesfully")
//     }
//     catch (err) {
//         res.send(err.message)
//     }
// }

// module.exports = { getCustomers, createCustomers, deleteCustomers, getCustomersO, updateCustomers }