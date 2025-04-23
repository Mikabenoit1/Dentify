  const { sequelize } = require('../config/db');

const User = require('./User');
const Offre = require('./Offre');
const Candidature = require('./Candidature');
const CliniqueDentaire = require('./CliniqueDentaire');
const ProfessionnelDentaire = require('./ProfessionnelDentaire');
const Message = require('./Message');
const ResetToken = require('./ResetToken');
const Notification = require('./Notification');
const Entretien = require('./Entretien');
const Evaluation = require('./Evaluation');
const Document = require('./Document')(sequelize, require('sequelize').DataTypes);
const Conversation = require('./Conversation');

  //  Utilisateur → CliniqueDentaire (1:1)
  User.hasOne(CliniqueDentaire, {
    foreignKey: 'id_utilisateur',
    onDelete: 'CASCADE'
  });
  CliniqueDentaire.belongsTo(User, {
    foreignKey: 'id_utilisateur'
  });

  //  Utilisateur → ProfessionnelDentaire (1:1)
  User.hasOne(ProfessionnelDentaire, {
    foreignKey: 'id_utilisateur',
    onDelete: 'CASCADE'
  });
  ProfessionnelDentaire.belongsTo(User, {
    foreignKey: 'id_utilisateur'
  });

  //  CliniqueDentaire → Offre (1:N)
  CliniqueDentaire.hasMany(Offre, {
    foreignKey: 'id_clinique',
    onDelete: 'CASCADE'
  });
  Offre.belongsTo(CliniqueDentaire, {
    foreignKey: 'id_clinique'
  });

  //  Offre → Candidature (1:N)
  Offre.hasMany(Candidature, {
    foreignKey: 'id_offre',
    onDelete: 'CASCADE'
  });
  Candidature.belongsTo(Offre, {
    foreignKey: 'id_offre'
  });

  //  ProfessionnelDentaire → Candidature (1:N)
  ProfessionnelDentaire.hasMany(Candidature, {
    foreignKey: 'id_professionnel',
    onDelete: 'CASCADE'
  });
  Candidature.belongsTo(ProfessionnelDentaire, {
    foreignKey: 'id_professionnel'
  });

  //  Utilisateur → Messages envoyés
  User.hasMany(Message, {
    foreignKey: 'expediteur_id',
    as: 'messages_envoyes',
    onDelete: 'CASCADE'
  });
  Message.belongsTo(User, {
    foreignKey: 'expediteur_id',
    as: 'expediteur'
  });

  //  Utilisateur → Messages reçus
  User.hasMany(Message, {
    foreignKey: 'destinataire_id',
    as: 'messages_recus',
    onDelete: 'CASCADE'
  });
  Message.belongsTo(User, {
    foreignKey: 'destinataire_id',
    as: 'destinataire'
  });

  //  Utilisateur → ResetToken (1:N)
  User.hasMany(ResetToken, {
    foreignKey: 'id_utilisateur',
    onDelete: 'CASCADE'
  });
  ResetToken.belongsTo(User, {
    foreignKey: 'id_utilisateur'
  });

  User.hasMany(Notification, {
    foreignKey: 'id_destinataire',
    onDelete: 'CASCADE'
  });
  Notification.belongsTo(User, {
    foreignKey: 'id_destinataire'
  });

//  Utilisateur → Document (1:N)
User.hasMany(Document, {
  foreignKey: 'id_utilisateur',
  onDelete: 'CASCADE'
});
Document.belongsTo(User, {
  foreignKey: 'id_utilisateur'
});

//  Evaluation → Utilisateur (1:N) - évaluateur
User.hasMany(Evaluation, {
  foreignKey: 'evaluateur_id',
  onDelete: 'CASCADE',
  as: 'evaluations_donnees'  // Unique alias for evaluations given by user
});
Evaluation.belongsTo(User, {
  foreignKey: 'evaluateur_id',
  as: 'auteur_evaluation'  // Changed to unique alias
});

//  Evaluation → Utilisateur (1:N) - évalué
User.hasMany(Evaluation, {
  foreignKey: 'evalue_id',
  onDelete: 'CASCADE',
  as: 'evaluations_recues'  // Unique alias for evaluations received by user
});
Evaluation.belongsTo(User, {
  foreignKey: 'evalue_id',
  as: 'sujet_evaluation'  // Changed to unique alias
});


//  ProfessionnelDentaire → User (1:1 inverse pour les includes imbriqués)
Candidature.belongsTo(ProfessionnelDentaire, {
  foreignKey: 'id_professionnel'
});
ProfessionnelDentaire.belongsTo(User, {
  foreignKey: 'id_utilisateur'
});


  //  Conversation → Utilisateur 1
  Conversation.belongsTo(User, {
    foreignKey: 'utilisateur1_id',
    as: 'utilisateur1'
  });
  User.hasMany(Conversation, {
    foreignKey: 'utilisateur1_id',
    as: 'conversations_envoyees'
  });
  
  //  Conversation → Utilisateur 2
  Conversation.belongsTo(User, {
    foreignKey: 'utilisateur2_id',
    as: 'utilisateur2'
  });
  User.hasMany(Conversation, {
    foreignKey: 'utilisateur2_id',
    as: 'conversations_recues'
  });
  
  //  Conversation → Offre (facultatif)
  Conversation.belongsTo(Offre, {
    foreignKey: 'id_offre',
    as: 'offre'
  });
  Offre.hasMany(Conversation, {
    foreignKey: 'id_offre',
    as: 'conversations'
  });
  
  //  Conversation → Message (1:N)
  Conversation.hasMany(Message, {
    foreignKey: 'id_conversation',
    as: 'messages'
  });
  Message.belongsTo(Conversation, {
    foreignKey: 'id_conversation',
    as: 'conversation_associe'
  });


module.exports = {
  sequelize,
  User,
  Offre,
  Candidature,
  CliniqueDentaire,
  ProfessionnelDentaire,
  Message,
  ResetToken,
  Notification,
  Document,
  Entretien,
  Evaluation,
  Conversation
};
