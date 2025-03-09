import cloudinary from "../config/cloudinary.config.js";

export const uploadToCloudinary = async (file, resourceType) => {
    try {
        const uploadedResult = await cloudinary.uploader.upload(file, {
            resource_type: resourceType,
        });

        return {
            success: true,
            secure_url: uploadedResult.secure_url,
            public_id: uploadedResult.public_id,
        };
    } catch (error) {
        console.log(`Error uploading ${resourceType} : ${error.message}`);
    }
};
