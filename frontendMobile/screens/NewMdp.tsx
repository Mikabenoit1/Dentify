import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const NewMdp = ({navigation}) => {
  const [verificationCode, setVerificationMdp] = useState<string>('');
  const [newPassword, setNewMdp] = useState<string>('');
  const [confirmPassword, setConfirmationMdp] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = () => {

    if (verificationCode.length <= 8) {
          setError('Votre mot de passe doit contenir un minimum de 9 caractères.');
          return;
    }

    if (!/[!@#$%&]/.test(newPassword)) {
        setError("Le mot de passe doit contenir au moins un caractère spécial (@, #, $, %, &).");
        return;
      }

    if (newPassword !== confirmPassword) {
      setError('Le champ du mot de passe et de la confirmation ne sont pas identique.');
      return;
    }

    alert('Votre nouveau mot de passe à été mis à jour avec succès!');

    // retourne à la page de connexion
    navigation.navigate('Connexions');
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.navigate("Connexions")}>
          <Text style={styles.buttonTextBack}> Annuler et revenir à connexion </Text>
      </TouchableOpacity>


      <Text style={styles.title}>Nouveau mot de passe</Text>

      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Entrez votre nouveau mot de passe"
        value={newPassword}
        onChangeText={(mdp) => {
            setNewMdp(mdp);
            setVerificationMdp(mdp);
          }}
          
      />

      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Confirmez votre mot de passe"
        value={confirmPassword}
        onChangeText={(mdp) => {
            setConfirmationMdp(mdp);
            setVerificationMdp(mdp);
          }}
      />

    {error ? <Text style={styles.errorText}>{error}</Text> : null}
      

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewMdp;

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
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
});
