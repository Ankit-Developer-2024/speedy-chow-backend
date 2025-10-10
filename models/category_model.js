const mongoose = require("mongoose")
const {Schema} = mongoose;

const categorySchema = new Schema({
   name:{type:String ,required : true,unique:true },
   image:{type:String ,required : true},
   imagePublicId:{type:String,required : true}
})

categorySchema.virtual('id').get(function () {
    return this._id;
})

categorySchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform(doc,ret){
        delete ret._id
    }
})

exports.Category = mongoose.model('category',categorySchema)