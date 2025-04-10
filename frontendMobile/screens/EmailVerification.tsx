import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const EmailVerification = ({ navigation }: any) => {
  const [verificationCode, setVerificationCode] = useState<string>('');

  const handleVerifyCode = () => {
    if (verificationCode.length !== 6) {
      Alert.alert('Erreur', 'Votre code ne contient pas 6 chiffres.');
      return;
    }

    // simule la vérification du code
    Alert.alert('Succès', 'Code vérifié avec succès!');
    
    // va vers la page de changement de mot de passe
    navigation.navigate('NewMdp');
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.navigate("Connexions")}>
          <Text style={styles.buttonTextBack}> Annuler et revenir à la connexion </Text>
      </TouchableOpacity>


      <Text style={styles.title}>Vérification du code</Text>

      <TextInput
        style={styles.input}
        placeholder="6 chiffres"
        keyboardType="numeric"
        maxLength={6}
        value={verificationCode}
        onChangeText={setVerificationCode}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmailVerification;

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
