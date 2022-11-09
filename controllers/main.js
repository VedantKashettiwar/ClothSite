const mongoose = require('mongoose')
const Ajv = require("ajv")
const ajv = new Ajv()
const {Customer_Infos, Products} = require('./exp')
mongoose.connect("mongodb://localhost:27017/ClothSite").then(console.log('Connected....')).catch((err) => { console.log(err) })

//schemas of customer, product
const SchemaC = {
    type: 'object',
    properties: {
    name:{
        type:'string'
    },
    phone:{
        // type:Number,
        type:'string'
    },
    email:{
        type:'string'
    },
    dob:{
        type:'string'
    },
    pass:{
        type:'string'
    },
    address:{
        type:'string'
        }
        },
        required:["name","phone","email","dob","pass","address"]

}
const SchemaP = {
    type: 'object',
    properties: {
    catid:{
            type:'string'
        },
    name:{
        type:'string'
    },
    stock:{
        type:'integer'
    },
    price:{
        type:'integer'
    },
    colors:{
        type:'array'
    },
    sizes:{
        type:'array'
    },
    material:{
        type:'string'
    },
    product_detail:{
        type:'string'
    }
    },
    required:["catid","name","stock","price","colors","sizes","material","product_detail"]

}




//customers function
const getCustomers = async (req, res) => {
    try {
        const result = await Customer_Infos.find()
        res.send(result)
    }
    catch (err) {
        res.send(err.message)
    }
}


const getCustomersO = async (req, res) => {
    try {
        const data = req.params._id
        console.log(data)
        const result = await Customer_Infos.findOne({ _id: data })
        res.send(result)
    }
    catch (err) {
        res.send(err.message)
    }
}


const createCustomers = async (req, res) => {
    try {
        const data = req.body
        const validate = ajv.compile(SchemaC)
        const valid = validate(data)
        if (!valid) throw new Error(validate.errors[0].message)
        else {
            const result = await Customer_Infos.insertMany([data])
            res.send("Added Succesfully")
        }
    }
    catch (err) {
        res.send(err.message)
    }
}


const updateCustomers = async (req, res) => {
    try {
        const data = req.body
        const result = await Customer_Infos.findByIdAndUpdate({ _id: req.params._id }, data, { new: true, runValidators: true })
        res.send(result)
    }
    catch (err) {
        res.send(err.message)
    }
}


const deleteCustomers = async (req, res) => {
    try {
        const data = req.params._id
        console.log(data)
        const result = await Customer_Infos.deleteOne({ _id: data })
        res.send("Deleted Succesfully")
    }
    catch (err) {
        res.send(err.message)
    }
}


//products function
const getProducts = async (req, res) => {
    try {
        const result = await Products.find()
        res.send(result)
    }
    catch (err) {
        res.send(err.message)
    }
}


const getProductsO = async (req, res) => {
    try {
        const data = req.params._id
        const result = await Products.findOne({ _id: data })
        res.send(result)
    }
    catch (err) {
        res.send(err.message)
    }
}


const createProducts = async (req, res) => {
    try {
        const data = req.body
        const validate = ajv.compile(SchemaP)
        const valid = validate(data)
        if (!valid) throw new Error(validate.errors[0].message)
        else {
        const result = await Products.insertMany([data])
        res.send(result)
        }
    }
    catch (err) {
        res.send(err.message)
    }
}


const updateProducts = async (req, res) => {
    try {
        const data = req.body
        const result = await Products.findByIdAndUpdate({ _id: req.params._id }, data, { new: true, runValidators: true })
        res.send(result)
    }
    catch (err) {
        res.send(err.message)
    }
}


const deleteProducts = async (req, res) => {
    try {
        const data = req.params._id
        const result = await Products.deleteOne({ _id: data })
        res.send("Deleted Succesfully")
    }
    catch (err) {
        res.send(err.message)
    }
}


module.exports = { getCustomers, createCustomers, deleteCustomers, getCustomersO, updateCustomers, getProducts, createProducts, deleteProducts, getProductsO, updateProducts }