import { Link } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function InscriptionCli() {

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
      
  const goBack = () => {
    if (router.canGoBack()) {
       router.back(); // Revenir à la page précédente
    }
  }
    

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <FontAwesome name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        
      {/* L'image du logo Dentify */}
      <Image source={require("../assets/images/dentify_logo_noir.png")} style={styles.logo} />

      <Text style={styles.title}>Inscription en tant que clinique</Text>

      {/* Rentrer les informations pour s'inscrire */}
      <TextInput style={styles.input} 
      placeholder="Nom de l'établissement" 
      onChangeText={setNom} 
      value={nom} />
      <TextInput style={styles.input} 
      placeholder="Adresse courriel" 
      keyboardType="email-address" 
      onChangeText={setEmail} 
      value={email} />
      <TextInput style={styles.input} 
      placeholder="Mot de passe" 
      secureTextEntry 
      onChangeText={setPassword} 
      value={password} />
      <TextInput style={styles.input} 
      placeholder="Confirmer le mot de passe" 
      secureTextEntry 
      onChangeText={setConfirmPassword} 
      value={confirmPassword} />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Bouton pour s'inscrire */}
      <Link href="/accueil" asChild>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
      </Link>


      {/* Si professionnel ou déjà un compte */}
      <View style={styles.linkContainer}>
        <Text style={styles.textNormal}>Vous êtes un professionnel? </Text>
        <Link href="/inscription" asChild>
        <TouchableOpacity>
          <Text style={styles.linkText}>Inscription professionnel</Text>
        </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.linkContainer}>
        <Text style={styles.textNormal}>Déjà un compte ? </Text>
        <Link href="/loginClinique" asChild>
        <TouchableOpacity>
          <Text style={styles.linkText}>Connexion</Text>
        </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbf2e8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 0,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#34607d",
    textAlign: "center",
    marginBottom: 30,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#34607d',
    padding: 10,
    borderRadius: 10,
    zIndex: 10,
    marginTop: 50,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ae9f86",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#6a9174",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  textNormal: {
    fontSize: 14,
    color: "#333",
  },
  linkText: {
    fontSize: 10,
    color: "#34607d",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 10,
    marginBottom: 10,
  },
});