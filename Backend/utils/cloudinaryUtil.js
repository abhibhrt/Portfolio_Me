import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handleImage = async (action, { imagePath, publicId }) => {
  try {
    if (action === 'add') {
      if (!imagePath) throw new Error('imagePath is required for upload');

      const result = await cloudinary.uploader.upload(imagePath, {
        folder: 'portfolio-projects',
      });

      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    if (action === 'delete') {
      if (!publicId) throw new Error('publicId is required for delete');

      await cloudinary.uploader.destroy(publicId);
      return { message: 'deleted successfully' };
    }

    throw new Error('invalid action type, use "add" or "delete"');
  } catch (err) {
    console.error('cloudinary error:', err.message.toLowerCase());
    throw err;
  }
};

export default handleImage;