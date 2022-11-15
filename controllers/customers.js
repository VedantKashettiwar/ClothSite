const Ajv = require("ajv")
const ajv = new Ajv()
const { Customer_Infos } = require('./exp')

//schemas of customer, product
const SchemaCustomer = {
    type: 'object',
    properties: {
        catid: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        phone: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        dob: {
            type: 'string'
        },
        pass: {
            type: 'string'
        },
        address: {
            type: 'string'
        }
    },
    required: ["name", "phone", "email", "dob", "pass", "address"]

}
const SchemaCustomerMany = {
    type: 'array',
    properties: {
        catid: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        phone: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        dob: {
            type: 'string'
        },
        pass: {
            type: 'string'
        },
        address: {
            type: 'string'
        }
    },
    required: ["name", "phone", "email", "dob", "pass", "address"]

}

let a = {
    options: {
        page: 1,
        limit: 1,
        keyword: ""
    },
    results: [{}, {}],
    totalcount: 10
}
//customers function
const getCustomers = async (req, res) => {
    try {
        const result = await Customer_Infos.find()
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


const getCustomerOne = async (req, res) => {
    try {
        const data = req.query._id
        const result = await Customer_Infos.findOne({ _id: data })
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


const getCustomersWithProject = async (req, res) => {
    try {
        const result = await Customer_Infos.aggregate([
            {
                $project: {
                    _id: 0,
                    name: 1,
                    phone: 1,
                    email: 1
                }
            }
        ])
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


const getCustomersByPagination = async (req, res) => {
    try {
        let page = req.query.page
        let limit = req.query.limit
        const result = await Customer_Infos.find().skip((page - 1) * limit).limit(limit * 1).sort({ name: 1 })
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


const createCustomers = async (req, res) => {
    try {
        const data = req.body
        const validate = ajv.compile(SchemaCustomer)
        const valid = validate(data)
        const add = new Customer_Infos(data)
        if (!valid) throw new Error(validate.errors[0].message)
        else {
            const result = await add.save()
            res.status(200).json(result)
        }
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


const createCustomersMany = async (req, res) => {
    try {
        let data = req.body
        let length = data.length
        if (length === 0) {
            throw new Error('Add Customers')
        }
        else {
            const validate = ajv.compile(SchemaCustomerMany)
            const valid = validate(data)
            if (!valid) throw new Error(validate.errors[0].message)
            else {
                const result = await Customer_Infos.insertMany(data)
                res.status(200).json(result)
            }
        }
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


const createCustomersManyByloop = async (req, res) => {
    try {
        let data = req.body
        let length = data.length
        if (length === 0) {
            throw new Error('Add Customers')
        }
        else {
            const validate = ajv.compile(SchemaCustomerMany)
            const valid = validate(data)
            if (!valid) throw new Error(validate.errors[0].message)
            else {
                for (i of data) {
                    const add = new Customer_Infos(i)
                    await add.save()
                }
                res.status(200).json(data)
            }
        }
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


const updateCustomer = async (req, res) => {
    try {
        const data = req.body
        const result = await Customer_Infos.findByIdAndUpdate({ _id: req.params._id }, data, { new: true, runValidators: true })
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


const deleteCustomer = async (req, res) => {
    try {
        const data = req.params._id
        const result = await Customer_Infos.findByIdAndDelete({ _id: data })
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


const getCustomersByKeyword = async (req, res) => {
    try {
        let data = req.query
        data = data.name.trim()
        if (data == '') {
            throw new Error('Enter Name')
        }
        else {
            const result = await Customer_Infos.find({ name: { $regex: data, $options: "$i" } })
            res.status(200).json(result)
        }
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}


const getCustomersUsingPaginationByKeyword = async (req, res) => {
    try {
        let data = req.query
        Name = data.name.trim()
        let page = data.page
        let limit = data.limit
        if (Name == '') {
            const result = await Customer_Infos.find().skip((page - 1) * limit).limit(limit * 1)
            const output = {
                options:{
                    page:page,
                    limit:limit,
                    keyword:Name,
                },
                results:result,
                totalcount:result.length
            }
            res.status(200).json(output)
        }
        else {
            const result = await Customer_Infos.aggregate([
                {$facet:{
                    count:[
                        { $match: { name: { $regex: Name, $options: "$i" } } },
                        { $count:"name"}
                    ],
                    paginationResult:[
                        { $match: { name: { $regex: Name, $options: "$i" } } },
                        { $skip: (page - 1) * limit },
                        { $limit: limit * 1 },
                        { $sort: { name: 1 } }
                    ]
                }}
            ])
            const output = {
                options:{
                    page:page,
                    limit:limit,
                    keyword:Name,
                },
                results:result[0].paginationResult,
                totalcount:result[0].count[0].name
            }
            res.status(200).json(output)
        }
    }
    catch (err) {
        res.status(500).json(err.message)
    }
}




module.exports = { getCustomers, createCustomers, createCustomersMany, createCustomersManyByloop, deleteCustomer, getCustomerOne, getCustomersByPagination, getCustomersWithProject, updateCustomer, getCustomersByKeyword, getCustomersUsingPaginationByKeyword }