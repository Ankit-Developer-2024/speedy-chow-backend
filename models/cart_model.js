const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    quantity:{type:Number,min:[0,"Enter wrong min quantity"],require:true},
    product:{type:mongoose.Schema.ObjectId,ref:'Product',require:true},
    user:{type:mongoose.Schema.ObjectId,ref:'User',require:true},
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