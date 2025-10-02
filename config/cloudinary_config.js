const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name:"dsts7bf9w",
  secure: true
});

// Log the configuration
// console.log(cloudinary.config());

const uploadBufferToCloudinary= async function uploadBufferToCloudinary(imageBuffer,folderName) {
      return new Promise((resolve, reject) => {
     const uploadStream = cloudinary.uploader.upload_stream({ 
         folder: folderName,
         resource_type: 'auto',
       }, // 'auto' lets Cloudinary determine the resource type
      (error, result) => {
        if (error) { 
          return reject(error);
        } 
        resolve(result); // The URL of the uploaded image
      }
    );
    uploadStream.end(imageBuffer); // End the stream with the image buffer
  });
} 

const deleteImageFromCloudinary = async function deleteImageFromCloudinary(imagePublicId,options) {
    return new Promise((resolve,reject)=>{
          cloudinary.uploader.destroy(imagePublicId).then((val)=>{
          if(val){ 
            resolve(val)
          }else{
          reject("Image not deleted!")
          }
        }).catch((e)=>{
             reject(e)
         })
    })
}

module.exports={cloudinary,uploadBufferToCloudinary,deleteImageFromCloudinary}