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
// pid : Objectid
// sid : Objectid
// catid : Objectid
// p_name : String
// stock : Number
// price : Number
// colors : Array
// sizes : Array
// material : String
// product-detail : String
// st_id : Objectid
