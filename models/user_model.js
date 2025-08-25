const mongoose=require('mongoose')
const bcrypt = require('bcryptjs'); 

const addressSchema = new mongoose.Schema({
  houseNo: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  landMark:{ type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false } // Indicates if this is the default address
});


addressSchema.virtual('id').get(function () {
    return this._id;
})

addressSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform(doc,ret){
        delete ret._id
    }
})


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

userSchema.pre('save', async function(next) {  
    if(!this.isModified('password'))  return next();
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)
    this.password=hash 
});

userSchema.pre('findOneAndUpdate',async function () { 
    let addr=this.getUpdate() ||{}   
    if(addr.$set.addresses[addr.$set.addresses.length-1].isDefault===true){ 
        addr.$set.addresses.forEach((address, index) => {
                if (addr.$set.addresses[addr.$set.addresses.length-1] !== address) {
                    address.isDefault = false;
                }
            });   
        return ;      
    }
    
    let defaultAddressCount = 0;
    let defaultAddressIndex = -1;

     addr.$set.addresses.forEach((item,index)=>{
         if(item.isDefault){
           defaultAddressCount++;
           defaultAddressIndex=index; 
         }
    })

    if(defaultAddressCount===1) return;

    if(defaultAddressCount>1){
         addr.$set.addresses.forEach((address, index) => {
                if (index !== defaultAddressIndex) {
                    address.isDefault = false;
                }
            });
    }else if(defaultAddressCount==0 && addr.$set.addresses.length>0){ 
        addr.$set.addresses[0].isDefault=true;
    }
    
})


 
 

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