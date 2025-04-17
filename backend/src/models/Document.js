module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    id_document: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type_document: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    nom_fichier: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    chemin_fichier: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    date_telechargement: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    est_verifie: {
      type: DataTypes.CHAR(1),
      defaultValue: 'N'
    },
    date_verification: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'Document',
    timestamps: false
  });

  Document.associate = (models) => {
    Document.belongsTo(models.User, {
      foreignKey: 'id_utilisateur',
      as: 'utilisateur',
      onDelete: 'CASCADE'
    });
  };

  return Document;
};