import axios from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  throw new Error(
    'Cloudinary cloud name or upload preset is not configured in environment variables.'
  );
}

const cloudinaryApi = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  version: number;
}

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await axios.post<CloudinaryUploadResponse>(
      cloudinaryApi,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Image upload failed.');
  }
};
