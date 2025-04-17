const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crée le dossier s'il n'existe pas
const photoDir = path.join(__dirname, '../../uploads/photos');
if (!fs.existsSync(photoDir)) {
  fs.mkdirSync(photoDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, photoDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const uploadPhoto = multer({ storage });

module.exports = uploadPhoto;
