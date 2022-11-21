const mongoose = require('mongoose')
const express = require('express');
const app = express();
const customersRouter = require('./routes/Customers')
const productsRouter = require('./routes/Products')
const ordersRouter = require('./routes/Orders')
const paymentsRouter = require('./routes/Payments')
const weatherRouter = require('./routes/Weather')

app.use(express.json()) //middleware
app.use('/api/v1/customers',customersRouter)
app.use('/api/v1/products/',productsRouter)  
app.use('/api/v1/orders/',ordersRouter)  
app.use('/api/v1/payments/',paymentsRouter)  
app.use('/api/v1/weather/',weatherRouter) 

const startDB = async()=>{
    try{
        await mongoose.connect("mongodb+srv://VedantKashettiwar:Wohlig%40123@cluster0.0l1d7r7.mongodb.net/ClothSite?authSource=admin&replicaSet=atlas-uy925y-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true")
        console.log('Connected to database')
    }
    catch(err){console.log(err)}
}
startDB()
 
app.listen(8000, ()=>{
    console.log('listening the port at 8000')
});

