import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => {
    return {
      folder: "frango_uploads",
      allowed_formats: ["jpg", "png", "jpeg","avif"],
    };
  },
});
const upload = multer({ storage });
export default upload;