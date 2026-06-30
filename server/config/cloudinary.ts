import { v2 as cloudinary } from 'cloudinary';

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('AMC Backend: Cloudinary successfully configured.');
} else {
  console.log('AMC Backend: Cloudinary credentials missing. File Uploads will save locally as fallback.');
}

export { cloudinary, isCloudinaryConfigured };
