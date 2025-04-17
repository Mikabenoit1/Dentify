import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons';

const ProfilClinique = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Clinique de Sourire",
    company: "Clinique",
    position: "5950 St-Catherine, Montréal, QC H2X 2X9",
    website: "http://www.Clinique_Sourire.com/",
    documents: ["Certificat-Dentaire.pdf", "License.pdf"]
  });

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const pickDocument = () => {
    const newDocName = `Document_${profile.documents.length + 1}.pdf`;
    setProfile(prev => ({
      ...prev,
      documents: [...prev.documents, newDocName]
    }));
    Alert.alert("Document simulé", `${newDocName} a été ajouté`);
  };

  const removeDocument = (index) => {
    setProfile(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} color="#6a9174" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.editToggle}
        onPress={() => setIsEditing(!isEditing)}
      >
        <Feather name={isEditing ? "check" : "edit"} size={24} color="#6a9174" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileIcon}>
          <MaterialCommunityIcons 
            name="account-circle" 
            size={100} 
            color="#6a9174" 
          />
        </View>

        <Text style={styles.nameLabel}>Nom *</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={(text) => handleChange('name', text)}
          />
        ) : (
          <Text style={styles.name}>{profile.name}</Text>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Établissement</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profile.company}
              onChangeText={(text) => handleChange('company', text)}
            />
          ) : (
            <Text style={styles.infoValue}>{profile.company}</Text>
          )}

          <Text style={styles.infoLabel}>Adresse</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profile.position}
              onChangeText={(text) => handleChange('position', text)}
            />
          ) : (
            <Text style={styles.infoValue}>{profile.position}</Text>
          )}
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biographie</Text>

          <Text style={styles.infoLabel}>Site Internet</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profile.website}
              onChangeText={(text) => handleChange('website', text)}
            />
          ) : (
            <TouchableOpacity>
              <Text style={styles.linkText}>{profile.website}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>

          {profile.documents.map((doc, index) => (
            <View key={index} style={styles.documentItem}>
              <FontAwesome name="file-text-o" size={20} color="#6a9174" />
              <Text style={styles.documentName}>{doc}</Text>
              {isEditing && (
                <TouchableOpacity onPress={() => removeDocument(index)}>
                  <Feather name="trash-2" size={20} color="#ff6b6b" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {isEditing && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={pickDocument}
            >
              <Feather name="plus" size={20} color="#6a9174" />
              <Text style={styles.addButtonText}>Ajouter un document</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditing && (
          <TouchableOpacity 
            style={styles.validateButton}
            onPress={() => {
              setIsEditing(false);
              Alert.alert("Succès", "Profil mis à jour");
            }}
          >
            <Text style={styles.validateButtonText}>Enregistrer les modifications</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf2e8',
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 30,
    zIndex: 1,
  },
  editToggle: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  profileIcon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  nameLabel: {
    color: '#6a9174',
    fontSize: 12,
    marginBottom: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34607d',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34607d',
    marginBottom: 15,
  },
  linkText: {
    fontSize: 16,
    color: '#6a9174',
    marginBottom: 15,
    textDecorationLine: 'underline',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  documentName: {
    flex: 1,
    marginLeft: 10,
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#6a9174',
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#6a9174',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  validateButton: {
    backgroundColor: '#6a9174',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  validateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfilClinique;