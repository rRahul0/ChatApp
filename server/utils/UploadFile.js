import { v2 as cloudinary } from 'cloudinary';


export const uploadFileToCloudinary = async (file, folder) => {
  const options = { folder, resource_type : "raw", use_filename: true };
  return await cloudinary.uploader.upload(file, options);
};