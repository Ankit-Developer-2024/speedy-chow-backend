const mongoose =  require('mongoose')

const paymentMethods={
    values:['cod','card'],
    message:"Payment method must be cod OR card"
}

const orderSchema = new mongoose.Schema({
    items:{type:[mongoose.Schema.Types.Mixed],require:true},
    totalAmount:{type:Number},
    totalItems:{type:Number},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',require:true},
    paymentMethod:{type:String,required :true,enum:paymentMethods},
    status:{type:String,default:'pending'},
    selectedAddress:{type:mongoose.Schema.Types.Mixed,require:true},
},{timestamps:true})

const virtual=orderSchema.virtual("id");
virtual.get(function () {
    return this._id;
})

orderSchema.set('toJSON',{
    virtuals: true,
    versionKey:false,
    transform:function(doc,ret){delete ret._id}      //these virtuals help to convert _id field to id 
})

exports.Order=mongoose.model("Order",orderSchema)