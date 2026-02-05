import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (fileBuffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "property-rental",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result?.secure_url || "");
      },
    );

    uploadStream.end(fileBuffer);
  });
};

export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[],
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer));
  return Promise.all(uploadPromises);
};
