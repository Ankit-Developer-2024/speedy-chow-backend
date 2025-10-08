const mongoose =  require('mongoose')
const {addressSchema} = require('../models/user_model') 

const paymentMethods={
    type:String,
    values:['COD','Razorpay'],
    message:"Payment method must be cod OR card"
}

const orderSchema = new mongoose.Schema({
    items:{type:[mongoose.Schema.Types.Mixed]},//require
    totalAmount:{type:Number,require:true},
    totalItems:{type:Number},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',require:true},
    paymentMethod:{type:String,required :true,enum:paymentMethods,require:true},
    paymentStatus:{type:String, default:"pending"},
    status:{type:String,default:'pending'},//Order Confirmed
    statusReason:{type:String},
    selectedAddress:{type:addressSchema},//require:true
},{timestamps:true})


orderSchema.virtual('id').get(function () {
    return this._id;
})

orderSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform(doc,ret){
        delete ret._id
    }
})

const Order=mongoose.model("Order",orderSchema)

exports.Order=Order