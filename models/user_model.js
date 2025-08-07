const mongoose=require('mongoose')
const bcrypt = require('bcryptjs'); 

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false } // Indicates if this is the default address
});

const userSchema=new mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true,unique:true},
    password:{type:String,require:true},
    gender:{type:String},
    phone:{type:Number}, 
    dob:{type:Date},
    image:{type:Buffer},
    addresses:[addressSchema],
    salt:Buffer,
    resetPasswordOtp:{type:String,default:""},
    role:{type:String ,required : true,default:'user'},

},{timestamps:true})

userSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash( this.password, salt)
    this.password=hash
});

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