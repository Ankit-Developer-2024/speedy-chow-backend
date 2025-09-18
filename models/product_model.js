const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{type:String,require:true},
    description:{type:String,require:true},
    image:{type:Buffer,require:true},
    imageType:{type:String,require:true},
    price:{type:Number,min:[1,"Enter wrong price"],require:true},
    discountPercentage:{type:Number,min:[0,"Enter wrong discount percentage 0-100"],max:[100,"Enter wrong discount percentage 0-100"],default:0},
    discountedPrice:{type:Number,min:[0,"Enter wrong discounted price"],require:true},
    totalQuantity:{type:Number,min:[0,"Enter wrong min totalQuantity"],require:true},
    rating:{type:Number,min:[0.0,"Enter wrong min rating"],max:[5.0 ,"Enter wrong max rating"],default:0.0},
    category:{type:String,require:true},
    deleted:{type:Boolean ,default : false},
});

productSchema.virtual('id').get(function () {
    return this._id;
})

productSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform(doc,ret){
        delete ret._id
    }
})

const Product = mongoose.model('Product',productSchema)

exports.Product = Product