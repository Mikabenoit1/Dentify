const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { Document } = require("../models");
const protect = require("../middlewares/authMiddleware");

// Config multer : stockage dans /uploads/documents/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/documents");
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
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier reçu." });
    }

    const doc = await Document.create({
      id_utilisateur: req.user.id_utilisateur,
      type_document: type,
      nom_fichier: req.file.originalname,
      chemin_fichier: req.file.path,
      date_telechargement: new Date(),
      est_verifie: 'N'
    });

    res.status(201).json({
      message: "Document enregistré avec succès",
      document: {
        id: doc.id_document,
        filename: doc.nom_fichier,
        path: doc.chemin_fichier,
        type: doc.type_document
      }
    });

  } catch (error) {
    console.error("Erreur upload document:", error);
    res.status(500).json({ message: "Erreur serveur lors de l’upload du document." });
  }
});

router.get("/download/:type", protect, async (req, res) => {
    try {
      const { type } = req.params;
  
      // Récupère le document correspondant à l'utilisateur connecté
      const doc = await Document.findOne({
        where: {
          id_utilisateur: req.user.id_utilisateur,
          type_document: type
        }
      });
  
      if (!doc) {
        return res.status(404).json({ message: "Document non trouvé." });
      }
  
      const filePath = path.resolve(doc.chemin_fichier);
  
      // Vérifie si le fichier existe
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Fichier introuvable sur le serveur." });
      }
  
      // Force le téléchargement
      res.download(filePath, doc.nom_fichier);
    } catch (err) {
      console.error("Erreur lors du téléchargement :", err);
      res.status(500).json({ message: "Erreur serveur pendant le téléchargement." });
    }
  });
  
module.exports = router;
