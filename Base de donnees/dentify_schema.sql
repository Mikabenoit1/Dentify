-- Création de la base de données
DROP DATABASE IF EXISTS dentify;
CREATE DATABASE dentify;
USE dentify;

-- Suppression sécurisée des tables (ordre inverse des dépendances)
DROP TABLE IF EXISTS Exceptions_Disponibilites;
DROP TABLE IF EXISTS CliniqueEquipement;
DROP TABLE IF EXISTS SpecialiteClinique;
DROP TABLE IF EXISTS ProfessionnelSpecialite;
DROP TABLE IF EXISTS ProfessionnelCompetence;
DROP TABLE IF EXISTS OffreRecommandee;
DROP TABLE IF EXISTS Document;
DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS Disponibilite;
DROP TABLE IF EXISTS Candidature;
DROP TABLE IF EXISTS Certification;
DROP TABLE IF EXISTS Evaluation;
DROP TABLE IF EXISTS Message_Archive;
DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS Offre;
DROP TABLE IF EXISTS Competence;
DROP TABLE IF EXISTS Specialite;
DROP TABLE IF EXISTS Equipement;
DROP TABLE IF EXISTS Administrateur;
DROP TABLE IF EXISTS CliniqueDentaire;
DROP TABLE IF EXISTS ProfessionnelDentaire;
DROP TABLE IF EXISTS Utilisateur;

-- Table Utilisateur
CREATE TABLE Utilisateur (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(25) NOT NULL,
    prenom VARCHAR(25) NOT NULL,
    telephone VARCHAR(20),
    adresse VARCHAR(50),
    ville VARCHAR(50),
    province VARCHAR(25),
    code_postal VARCHAR(10),
    courriel VARCHAR(50) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(100) NOT NULL,
    type_utilisateur VARCHAR(25),
    photo_profil VARCHAR(100),
    derniere_connexion DATETIME,
    compte_verifie CHAR(1) DEFAULT 'N',
    date_inscription DATE,
    accepte_notifications CHAR(1) DEFAULT 'Y',
    est_actif CHAR(1) DEFAULT 'Y'
);

-- Table ProfessionnelDentaire
CREATE TABLE ProfessionnelDentaire (
    id_professionnel INT AUTO_INCREMENT PRIMARY KEY,
    numero_permis VARCHAR(10) NOT NULL,
    type_profession VARCHAR(20) NOT NULL,
    annees_experience INT,
    tarif_horaire DECIMAL(6,2),
    rayon_deplacement_km INT,
    disponibilite_immediate CHAR(1) DEFAULT 'N',
    site_web VARCHAR(100),
    id_utilisateur INT,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- Table CliniqueDentaire
CREATE TABLE CliniqueDentaire (
    id_clinique INT AUTO_INCREMENT PRIMARY KEY,
    nom_clinique VARCHAR(100) NOT NULL,
    numero_entreprise VARCHAR(10) NOT NULL,
    adresse_complete VARCHAR(255),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    horaire_ouverture VARCHAR(500),
    site_web VARCHAR(100),
    id_utilisateur INT,
    logiciels_utilises VARCHAR(255),
    type_dossier VARCHAR(20),
    type_radiographie VARCHAR(30),
    compte_verifie CHAR(1) DEFAULT 'N',
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- Table Administrateur
CREATE TABLE Administrateur (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT,
    niveau_acces VARCHAR(20) NOT NULL,
    departement VARCHAR(50),
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- Table Equipement
CREATE TABLE Equipement (
    id_equipement INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE,
    descript VARCHAR(500),
    categorie VARCHAR(30)
);

-- Table Specialite
CREATE TABLE Specialite (
    id_specialite INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50),
    descript VARCHAR(500)
);

-- Table Competence
CREATE TABLE Competence (
    id_competence INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE,
    descript VARCHAR(500),
    categorie VARCHAR(30)
);

-- Table Offre
CREATE TABLE Offre (
    id_offre INT AUTO_INCREMENT PRIMARY KEY,
    id_clinique INT NOT NULL,
    titre VARCHAR(100) NOT NULL,
    descript VARCHAR(500) NOT NULL,
    type_professionnel VARCHAR(20) NOT NULL,
    date_publication DATE NOT NULL,
    date_mission DATE NOT NULL,
    heure_debut DATETIME,
    heure_fin DATETIME,
    duree_heures DECIMAL(5,2),
    remuneration DECIMAL(10,2) NOT NULL,
    est_urgent CHAR(1) DEFAULT 'N',
    statut VARCHAR(20) DEFAULT 'active',
    competences_requises VARCHAR(500),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    adresse_complete VARCHAR(255),
    date_modification DATE,
    FOREIGN KEY (id_clinique) REFERENCES CliniqueDentaire(id_clinique) ON DELETE CASCADE
);

-- Table Message
CREATE TABLE Message (
    id_message INT AUTO_INCREMENT PRIMARY KEY,
    expediteur_id INT NOT NULL,
    destinataire_id INT NOT NULL,
    contenu VARCHAR(1000) NOT NULL,
    fichier_joint VARCHAR(255),
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_lecture TIMESTAMP,
    est_lu CHAR(1) DEFAULT 'N',
    FOREIGN KEY (expediteur_id) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (destinataire_id) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- Table Message_Archive
CREATE TABLE Message_Archive (
    id_message INT PRIMARY KEY,
    expediteur_id INT,
    destinataire_id INT,
    contenu VARCHAR(1000),
    fichier_joint VARCHAR(255),
    date_envoi TIMESTAMP,
    date_lecture TIMESTAMP,
    est_lu CHAR(1)
);

-- Table Evaluation
CREATE TABLE Evaluation (
    id_evaluation INT AUTO_INCREMENT PRIMARY KEY,
    evaluateur_id INT NOT NULL,
    evalue_id INT NOT NULL,
    id_offre INT NOT NULL,
    note INT CHECK (note BETWEEN 1 AND 5),
    commentaire VARCHAR(1000),
    date_evaluation DATE NOT NULL,
    est_approuve CHAR(1) DEFAULT 'N',
    date_approbation DATE,
    FOREIGN KEY (evaluateur_id) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (evalue_id) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_offre) REFERENCES Offre(id_offre) ON DELETE CASCADE
);

-- Table Certification
CREATE TABLE Certification (
    id_certification INT AUTO_INCREMENT PRIMARY KEY,
    id_professionnel INT NOT NULL,
    id_administrateur_verificateur INT,
    type_certification VARCHAR(50) NOT NULL,
    titre VARCHAR(100) NOT NULL,
    organisme_emetteur VARCHAR(100) NOT NULL,
    date_obtention DATE NOT NULL,
    date_expiration DATE,
    fichier VARCHAR(255),
    est_verifiee CHAR(1) DEFAULT 'N',
    date_verification DATE,
    FOREIGN KEY (id_professionnel) REFERENCES ProfessionnelDentaire(id_professionnel) ON DELETE CASCADE,
    FOREIGN KEY (id_administrateur_verificateur) REFERENCES Administrateur(id_admin) ON DELETE SET NULL
);

-- Table Candidature
CREATE TABLE Candidature (
    id_candidature INT AUTO_INCREMENT PRIMARY KEY,
    id_offre INT NOT NULL,
    id_professionnel INT NOT NULL,
    id_administrateur_verificateur INT,
    date_candidature DATE NOT NULL,
    message_personnalise VARCHAR(1000),
    statut VARCHAR(20) DEFAULT 'en_attente',
    date_reponse DATE,
    message_reponse VARCHAR(1000),
    est_confirmee CHAR(1) DEFAULT 'N',
    FOREIGN KEY (id_offre) REFERENCES Offre(id_offre) ON DELETE CASCADE,
    FOREIGN KEY (id_professionnel) REFERENCES ProfessionnelDentaire(id_professionnel) ON DELETE CASCADE,
    FOREIGN KEY (id_administrateur_verificateur) REFERENCES Administrateur(id_admin) ON DELETE CASCADE
);

-- Table Disponibilite
CREATE TABLE Disponibilite (
    id_disponibilite INT AUTO_INCREMENT PRIMARY KEY,
    id_professionnel INT NOT NULL,
    jour_semaine VARCHAR(10),
    date_specifique DATE,
    heure_debut DATETIME NOT NULL,
    heure_fin DATETIME NOT NULL,
    est_recurrente CHAR(1) DEFAULT 'N',
    frequence_recurrence VARCHAR(20),
    CHECK (heure_debut < heure_fin),
    FOREIGN KEY (id_professionnel) REFERENCES ProfessionnelDentaire(id_professionnel) ON DELETE CASCADE
);

-- Table Notification
CREATE TABLE Notification (
    id_notification INT AUTO_INCREMENT PRIMARY KEY,
    id_destinataire INT NOT NULL,
    type_notification VARCHAR(20) NOT NULL,
    contenu VARCHAR(500) NOT NULL,
    date_creation TIMESTAMP NOT NULL,
    est_lue CHAR(1) DEFAULT 'N',
    date_lecture TIMESTAMP,
    lien_action VARCHAR(255),
    FOREIGN KEY (id_destinataire) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- Table Document
CREATE TABLE Document (
    id_document INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT NOT NULL,
    type_document VARCHAR(30) NOT NULL,
    nom_fichier VARCHAR(100) NOT NULL,
    chemin_fichier VARCHAR(255) NOT NULL,
    date_telechargement DATE NOT NULL,
    est_verifie CHAR(1) DEFAULT 'N',
    date_verification DATE,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- Table OffreRecommandee
CREATE TABLE OffreRecommandee (
    id_recommendation INT AUTO_INCREMENT PRIMARY KEY,
    id_offre INT NOT NULL,
    id_professionnel INT NOT NULL,
    score_matching DECIMAL(5,2) NOT NULL,
    date_recommandation TIMESTAMP NOT NULL,
    est_notifiee CHAR(1) DEFAULT 'N',
    FOREIGN KEY (id_offre) REFERENCES Offre(id_offre) ON DELETE CASCADE,
    FOREIGN KEY (id_professionnel) REFERENCES ProfessionnelDentaire(id_professionnel) ON DELETE CASCADE
);

-- Table de liaison ProfessionnelCompetence
CREATE TABLE ProfessionnelCompetence (
    id_professionnel INT NOT NULL,
    id_competence INT NOT NULL,
    PRIMARY KEY (id_professionnel, id_competence),
    FOREIGN KEY (id_professionnel) REFERENCES ProfessionnelDentaire(id_professionnel) ON DELETE CASCADE,
    FOREIGN KEY (id_competence) REFERENCES Competence(id_competence) ON DELETE CASCADE
);

-- Table de liaison ProfessionnelSpecialite
CREATE TABLE ProfessionnelSpecialite (
    id_professionnel INT NOT NULL,
    id_specialite INT NOT NULL,
    PRIMARY KEY (id_professionnel, id_specialite),
    FOREIGN KEY (id_professionnel) REFERENCES ProfessionnelDentaire(id_professionnel) ON DELETE CASCADE,
    FOREIGN KEY (id_specialite) REFERENCES Specialite(id_specialite) ON DELETE CASCADE
);

-- Table de liaison SpecialiteClinique
CREATE TABLE SpecialiteClinique (
    id_clinique INT NOT NULL,
    id_specialite INT NOT NULL,
    PRIMARY KEY (id_clinique, id_specialite),
    FOREIGN KEY (id_clinique) REFERENCES CliniqueDentaire(id_clinique) ON DELETE CASCADE,
    FOREIGN KEY (id_specialite) REFERENCES Specialite(id_specialite) ON DELETE CASCADE
);

-- Table de liaison CliniqueEquipement
CREATE TABLE CliniqueEquipement (
    id_clinique INT NOT NULL,
    id_equipement INT NOT NULL,
    PRIMARY KEY (id_clinique, id_equipement),
    FOREIGN KEY (id_clinique) REFERENCES CliniqueDentaire(id_clinique) ON DELETE CASCADE,
    FOREIGN KEY (id_equipement) REFERENCES Equipement(id_equipement) ON DELETE CASCADE
);

-- Table Exceptions_Disponibilites
CREATE TABLE Exceptions_Disponibilites (
    id_exception INT AUTO_INCREMENT PRIMARY KEY,
    id_disponibilite INT,
    date_exception DATE,
    motif VARCHAR(255),
    FOREIGN KEY (id_disponibilite) REFERENCES Disponibilite(id_disponibilite)
);
-- ✅ Trigger pour archiver automatiquement les messages de plus de 6 mois
DELIMITER $$

CREATE TRIGGER Archive_Messages
AFTER INSERT ON Message
FOR EACH ROW
BEGIN
  IF NEW.date_envoi < NOW() - INTERVAL 6 MONTH THEN
    INSERT INTO Message_Archive (
      id_message, expediteur_id, destinataire_id, contenu,
      fichier_joint, date_envoi, date_lecture, est_lu
    )
    VALUES (
      NEW.id_message, NEW.expediteur_id, NEW.destinataire_id, NEW.contenu,
      NEW.fichier_joint, NEW.date_envoi, NEW.date_lecture, NEW.est_lu
    );
  END IF;
END$$

DELIMITER ;

-- ✅ Procédure stockée : Obtenir les créneaux d’un professionnel un jour donné
DELIMITER $$

CREATE PROCEDURE Get_Creneaux_Disponibles (
  IN professionel_id INT,
  IN target_date DATE
)
BEGIN
  SELECT heure_debut, heure_fin
  FROM Disponibilite
  WHERE id_professionnel = professionel_id
    AND (
      (est_recurrente = 'Y' AND jour_semaine = DAYNAME(target_date))
      OR (date_specifique = target_date)
    );
END$$

DELIMITER ;




