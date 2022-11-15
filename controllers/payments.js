const { Payments } = require('./exp')

const readPayments = async (req,res) => {
    try{
        const showDetails = await Payments.find()
        res.status(200).json(showDetails)
    }
    catch(err){
        res.status(500).json(err.message)
    }
}

module.exports = {readPayments}