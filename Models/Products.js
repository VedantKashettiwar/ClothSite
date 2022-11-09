const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    cat_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorys' 
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    stock:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    colors:{
        type:Array,
        require:true
    },
    sizes:{
        type:Array,
        require:true
    },
    material:{
        type:String,
        required:true
    },
    product_detail:{
        type:String,
        required:true
    }
},
{ timestamps: true })

module.exports = mongoose.model('Products', ProductSchema)


// Products
// catid : Objectid
// name : String
// stock : Number
// price : Number
// colors : Array
// sizes : Array
// material : String
// product-detail : String
// const a ={
//     "catid":"636a22c4e0127a08d9712b02",
//     "name":"Oversize",
//     "stock":"500",
//     "price":"780",
//     "colours":["Black","Red","Blue","Green"],
//     "sizes":["S","M","L"],
//     "material":"Cotton",
//     "product_detail":"Don't wash in washing machine"
// }
