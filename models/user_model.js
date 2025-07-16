const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true,unique:true},
    password:{type:String,require:true},
    gender:{type:String},
    phone:{type:Number}, 
    dob:{type:Date},
    image:{type:Buffer},
    addresses:{type:[mongoose.Schema.Types.Mixed]},
    salt:Buffer,
    resetPasswordToekn:{type:String,default:""},
    role:{type:String ,required : true,default:'user'},

},{timestamps:true})

userSchema.virtual('id').get(function () {
    return this._id;
})

userSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform(doc,ret){
        delete ret._id
    }
})

const User=mongoose.model('User',userSchema)

exports.User=User