const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { Document } = require("../models");
const protect = require("../middlewares/authMiddleware");

const uploadDir = path.join(__dirname, '..', 'uploads', 'documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Config multer : stockage dans /uploads/documents/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const uniqueName = `${Date.now()}-${base}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ POST /api/documents/upload
router.post("/upload", protect, upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier téléchargé" });
    }

    console.log("Fichier reçu:", req.file.originalname);
    console.log("Chemin du fichier:", req.file.path);
    console.log("Nom du fichier:", req.file.filename);

    // Stocker le chemin relatif au projet
    const relativePath = req.file.path.replace(/\\/g, '/');
    
    // Vérifier si un document du même type existe déjà
    const existingDoc = await Document.findOne({
      where: {
        id_utilisateur: req.user.id_utilisateur,
        type_document: req.body.type
      }
    });

    let doc;
    if (existingDoc) {
      // Mettre à jour le document existant
      console.log("Mise à jour du document existant ID:", existingDoc.id_document);
      
      // Supprimer l'ancien fichier si possible
      try {
        if (existingDoc.chemin_fichier) {
          // Essayer plusieurs chemins possibles
          const possiblePaths = [
            path.join(__dirname, '../../uploads/documents', path.basename(existingDoc.chemin_fichier)),
            path.join(__dirname, '../../src/uploads/documents', path.basename(existingDoc.chemin_fichier)),
            path.join(__dirname, '../..', existingDoc.chemin_fichier),
            existingDoc.chemin_fichier
          ];
          
          for (const oldPath of possiblePaths) {
            if (fs.existsSync(oldPath)) {
              console.log("Suppression de l'ancien fichier:", oldPath);
              fs.unlinkSync(oldPath);
              break;
            }
          }
        }
      } catch (deleteErr) {
        console.error("Erreur lors de la suppression de l'ancien fichier:", deleteErr);
        // On continue même si la suppression échoue
      }
      
      existingDoc.nom_fichier = req.file.originalname;
      existingDoc.chemin_fichier = relativePath;
      existingDoc.date_telechargement = new Date();
      existingDoc.est_verifie = 'N';
      await existingDoc.save();
      doc = existingDoc;
    } else {
      // Créer un nouvel enregistrement
      doc = await Document.create({
        id_utilisateur: req.user.id_utilisateur,
        type_document: req.body.type,
        nom_fichier: req.file.originalname,
        chemin_fichier: relativePath,
        date_telechargement: new Date(),
        est_verifie: 'N'
      });
    }

    res.status(201).json({
      message: "Document enregistré avec succès",
      document: {
        id: doc.id_document,
        filename: doc.nom_fichier,
        type: doc.type_document
      }
    });

  } catch (error) {
    console.error("Erreur upload document:", error);
    res.status(500).json({ message: "Erreur serveur lors de l'upload" });
  }
});

// ✅ GET /api/documents/download/:type
router.get("/download/:type", protect, async (req, res) => {
  try {
    console.log("Demande de téléchargement pour type:", req.params.type);
    
    const doc = await Document.findOne({
      where: {
        id_utilisateur: req.user.id_utilisateur,
        type_document: req.params.type
      }
    });

    if (!doc) {
      return res.status(404).json({ message: "Document non trouvé." });
    }
    
    console.log("Document trouvé:", doc.id_document);
    console.log("Chemin stocké:", doc.chemin_fichier);
    
    // Essayer différentes possibilités de chemins
    const possiblePaths = [
      // Chemin exact tel qu'enregistré
      doc.chemin_fichier,
      // Chemin absolu relatif au dossier src/uploads/documents
      path.join(__dirname, '../../src/uploads/documents', path.basename(doc.chemin_fichier)),
      // Chemin absolu relatif au dossier uploads/documents
      path.join(__dirname, '../../uploads/documents', path.basename(doc.chemin_fichier)),
      // Chemin absolu depuis la racine du projet
      path.resolve(process.cwd(), doc.chemin_fichier)
    ];
    
    // Lister les fichiers dans les dossiers uploads/documents et src/uploads/documents pour débogage
    try {
      console.log("Contenu de uploads/documents:");
      const files1 = fs.readdirSync(path.join(__dirname, '../../uploads/documents'));
      console.log(files1);
      
      console.log("Contenu de src/uploads/documents:");
      const files2 = fs.readdirSync(path.join(__dirname, '../../src/uploads/documents'));
      console.log(files2);
    } catch (readErr) {
      console.error("Erreur lors de la lecture des dossiers:", readErr);
    }
    
    let fileFound = false;
    let filePath = null;
    
    for (const testPath of possiblePaths) {
      console.log(`Essai avec chemin: ${testPath}`);
      
      if (fs.existsSync(testPath)) {
        console.log("✅ Fichier trouvé !");
        fileFound = true;
        filePath = testPath;
        break;
      } else {
        console.log("❌ Pas trouvé");
      }
    }
    
    if (!fileFound) {
      return res.status(404).json({ message: "Fichier introuvable sur le serveur." });
    }
    
    // Télécharger le fichier trouvé
    res.download(filePath, doc.nom_fichier);
    
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    res.status(500).json({ message: "Erreur serveur lors du téléchargement." });
  }
});
  
module.exports = router;