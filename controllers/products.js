const Ajv = require("ajv")
const ajv = new Ajv()
const { Products } = require('./exp')

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



//products function
const getProducts = async (req, res) => {
    try {
        const result = await Products.find()
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


const getProductOne = async (req, res) => {
    try {
        const data = req.params._id
        const result = await Products.findOne({ _id: data })
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


const getProductOneWithPopulate = async(req,res)=>{
    try{
        const data = req.params._id
        const result = await Products.findOne({_id:data}).populate('catid')
        res.status(200).json(result)
    }
    catch(err){
        res.status(500).json(err.message)
    }
}


const getProductsByPagination = async(req,res)=>{
    try{
        const{page,limit} = req.query
        const result = await Products.aggregate([
            {$skip:(page-1)*limit},
            {$limit:limit*1},
            {$sort:{name:1}}
        ])
        res.status(200).json(result)
    }
    catch(err){
        res.status(500).json(err.message)
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
        res.status(200).json(result)
        }
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


const updateProduct = async (req, res) => {
    try {
        const data = req.body
        const result = await Products.findByIdAndUpdate({ _id: req.params._id }, data, { new: true, runValidators: true })
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


const deleteProduct = async (req, res) => {
    try {
        const data = req.params._id
        const result = await Products.findByIdAndDelete({ _id: data })
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


module.exports = { getProducts, createProducts, deleteProduct, getProductOne, getProductOneWithPopulate, getProductsByPagination, updateProduct}