-- MySQL dump 10.13  Distrib 9.2.0, for macos14.7 (x86_64)
--
-- Host: localhost    Database: dentify
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Database creation
--

DROP DATABASE IF EXISTS `dentify`;
CREATE DATABASE `dentify`;
USE `dentify`;

--
-- Table structure for table `Utilisateur`
--


DROP TABLE IF EXISTS `Utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Utilisateur` (
  `id_utilisateur` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(25) NOT NULL,
  `prenom` varchar(25) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `adresse` varchar(50) DEFAULT NULL,
  `ville` varchar(50) DEFAULT NULL,
  `province` varchar(25) DEFAULT NULL,
  `code_postal` varchar(10) DEFAULT NULL,
  `courriel` varchar(50) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `type_utilisateur` varchar(25) DEFAULT NULL,
  `photo_profil` varchar(100) DEFAULT NULL,
  `derniere_connexion` timestamp NULL DEFAULT NULL,
  `compte_verifie` char(1) DEFAULT 'N',
  `date_inscription` date DEFAULT NULL,
  `accepte_notifications` char(1) DEFAULT 'Y',
  `est_actif` char(1) DEFAULT 'Y',
  PRIMARY KEY (`id_utilisateur`),
  UNIQUE KEY `courriel` (`courriel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Utilisateur`
--

LOCK TABLES `Utilisateur` WRITE;
/*!40000 ALTER TABLE `Utilisateur` DISABLE KEYS */;
/*!40000 ALTER TABLE `Utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProfessionnelDentaire`
--

DROP TABLE IF EXISTS `ProfessionnelDentaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProfessionnelDentaire` (
  `id_professionnel` int NOT NULL AUTO_INCREMENT,
  `numero_permis` varchar(10) NOT NULL,
  `type_profession` varchar(20) NOT NULL,
  `annees_experience` int DEFAULT NULL,
  `tarif_horaire` decimal(6,2) DEFAULT NULL,
  `rayon_deplacement_km` int DEFAULT NULL,
  `disponibilite_immediate` char(1) DEFAULT 'N',
  `site_web` varchar(100) DEFAULT NULL,
  `id_utilisateur` int DEFAULT NULL,
  PRIMARY KEY (`id_professionnel`),
  KEY `id_utilisateur` (`id_utilisateur`),
  CONSTRAINT `professionneldentaire_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateur` (`id_utilisateur`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProfessionnelDentaire`
--

LOCK TABLES `ProfessionnelDentaire` WRITE;
/*!40000 ALTER TABLE `ProfessionnelDentaire` DISABLE KEYS */;
/*!40000 ALTER TABLE `ProfessionnelDentaire` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CliniqueDentaire`
--

DROP TABLE IF EXISTS `CliniqueDentaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CliniqueDentaire` (
  `id_clinique` int NOT NULL AUTO_INCREMENT,
  `nom_clinique` varchar(100) NOT NULL,
  `numero_entreprise` varchar(10) NOT NULL,
  `adresse_complete` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,6) DEFAULT NULL,
  `longitude` decimal(10,6) DEFAULT NULL,
  `horaire_ouverture` varchar(500) DEFAULT NULL,
  `site_web` varchar(100) DEFAULT NULL,
  `id_utilisateur` int NOT NULL,
  `logiciels_utilises` varchar(255) DEFAULT NULL,
  `type_dossier` varchar(20) DEFAULT NULL,
  `type_radiographie` varchar(30) DEFAULT NULL,
  `compte_verifie` char(1) DEFAULT 'N',
  PRIMARY KEY (`id_clinique`),
  KEY `id_utilisateur` (`id_utilisateur`),
  CONSTRAINT `cliniquedentaire_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateur` (`id_utilisateur`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CliniqueDentaire`
--


ALTER TABLE CliniqueDentaire
ADD CONSTRAINT fk_clinique_utilisateur
FOREIGN KEY (id_utilisateur)
REFERENCES Utilisateur(id_utilisateur)
ON DELETE CASCADE
ON UPDATE CASCADE;

LOCK TABLES `CliniqueDentaire` WRITE;
/*!40000 ALTER TABLE `CliniqueDentaire` DISABLE KEYS */;
/*!40000 ALTER TABLE `CliniqueDentaire` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Administrateur`
--

DROP TABLE IF EXISTS `Administrateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Administrateur` (
  `id_admin` int NOT NULL AUTO_INCREMENT,
  `id_utilisateur` int DEFAULT NULL,
  `niveau_acces` varchar(20) NOT NULL,
  `departement` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_admin`),
  KEY `id_utilisateur` (`id_utilisateur`),
  CONSTRAINT `administrateur_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateur` (`id_utilisateur`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Administrateur`
--

LOCK TABLES `Administrateur` WRITE;
/*!40000 ALTER TABLE `Administrateur` DISABLE KEYS */;
/*!40000 ALTER TABLE `Administrateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Equipement`
--

DROP TABLE IF EXISTS `Equipement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Equipement` (
  `id_equipement` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `descript` varchar(500) DEFAULT NULL,
  `categorie` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_equipement`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Equipement`
--

LOCK TABLES `Equipement` WRITE;
/*!40000 ALTER TABLE `Equipement` DISABLE KEYS */;
/*!40000 ALTER TABLE `Equipement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Specialite`
--

DROP TABLE IF EXISTS `Specialite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Specialite` (
  `id_specialite` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) DEFAULT NULL,
  `descript` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id_specialite`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Specialite`
--

LOCK TABLES `Specialite` WRITE;
/*!40000 ALTER TABLE `Specialite` DISABLE KEYS */;
/*!40000 ALTER TABLE `Specialite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Competence`
--

DROP TABLE IF EXISTS `Competence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Competence` (
  `id_competence` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `descript` varchar(500) DEFAULT NULL,
  `categorie` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_competence`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Competence`
--

LOCK TABLES `Competence` WRITE;
/*!40000 ALTER TABLE `Competence` DISABLE KEYS */;
/*!40000 ALTER TABLE `Competence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Offre`
--

DROP TABLE IF EXISTS `Offre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Offre` (
  `id_offre` int NOT NULL AUTO_INCREMENT,
  `id_clinique` int NOT NULL,
  `titre` varchar(100) NOT NULL,
  `descript` varchar(500) NOT NULL,
  `type_professionnel` varchar(20) NOT NULL,
  `date_publication` date NOT NULL,
  `date_mission` date NOT NULL,
  `heure_debut` time DEFAULT NULL,
  `heure_fin` time DEFAULT NULL,
  `duree_heures` decimal(5,2) DEFAULT NULL,
  `remuneration` decimal(10,2) NOT NULL,
  `est_urgent` char(1) DEFAULT 'N',
  `statut` varchar(20) DEFAULT 'active',
  `competences_requises` varchar(500) DEFAULT NULL,
  `latitude` decimal(10,6) DEFAULT NULL,
  `longitude` decimal(10,6) DEFAULT NULL,
  `adresse_complete` varchar(255) DEFAULT NULL,
  `date_modification` date DEFAULT NULL,
  PRIMARY KEY (`id_offre`),
  KEY `id_clinique` (`id_clinique`),
  CONSTRAINT `offre_ibfk_1` FOREIGN KEY (`id_clinique`) REFERENCES `CliniqueDentaire` (`id_clinique`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Offre`
--

LOCK TABLES `Offre` WRITE;
/*!40000 ALTER TABLE `Offre` DISABLE KEYS */;
/*!40000 ALTER TABLE `Offre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Message`
--

DROP TABLE IF EXISTS `Message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Message` (
  `id_message` int NOT NULL AUTO_INCREMENT,
  `expediteur_id` int NOT NULL,
  `destinataire_id` int NOT NULL,
  `contenu` varchar(1000) NOT NULL,
  `fichier_joint` varchar(255) DEFAULT NULL,
  `date_envoi` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_lecture` timestamp NULL DEFAULT NULL,
  `est_lu` char(1) DEFAULT 'N',
  PRIMARY KEY (`id_message`),
  KEY `expediteur_id` (`expediteur_id`),
  KEY `destinataire_id` (`destinataire_id`),
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`expediteur_id`) REFERENCES `Utilisateur` (`id_utilisateur`) ON DELETE CASCADE,
  CONSTRAINT `message_ibfk_2` FOREIGN KEY (`destinataire_id`) REFERENCES `Utilisateur` (`id_utilisateur`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE Message
ADD COLUMN est_modifie BOOLEAN DEFAULT FALSE;

ALTER TABLE Message
ADD COLUMN type_message VARCHAR(50) DEFAULT 'normal';

ALTER TABLE Message
ADD COLUMN id_offre INT DEFAULT NULL,
ADD CONSTRAINT fk_message_offre FOREIGN KEY (id_offre)
REFERENCES Offre(id_offre)
ON DELETE CASCADE;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Message`
--

LOCK TABLES `Message` WRITE;
/*!40000 ALTER TABLE `Message` DISABLE KEYS */;
/*!40000 ALTER TABLE `Message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Message_Archive`
--

DROP TABLE IF EXISTS `Message_Archive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Message_Archive` (
  `id_message` int NOT NULL,
  `expediteur_id` int DEFAULT NULL,
  `destinataire_id` int DEFAULT NULL,
  `contenu` varchar(1000) DEFAULT NULL,
  `fichier_joint` varchar(255) DEFAULT NULL,
  `date_envoi` timestamp NULL DEFAULT NULL,
  `date_lecture` timestamp NULL DEFAULT NULL,
  `est_lu` char(1) DEFAULT NULL,
  PRIMARY KEY (`id_message`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Message_Archive`
--

LOCK TABLES `Message_Archive` WRITE;
/*!40000 ALTER TABLE `Message_Archive` DISABLE KEYS */;
/*!40000 ALTER TABLE `Message_Archive` ENABLE KEYS */;
UNLOCK TABLES;



--
-- Table structure for table `Conversation`
--
CREATE TABLE Conversation (
  id_conversation INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur1_id INT NOT NULL,
  utilisateur2_id INT NOT NULL,
  id_offre INT DEFAULT NULL,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_conversation (utilisateur1_id, utilisateur2_id, id_offre),
  FOREIGN KEY (utilisateur1_id) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE,
  FOREIGN KEY (utilisateur2_id) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE,
  FOREIGN KEY (id_offre) REFERENCES Offre(id_offre) ON DELETE SET NULL
);

ALTER TABLE Message
ADD COLUMN id_conversation INT,
ADD CONSTRAINT fk_message_conversation FOREIGN KEY (id_conversation)
REFERENCES Conversation(id_conversation)
ON DELETE CASCADE;


--
-- Table structure for table `Evaluation`
--

DROP TABLE IF EXISTS `Evaluation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Evaluation` (
  `id_evaluation` int NOT NULL AUTO_INCREMENT,
  `evaluateur_id` int NOT NULL,
  `evalue_id` int NOT NULL,
  `id_offre` int NOT NULL,
  `note` int NOT NULL,
  `commentaire` varchar(1000) DEFAULT NULL,
  `date_evaluation` date NOT NULL,
  `est_approuve` char(1) DEFAULT 'N',
  `date_approbation` date DEFAULT NULL,
  PRIMARY KEY (`id_evaluation`),
  KEY `evaluateur_id` (`evaluateur_id`),
  KEY `evalue_id` (`evalue_id`),
  KEY `id_offre` (`id_offre`),
  CONSTRAINT `evaluation_ibfk_1` FOREIGN KEY (`evaluateur_id`) REFERENCES `Utilisateur` (`id_utilisateur`) ON DELETE CASCADE,
  CONSTRAINT `evaluation_ibfk_2` FOREIGN KEY (`evalue_id`) REFERENCES `Utilisateur` (`id_utilisateur`) ON DELETE CASCADE,
  CONSTRAINT `evaluation_ibfk_3` FOREIGN KEY (`id_offre`) REFERENCES `Offre` (`id_offre`) ON DELETE CASCADE,
  CONSTRAINT `evaluation_chk_1` CHECK ((`note` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Evaluation`
--

LOCK TABLES `Evaluation` WRITE;
/*!40000 ALTER TABLE `Evaluation` DISABLE KEYS */;
/*!40000 ALTER TABLE `Evaluation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Certification`
--

DROP TABLE IF EXISTS `Certification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Certification` (
  `id_certification` int NOT NULL AUTO_INCREMENT,
  `id_professionnel` int NOT NULL,
  `id_administrateur_verificateur` int DEFAULT NULL,
  `type_certification` varchar(50) NOT NULL,
  `titre` varchar(100) NOT NULL,
  `organisme_emetteur` varchar(100) NOT NULL,
  `date_obtention` date NOT NULL,
  `date_expiration` date DEFAULT NULL,
  `fichier` varchar(255) DEFAULT NULL,
  `est_verifiee` char(1) DEFAULT 'N',
  `date_verification` date DEFAULT NULL,
  PRIMARY KEY (`id_certification`),
  KEY `id_professionnel` (`id_professionnel`),
  KEY `id_administrateur_verificateur` (`id_administrateur_verificateur`),
  CONSTRAINT `certification_ibfk_1` FOREIGN KEY (`id_professionnel`) REFERENCES `ProfessionnelDentaire` (`id_professionnel`) ON DELETE CASCADE,
  CONSTRAINT `certification_ibfk_2` FOREIGN KEY (`id_administrateur_verificateur`) REFERENCES `Administrateur` (`id_admin`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Certification`
--

LOCK TABLES `Certification` WRITE;
/*!40000 ALTER TABLE `Certification` DISABLE KEYS */;
/*!40000 ALTER TABLE `Certification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Candidature`
--

DROP TABLE IF EXISTS `Candidature`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Candidature` (
  `id_candidature` int NOT NULL AUTO_INCREMENT,
  `id_offre` int NOT NULL,
  `id_professionnel` int NOT NULL,
  `id_administrateur_verificateur` int DEFAULT NULL,
  `date_candidature` date NOT NULL,
  `message_personnalise` varchar(1000) DEFAULT NULL,
  `statut` varchar(20) DEFAULT 'en_attente',
  `date_reponse` date DEFAULT NULL,
  `message_reponse` varchar(1000) DEFAULT NULL,
  `est_confirmee` char(1) DEFAULT 'N',
  PRIMARY KEY (`id_candidature`),
  KEY `id_offre` (`id_offre`),
  KEY `id_professionnel` (`id_professionnel`),
  KEY `id_administrateur_verificateur` (`id_administrateur_verificateur`),
  CONSTRAINT `candidature_ibfk_1` FOREIGN KEY (`id_offre`) REFERENCES `Offre` (`id_offre`) ON DELETE CASCADE,
  CONSTRAINT `candidature_ibfk_2` FOREIGN KEY (`id_professionnel`) REFERENCES `ProfessionnelDentaire` (`id_professionnel`) ON DELETE CASCADE,
  CONSTRAINT `candidature_ibfk_3` FOREIGN KEY (`id_administrateur_verificateur`) REFERENCES `Administrateur` (`id_admin`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Candidature`
--

LOCK TABLES `Candidature` WRITE;
/*!40000 ALTER TABLE `Candidature` DISABLE KEYS */;
/*!40000 ALTER TABLE `Candidature` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Disponibilite`
--

DROP TABLE IF EXISTS `Disponibilite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Disponibilite` (
  `id_disponibilite` int NOT NULL AUTO_INCREMENT,
  `id_professionnel` int NOT NULL,
  `jour_semaine` varchar(10) DEFAULT NULL,
  `date_specifique` date DEFAULT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL,
  `est_recurrente` char(1) DEFAULT 'N',
  `frequence_recurrence` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_disponibilite`),
  KEY `id_professionnel` (`id_professionnel`),
  CONSTRAINT `disponibilite_ibfk_1` FOREIGN KEY (`id_professionnel`) REFERENCES `ProfessionnelDentaire` (`id_professionnel`) ON DELETE CASCADE,
  CONSTRAINT `disponibilite_chk_1` CHECK ((`heure_debut` < `heure_fin`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Disponibilite`
--

LOCK TABLES `Disponibilite` WRITE;
/*!40000 ALTER TABLE `Disponibilite` DISABLE KEYS */;
/*!40000 ALTER TABLE `Disponibilite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notification`
--

DROP TABLE IF EXISTS `Notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notification` (
  `id_notification` int NOT NULL AUTO_INCREMENT,
  `id_destinataire` int NOT NULL,
  `type_notification` varchar(20) NOT NULL,
  `contenu` varchar(500) NOT NULL,
  `date_creation` datetime NOT NULL,
  `est_lue` char(1) DEFAULT 'N',
  `date_lecture` timestamp NULL DEFAULT NULL,
  `lien_action` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_notification`),
  KEY `id_destinataire` (`id_destinataire`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`id_destinataire`) REFERENCES `Utilisateur` (`id_utilisateur`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notification`
--

LOCK TABLES `Notification` WRITE;
/*!40000 ALTER TABLE `Notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `Notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Document`
--

DROP TABLE IF EXISTS `Document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Document` (
  `id_document` int NOT NULL AUTO_INCREMENT,
  `id_utilisateur` int NOT NULL,
  `type_document` varchar(30) NOT NULL,
  `nom_fichier` varchar(100) NOT NULL,
  `chemin_fichier` varchar(255) NOT NULL,
  `date_telechargement` date NOT NULL,
  `est_verifie` char(1) DEFAULT 'N',
  `date_verification` date DEFAULT NULL,
  PRIMARY KEY (`id_document`),
  KEY `id_utilisateur` (`id_utilisateur`),
  CONSTRAINT `document_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateur` (`id_utilisateur`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Document`
--

LOCK TABLES `Document` WRITE;
/*!40000 ALTER TABLE `Document` DISABLE KEYS */;
/*!40000 ALTER TABLE `Document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OffreRecommandee`
--

DROP TABLE IF EXISTS `OffreRecommandee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OffreRecommandee` (
  `id_recommendation` int NOT NULL AUTO_INCREMENT,
  `id_offre` int NOT NULL,
  `id_professionnel` int NOT NULL,
  `score_matching` decimal(5,2) NOT NULL,
  `date_recommandation` datetime NOT NULL,
  `est_notifiee` char(1) DEFAULT 'N',
  PRIMARY KEY (`id_recommendation`),
  KEY `id_offre` (`id_offre`),
  KEY `id_professionnel` (`id_professionnel`),
  CONSTRAINT `offrerecommandee_ibfk_1` FOREIGN KEY (`id_offre`) REFERENCES `Offre` (`id_offre`) ON DELETE CASCADE,
  CONSTRAINT `offrerecommandee_ibfk_2` FOREIGN KEY (`id_professionnel`) REFERENCES `ProfessionnelDentaire` (`id_professionnel`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OffreRecommandee`
--

LOCK TABLES `OffreRecommandee` WRITE;
/*!40000 ALTER TABLE `OffreRecommandee` DISABLE KEYS */;
/*!40000 ALTER TABLE `OffreRecommandee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProfessionnelCompetence`
--

DROP TABLE IF EXISTS `ProfessionnelCompetence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProfessionnelCompetence` (
  `id_professionnel` int NOT NULL,
  `id_competence` int NOT NULL,
  PRIMARY KEY (`id_professionnel`,`id_competence`),
  KEY `id_competence` (`id_competence`),
  CONSTRAINT `professionnelcompetence_ibfk_1` FOREIGN KEY (`id_professionnel`) REFERENCES `ProfessionnelDentaire` (`id_professionnel`) ON DELETE CASCADE,
  CONSTRAINT `professionnelcompetence_ibfk_2` FOREIGN KEY (`id_competence`) REFERENCES `Competence` (`id_competence`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProfessionnelCompetence`
--

LOCK TABLES `ProfessionnelCompetence` WRITE;
/*!40000 ALTER TABLE `ProfessionnelCompetence` DISABLE KEYS */;
/*!40000 ALTER TABLE `ProfessionnelCompetence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProfessionnelSpecialite`
--

DROP TABLE IF EXISTS `ProfessionnelSpecialite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProfessionnelSpecialite` (
  `id_professionnel` int NOT NULL,
  `id_specialite` int NOT NULL,
  PRIMARY KEY (`id_professionnel`,`id_specialite`),
  KEY `id_specialite` (`id_specialite`),
  CONSTRAINT `professionnelspecialite_ibfk_1` FOREIGN KEY (`id_professionnel`) REFERENCES `ProfessionnelDentaire` (`id_professionnel`) ON DELETE CASCADE,
  CONSTRAINT `professionnelspecialite_ibfk_2` FOREIGN KEY (`id_specialite`) REFERENCES `Specialite` (`id_specialite`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProfessionnelSpecialite`
--

LOCK TABLES `ProfessionnelSpecialite` WRITE;
/*!40000 ALTER TABLE `ProfessionnelSpecialite` DISABLE KEYS */;
/*!40000 ALTER TABLE `ProfessionnelSpecialite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SpecialiteClinique`
--

DROP TABLE IF EXISTS `SpecialiteClinique`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SpecialiteClinique` (
  `id_clinique` int NOT NULL,
  `id_specialite` int NOT NULL,
  PRIMARY KEY (`id_clinique`,`id_specialite`),
  KEY `id_specialite` (`id_specialite`),
  CONSTRAINT `specialiteclinique_ibfk_1` FOREIGN KEY (`id_clinique`) REFERENCES `CliniqueDentaire` (`id_clinique`) ON DELETE CASCADE,
  CONSTRAINT `specialiteclinique_ibfk_2` FOREIGN KEY (`id_specialite`) REFERENCES `Specialite` (`id_specialite`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SpecialiteClinique`
--

LOCK TABLES `SpecialiteClinique` WRITE;
/*!40000 ALTER TABLE `SpecialiteClinique` DISABLE KEYS */;
/*!40000 ALTER TABLE `SpecialiteClinique` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CliniqueEquipement`
--

DROP TABLE IF EXISTS `CliniqueEquipement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CliniqueEquipement` (
  `id_clinique` int NOT NULL,
  `id_equipement` int NOT NULL,
  PRIMARY KEY (`id_clinique`,`id_equipement`),
  KEY `id_equipement` (`id_equipement`),
  CONSTRAINT `cliniqueequipement_ibfk_1` FOREIGN KEY (`id_clinique`) REFERENCES `CliniqueDentaire` (`id_clinique`) ON DELETE CASCADE,
  CONSTRAINT `cliniqueequipement_ibfk_2` FOREIGN KEY (`id_equipement`) REFERENCES `Equipement` (`id_equipement`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CliniqueEquipement`
--

LOCK TABLES `CliniqueEquipement` WRITE;
/*!40000 ALTER TABLE `CliniqueEquipement` DISABLE KEYS */;
/*!40000 ALTER TABLE `CliniqueEquipement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Exceptions_Disponibilites`
--

DROP TABLE IF EXISTS `Exceptions_Disponibilites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Exceptions_Disponibilites` (
  `id_exception` int NOT NULL AUTO_INCREMENT,
  `id_disponibilite` int DEFAULT NULL,
  `date_exception` date DEFAULT NULL,
  `motif` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_exception`),
  KEY `id_disponibilite` (`id_disponibilite`),
  CONSTRAINT `exceptions_disponibilites_ibfk_1` FOREIGN KEY (`id_disponibilite`) REFERENCES `Disponibilite` (`id_disponibilite`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Exceptions_Disponibilites`
--

LOCK TABLES `Exceptions_Disponibilites` WRITE;
/*!40000 ALTER TABLE `Exceptions_Disponibilites` DISABLE KEYS */;
/*!40000 ALTER TABLE `Exceptions_Disponibilites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Routines
--

DELIMITER $$
/*!50003 DROP TRIGGER IF EXISTS `Archive_Messages` */$$
/*!50003 SET @saved_cs_client      = @@character_set_client */ $$
/*!50003 SET @saved_cs_results     = @@character_set_results */ $$
/*!50003 SET @saved_col_connection = @@collation_connection */ $$
/*!50003 SET character_set_client  = utf8mb4 */ $$
/*!50003 SET character_set_results = utf8mb4 */ $$
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ $$
/*!50003 SET @saved_sql_mode       = @@sql_mode */ $$
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ $$
CREATE DEFINER = CURRENT_USER TRIGGER `Archive_Messages` AFTER INSERT ON `Message` 
FOR EACH ROW
BEGIN
    -- Vérifie si la date d'envoi est antérieure à 6 mois
    IF NEW.date_envoi < NOW() - INTERVAL 6 MONTH THEN
        -- Archive le message
        INSERT INTO Message_Archive
        SELECT * FROM Message WHERE id_message = NEW.id_message;
    END IF;
END$$
DELIMITER ;

DELIMITER $$
/*!50003 DROP PROCEDURE IF EXISTS `Get_Creneaux_Disponibles` */$$
/*!50003 SET @saved_cs_client      = @@character_set_client */ $$
/*!50003 SET @saved_cs_results     = @@character_set_results */ $$
/*!50003 SET @saved_col_connection = @@collation_connection */ $$
/*!50003 SET character_set_client  = utf8mb4 */ $$
/*!50003 SET character_set_results = utf8mb4 */ $$
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ $$
/*!50003 SET @saved_sql_mode       = @@sql_mode */ $$
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ $$
CREATE DEFINER = CURRENT_USER PROCEDURE `Get_Creneaux_Disponibles`(IN professionnel_id INT, IN target_date DATE)
BEGIN
    SELECT heure_debut, heure_fin
    FROM Disponibilite
    WHERE id_professionnel = professionnel_id
      AND jour_semaine = DAYNAME(target_date);
END$$
DELIMITER ;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-24 12:00:00
ALTER TABLE ProfessionnelDentaire
  ADD COLUMN description TEXT,
  ADD COLUMN telephone VARCHAR(20),
  ADD COLUMN vehicule BOOLEAN DEFAULT false,
  ADD COLUMN regions JSON,
  ADD COLUMN date_debut_dispo DATE,
  ADD COLUMN date_fin_dispo DATE,
  ADD COLUMN jours_disponibles JSON,
  ADD COLUMN competences JSON,
  ADD COLUMN langues JSON,
  ADD COLUMN specialites JSON;
  
ALTER TABLE Utilisateur ADD COLUMN date_verification DATETIME NULL;
