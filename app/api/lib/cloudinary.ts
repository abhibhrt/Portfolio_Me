import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/**
 * Upload image or video to Cloudinary (Next.js App Router compatible)
 */
export const uploadToCloud = async (file: File): Promise<any> => {
  if (!file || typeof file.arrayBuffer !== 'function') {
    throw new Error('Invalid file object received');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'projects_portfolio',
        // 'auto' lagane se image aur video dono upload ho jayenge
        resource_type: 'auto', 
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

/**
 * Delete asset from Cloudinary
 */
export const deleteFromCloud = async (publicId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Note: Video delete karne ke liye kabhi-kabhi resource_type specify karna padta hai,
    // par generic destroy query zyadatar kaam kar jati hai.
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};