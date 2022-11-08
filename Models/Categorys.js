const { ObjectId } = require('bson');
const mongoose = require('mongoose');



const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:4,
        maxlength:25
    }

},
{ timestamps: true })

module.exports =mongoose.model('Categorys',CategorySchema)


// Categorys
// catid : Objectid
// cat_name : String