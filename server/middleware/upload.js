const multer = require("multer");
const fs = require("fs");
const path = require("path");

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let folderName = "others";
      if (file.fieldname === "profileImg") {
        folderName = "profile-images";
      }
      const uploadPath = `uploads/${folderName}`;
      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueName =
        file.fieldname + "_" + Date.now() + path.extname(file.originalname);

      cb(null, uniqueName);
    },
  });

  const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];

  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.mimetype.startsWith("image") && allowedExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files can be uploaded"), false);
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
  });


module.exports = upload;