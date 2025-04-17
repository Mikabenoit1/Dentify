import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
import { loginUser } from "../api";

export default function Connexions({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Veuillez entrer un email valide");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await loginUser({
        courriel: email,
        mot_de_passe: password,
        type_utilisateur: "professionnel"
      });

      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("type", response.type_utilisateur);
      await AsyncStorage.setItem("userId", String(response.id_utilisateur));

      navigation.navigate("Accueil");
    } catch (error) {
      setError(error.message || "Échec de la connexion");
      Alert.alert("Erreur", error.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TouchableOpacity 
            style={styles.buttonBack} 
            onPress={() => navigation.navigate("Indexx")}
          >
            <Text style={styles.buttonTextBack}>Retour à la page principale</Text>
          </TouchableOpacity>

          <Image 
            source={require("../assets/dentify_logo_noir.png")} 
            style={styles.logo}
          />

          <Text style={styles.title}>Connexion en tant que professionnel</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#666"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <Text style={styles.textNormal}>Vous êtes une clinique? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("ConnexionCli")}>
              <Text style={styles.linkText}>Connexion clinique</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.linkContainer}>
            <Text style={styles.textNormal}>Première fois? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Inscription")}>
              <Text style={styles.linkText}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fbf2e8", 
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
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
});