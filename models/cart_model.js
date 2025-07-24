const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    quantity:{type:Number,min:[1,"Enter wrong min quantity"],require:true},
    product:{type:mongoose.Schema.Types.ObjectId,ref:'Product',require:true},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',require:true},
})

cartSchema.virtual('id').get(function () {
    return this._id;
})

cartSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform(doc,ret){
        delete ret._id
    }
})

const Cart=mongoose.model('cart',cartSchema)

exports.Cart=Cart