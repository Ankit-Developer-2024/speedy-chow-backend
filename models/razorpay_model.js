const mongoose=require('mongoose')
const bcrypt = require('bcryptjs'); 
 

const razorpaySchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,require:true},
    order_id_db:{type:mongoose.Schema.Types.ObjectId,require:true},
    razorpay_payment_id:{type:String}, 
    razorpay_order_id:{type:String},
    razorpay_signature:{type:String},   
    status:{type:String, default:"pending"},
},{timestamps:true})

  

razorpaySchema.virtual('id').get(function () {
    return this._id;
})

razorpaySchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform(doc,ret){
        delete ret._id
    }
})

const Razorpay=mongoose.model('Razorpay',razorpaySchema)

exports.Razorpay=Razorpay 