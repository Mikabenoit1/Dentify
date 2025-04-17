// src/middlewares/uploadMiddleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Assurer que le dossier uploads existe
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'uploads';
    
    // Déterminer le sous-dossier selon le type de fichier
    if (file.fieldname === 'photo') {
      folder = 'uploads/photos';
    } else if (file.fieldname === 'document') {
      folder = 'uploads/documents';
    }
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + ext);
  }
});

// Filtrer les types de fichiers
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'photo') {
    // Accepter seulement les images pour les photos
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont acceptés pour les photos'), false);
    }
  } else if (file.fieldname === 'document') {
    // Accepter les PDF, DOC, DOCX, images pour les documents
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté. Utilisez PDF, DOC, DOCX ou images.'), false);
    }
  } else {
    cb(new Error('Type de formulaire non reconnu'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite à 5MB
  }
});

module.exports = upload;