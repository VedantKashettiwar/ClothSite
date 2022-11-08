const express = require('express');
const app = express();
const customersRouter = require('./routes/Customers')

app.use(express.json()) //middleware
app.use('/api/v1/customers',customersRouter)
// app.use('/api/v1/products/',productsRouter)



app.listen(8000, ()=>{
    console.log('listening the port at 8000')
});

