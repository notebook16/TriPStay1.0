const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


//to attach backend with cloudinary account we are config it with .env credintials
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECERET,
});


 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'TriPStay_DEV',
      allowed_formats: ["png" , "jpg","jpeg"], // supports promises as well
      
    },
  });


  module.exports = {
    cloudinary,
    storage
  }