import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { registerUser } from "../api/index";  // Importation de la nouvelle méthode générique

export default function Inscription({ navigation }) {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInscription = async () => {
    if (!nom || !prenom || !email || !password || !confirmPassword) {
      setError("Tous les champs sont obligatoires");
      return;
    }
  
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Veuillez entrer un email valide");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
  
    setIsLoading(true);
    setError("");
  
    try {
      // Appel à la méthode générique avec type_utilisateur "professionnel"
      const response = await registerUser({
        nom,
        prenom,
        courriel: email,
        mot_de_passe: password,
        adresse: "",
        ville: "",
        province: "",
        code_postal: "",
      }, "professionnel");  // Passer "professionnel" en type_utilisateur
  
      // Redirection en fonction du type d'utilisateur
      if (response.type_utilisateur === "professionnel") {
        navigation.navigate("Accueil");  // Accueil professionnel
      } else if (response.type_utilisateur === "clinique") {
        navigation.navigate("AccueilClinique");  // Accueil clinique
      } else {
        navigation.navigate("Connexions");
      }
  
    } catch (error) {
      setError(error.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fbf2e8" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.buttonBack}
          onPress={() => navigation.navigate("Indexx")}
        >
          <Text style={styles.buttonTextBack}>Retour à la page principale</Text>
        </TouchableOpacity>

        <View style={styles.container}>
          <Image
            source={require("../assets/dentify_logo_noir.png")}
            style={styles.logo}
          />

          <Text style={styles.title}>Inscription en tant que professionnel</Text>

          <TextInput
            style={styles.input}
            placeholder="Prénom"
            onChangeText={setPrenom}
            value={prenom}
          />
          <TextInput
            style={styles.input}
            placeholder="Nom de famille"
            onChangeText={setNom}
            value={nom}
          />
          <TextInput
            style={styles.input}
            placeholder="Adresse courriel"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            secureTextEntry
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleInscription}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>S'inscrire</Text>
            )}
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <Text style={styles.textNormal}>Vous êtes une clinique? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("InscriptionCli")}
            >
              <Text style={styles.linkText}>Inscription clinique</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.linkContainer}>
            <Text style={styles.textNormal}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Connexions")}>
              <Text style={styles.linkText}>Connexion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingTop: 80,
    alignItems: "center",
    minHeight: "150%", // 👈 Forcer du contenu à dépasser l'écran
  },
  container: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
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
    fontSize: 14,
    color: "#34607d",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  buttonBack: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: "#34607d",
    padding: 10,
    borderRadius: 10,
  },
  buttonTextBack: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
