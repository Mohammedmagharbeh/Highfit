const { cloudinary } = require('../config/cloudinary');
const stream = require('stream');

exports.uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const isVideo = req.file.mimetype.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "highfit_coach_uploads",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return res.status(500).json({ message: "Upload failed", error: error.message });
        }
        res.status(200).json({ 
          message: "Upload successful", 
          url: result.secure_url, 
          resourceType: result.resource_type 
        });
      }
    );

    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);
    bufferStream.pipe(uploadStream);

  } catch (error) {
    console.error("Upload controller error:", error);
    res.status(500).json({ message: "Server error during upload", error: error.message });
  }
};
