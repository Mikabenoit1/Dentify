// src/routes/documentRoutes.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { Document } = require("../models");
const protect = require("../middlewares/authMiddleware");
const upload = require('../middlewares/uploadMiddleware');

// ✅ POST /api/documents/upload
router.post("/upload", protect, upload.single("document"), async (req, res) => {
  try {
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier reçu." });
    }

    if (!type) {
      return res.status(400).json({ message: "Type de document non spécifié." });
    }

    // Vérifier si un document de ce type existe déjà
    let existingDoc = await Document.findOne({
      where: {
        id_utilisateur: req.user.id_utilisateur,
        type_document: type
      }
    });

    // Si oui, le mettre à jour
    if (existingDoc) {
      // Supprimer l'ancien fichier si possible
      if (existingDoc.chemin_fichier && fs.existsSync(existingDoc.chemin_fichier)) {
        fs.unlinkSync(existingDoc.chemin_fichier);
      }
      
      existingDoc.nom_fichier = req.file.originalname;
      existingDoc.chemin_fichier = req.file.path;
      existingDoc.date_telechargement = new Date();
      await existingDoc.save();
      
      return res.status(200).json({
        message: "Document mis à jour avec succès",
        document: {
          id: existingDoc.id_document,
          filename: existingDoc.nom_fichier,
          path: existingDoc.chemin_fichier,
          type: existingDoc.type_document
        }
      });
    }

    // Sinon, créer un nouveau document
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
    res.status(500).json({ message: "Erreur serveur lors de l'upload du document." });
  }
});

// ✅ GET /api/documents/download/:type
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
    res.download(filePath, doc.nom_fichier, (err) => {
      if (err) {
        console.error("Erreur lors du téléchargement :", err);
        res.status(500).json({ message: "Erreur serveur pendant le téléchargement." });
      }
    });
  } catch (err) {
    console.error("Erreur lors du téléchargement :", err);
    res.status(500).json({ message: "Erreur serveur pendant le téléchargement." });
  }
});

module.exports = router;