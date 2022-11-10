const mongoose = require('mongoose')
const express = require('express');
const app = express();
const customersRouter = require('./routes/Customers')
const productsRouter = require('./routes/Products')

app.use(express.json()) //middleware
app.use('/api/v1/customers',customersRouter)
app.use('/api/v1/products/',productsRouter)  


 
app.listen(8000, ()=>{
    console.log('listening the port at 8000')
});

const startDB = async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/ClothSite")
        console.log('Connected to database')
    }
    catch(err){console.log(err)}
}
 startDB()