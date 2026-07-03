import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'db92apfxo',
  api_key: process.env.CLOUDINARY_API_KEY || '636132333142946',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'iu_uGQoVZCwfKe6HknYv0CjX_A8'
});

export default cloudinary;
