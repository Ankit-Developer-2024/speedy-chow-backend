const mongoose=require('mongoose')

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false } // Indicates if this is the default address
});

addressSchema.virtual('id').get(function () {
    return this._id;
})

addressSchema.set('toJson',{
    virtuals:true,
    versionKey:false,
    transform(doc,ret){
        delete ret._id
    }
})

const Address= mongoose.model('address',addressSchema);

exports.Address=Address;