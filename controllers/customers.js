const mongoose = require('mongoose')
const { Orders, Categorys, Customer_Infos, Payments, Products } = require('./exp')
const {CustomerSchema} = require('../Models/Customer_Infos')
mongoose.connect("mongodb://localhost:27017/ClothSite").then(console.log('Connected....')).catch((err) => { console.log(err) })





const getCustomers = async (req, res) => {
    const result = await Customer_Infos.find()
    console.log(result)
    res.send(result)
}


const createCustomers = async (req, res) => {
    const data = req.body
    console.log(data)
    const result = await Customer_Infos.insertMany([data])
    console.log(result)
    res.send("Added Succesfully")
}

const deleteCustomers = async (req, res) => {
    const data = req.body
    console.log(data)
    const result = await Customer_Infos.deleteOne([data])
    console.log(result)
    res.send("Added Succesfully")
}

module.exports = { getCustomers, createCustomers, deleteCustomers }