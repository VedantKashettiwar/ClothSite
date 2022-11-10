const Ajv = require("ajv")
const ajv = new Ajv()
const {Customer_Infos} = require('./exp')

//schemas of customer, product
const SchemaC = {
    type: 'object',
    properties: {
    catid:{
        type:'string'
    },
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
const SchemaCm = {
    type: 'array',
    properties: {
    catid:{
        type:'string'
    },
    name:{
        type:'string'
    },
    phone:{
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


const getCustomerOne = async (req, res) => {
    try {
        const data = req.query._id
        const result = await Customer_Infos.findOne({ _id: data })
        res.send(result)
    }
    catch (err) {
        res.send(err.message)
    }
}


const getCustomersWithProject = async(req,res)=>{
    try{
        const result = await Customer_Infos.aggregate([
            {$project:{
                _id:0,
                name:1,
                phone:1,
                email:1
            }}
        ])
        res.send(result)
    }
    catch(err){
        res.send(err.message)
    }
}


const getCustomersByPagination = async (req, res) => {
    try {
        const result = await Customer_Infos.find().skip(1).limit(3).sort({name:1})
        res.send(result)
    }
    catch (err) {
        res.send(err.message)
    }
}


const createCustomers = async (req, res) => {
    try {
        let data = req.body
        const validate = ajv.compile(SchemaC)
        const valid = validate(data)
        if (!valid) throw new Error(validate.errors[0].message)
        else {
            const result = await Customer_Infos.insertMany([data])
            res.send(result)
        }
    }
    catch (err) {
        res.send(err.message)
    }
}


const createCustomersmany = async (req, res) => {
    try {
        let data = req.body
        const validate = ajv.compile(SchemaCm)
        const valid = validate(data)
        if (!valid) throw new Error(validate.errors[0].message)
        else {
            const result = await Customer_Infos.insertMany(data)
            res.send(result)
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
        const result = await Customer_Infos.deleteOne({ _id: data })
        res.send("Deleted Succesfully")
    }
    catch (err) {
        res.send(err.message)
    }
}


module.exports = { getCustomers, createCustomers, createCustomersmany, deleteCustomers, getCustomerOne, getCustomersByPagination, getCustomersWithProject, updateCustomers}