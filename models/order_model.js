const mongoose =  require('mongoose')
const {addressSchema} = require('../models/user_model') 

const paymentMethods={
    type:String,
    values:['COD','UPI'],
    message:"Payment method must be cod OR card"
}

const orderSchema = new mongoose.Schema({
    items:{type:[mongoose.Schema.Types.Mixed],require:true},
    totalAmount:{type:Number,require:true},
    totalItems:{type:Number,require:true},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',require:true},
    paymentMethod:{type:String,required :true,enum:paymentMethods},
    status:{type:String,default:'Order Confirmed'},
    statusReason:{type:String},
    selectedAddress:{type:addressSchema,require:true},
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