import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function AboutScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header mis à jour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>À propos</Text>
        <View style={styles.headerRight} />
      </View>

      
      <View style={styles.content}>
        <Image 
          source={require("../assets/vecteezy_ai-generated-manager-man-present-successful-group-business_39322995.png")} 
          style={styles.image}
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>À propos de Dentify</Text>
          <Text style={styles.description}>
            Dentify est votre partenaire dentaire innovant.
          </Text>
          <Text style={styles.description}>
            Notre application simplifie la gestion des cabinets dentaires pour les professionnels.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf2e8',
  },
  // Header seulement modifié
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#6a9174',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    width: 24,
  },
  // Tout le reste strictement identique à votre original
  content: {
    flex: 1,
    backgroundColor: '#fbf2e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '90%',
    height: 200,
    marginTop: 60,
  },
  textContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34607d',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6a9174',
    marginBottom: 10,
  },
});
