import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const ResetMdp = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erreur', "Veuillez entrer votre adresse e-mail.");
      return;
    }

    try {
      const response = await fetch('http://172.20.10.2:4000/api/reset/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courriel: email }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Succès', data.message);
        navigation.navigate('EmailVerification', { courriel: email });
      } else {
        Alert.alert('Erreur', data.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de contacter le serveur.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.navigate("Connexions")}>
        <Text style={styles.buttonTextBack}> Annuler et revenir à la connexion </Text>
      </TouchableOpacity>

      <Text style={styles.title}>Réinitialiser le mot de passe</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Entrez votre e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Envoyer le code</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetMdp;



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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#34607d", 
    textAlign: "center",
    marginBottom: 40,
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
});
