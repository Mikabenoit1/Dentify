import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";


export default function Connexions({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>

       <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.navigate("Indexx")}>
        <Text style={styles.buttonTextBack}> Retour à la page principale </Text>
       </TouchableOpacity>


      {/* L'image du logo Dentify */}
      <Image source={require("../assets/dentify_logo_noir.png")} style={styles.logo}/>

      <Text style={styles.title}>Connexion en tant que professionnel</Text>


        {/* Rentrer les informations pour se connecter */}
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
        {/* Bouton pour se connecter */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Accueil")}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

        {/* Si une clinique ou pas de compte */}
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

      <View style={styles.linkContainer}>
        <Text style={styles.textNormal}>Mot de passe oublié ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("ResetMdp")}>
          <Text style={styles.linkText}>Réinitialisation du mot de passe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbf2e8", 
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
});
