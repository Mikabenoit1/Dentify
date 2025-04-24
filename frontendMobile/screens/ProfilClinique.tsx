import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { getProfileDetails } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilClinique = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    nom: "",
    adresse: "",
    ville: "",
    province: "",
    code_postal: "",
    nom_clinique: "",
    numero_entreprise: "",
    adresse_complete: "",
    latitude: "",
    longitude: "",
    horaire_ouverture: "",
    site_web: "",
    logiciels_utilises: "",
    type_dossier: "",
    type_radiographie: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { user } = await getProfileDetails();
        setProfile(user);
      } catch (err) {
        Alert.alert("Erreur", err.message || "Impossible de charger le profil");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://192.168.1.190:4000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur serveur");

      Alert.alert("Succès", "Profil mis à jour avec succès");
      setIsEditing(false);
    } catch (err) {
      Alert.alert("Erreur", err.message || "Impossible de sauvegarder les modifications");
    }
  };

  const fields = [
    { label: "Nom complet", key: "nom" },
    { label: "Adresse", key: "adresse" },
    { label: "Ville", key: "ville" },
    { label: "Province", key: "province" },
    { label: "Code postal", key: "code_postal" },
    { label: "Nom de la clinique", key: "nom_clinique" },
    { label: "Numéro d’entreprise", key: "numero_entreprise" },
    { label: "Adresse complète", key: "adresse_complete" },
    { label: "Latitude", key: "latitude" },
    { label: "Longitude", key: "longitude" },
    { label: "Horaire d’ouverture", key: "horaire_ouverture" },
    { label: "Site web", key: "site_web" },
    { label: "Logiciels utilisés", key: "logiciels_utilises" },
    { label: "Type de dossier", key: "type_dossier" },
    { label: "Type de radiographie", key: "type_radiographie" }
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={24} color="#6a9174" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.editToggle} onPress={() => setIsEditing(!isEditing)}>
        <Feather name={isEditing ? "check" : "edit"} size={24} color="#6a9174" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileIcon}>
          <MaterialCommunityIcons name="account-circle" size={100} color="#6a9174" />
        </View>

        {fields.map(({ label, key }) => (
          <View key={key} style={{ marginBottom: 10 }}>
            <Text style={styles.label}>{label}</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profile[key]?.toString() || ""}
                onChangeText={(text) => handleChange(key, text)}
              />
            ) : (
              <Text style={styles.textValue}>{profile[key] || "-"}</Text>
            )}
          </View>
        ))}

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbf2e8', paddingTop: 50 },
  backButton: { position: 'absolute', top: 30, left: 30, zIndex: 1 },
  editToggle: { position: 'absolute', top: 30, right: 30, zIndex: 1 },
  content: { padding: 20, paddingTop: 40, paddingBottom: 40 },
  profileIcon: { alignSelf: 'center', marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 5 },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  textValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500'
  },
  saveButton: {
    backgroundColor: '#6a9174',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default ProfilClinique;
