import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { getProfileDetails } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profil = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({});

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
      const response = await fetch("http://172.20.10.2:4000/api/users/profile", {
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
      Alert.alert("Erreur", err.message || "Impossible de sauvegarder");
    }
  };

  const fields = [
    { label: "Prénom", key: "prenom" },
    { label: "Nom", key: "nom" },
    { label: "Adresse", key: "adresse" },
    { label: "Ville", key: "ville" },
    { label: "Province", key: "province" },
    { label: "Code postal", key: "code_postal" },
    { label: "Téléphone", key: "telephone" },
    { label: "Numéro de permis", key: "numero_permis" },
    { label: "Type de profession", key: "type_profession" },
    { label: "Années d'expérience", key: "annees_experience" },
    { label: "Tarif horaire", key: "tarif_horaire" },
    { label: "Rayon de déplacement (km)", key: "rayon_deplacement_km" },
    { label: "Site web", key: "site_web" },
    { label: "Description", key: "description", multiline: true },
    { label: "Langues", key: "langues" },
    { label: "Régions", key: "regions" },
    { label: "Jours disponibles", key: "jours_disponibles" },
    { label: "Compétences", key: "competences" },
    { label: "Spécialités", key: "specialites" },
    { label: "Disponible immédiatement (Y/N)", key: "disponibilite_immediate" },
    { label: "Véhicule (true/false)", key: "vehicule" }
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

        {fields.map(({ label, key, multiline }) => (
          <View key={key} style={{ marginBottom: 10 }}>
            <Text style={styles.label}>{label}</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, multiline && { height: 80 }]}
                value={profile[key]?.toString() || ""}
                onChangeText={(text) => handleChange(key, text)}
                multiline={multiline}
              />
            ) : (
              <Text style={styles.textValue}>{profile[key]?.toString() || "-"}</Text>
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

export default Profil;
