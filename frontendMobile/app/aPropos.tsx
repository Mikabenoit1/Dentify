import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../components/ThemedText";
import { Link } from "expo-router";


export default function aPropos() {
  return (
   <SafeAreaView style={styles.container}>
         {/* ScrollView pour permettre le défilement */}
         <ScrollView
           contentContainerStyle={styles.scrollContainer} // Permet au contenu de s'étendre
           style={styles.scrollView} // Prend toute la hauteur disponible
         >
           {/* Header avec fond vert */}
           <View style={styles.header}>
            <Link href="/">
             <Image
               source={require("../assets/images/dentify_logo_noir.png")}
               style={{ width: 90, height: 50 }}
               resizeMode="contain"
             />
             </Link>
             <View style={styles.linksContainer}>
               <ThemedText variant="subtitle1">
                 <Link href="/login">Connexion</Link>
               </ThemedText>
               <ThemedText variant="subtitle1">
                 <Link href="/menu">Menu</Link>
               </ThemedText>
             </View>
           </View>
      {/* Image (j'ai pris une au hasard) */}
      <View style={styles.body}>
      <Image 
        source={require("../assets/images/vecteezy_ai-generated-manager-man-present-successful-group-business_39322995.png")} 
        style={styles.image}
      />

      {/* Texte d'information sur nous */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>À propos</Text>
        <Text style={styles.description}>
          Text
        </Text>
        <Text style={styles.description}>
        Écrire ici : Texte nous décrivant et ce qui
         nous a poussé a choisir ce projet comme application
        </Text>
      </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    linksContainer: {
        flexDirection: "row",
        gap: 16,
      },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        backgroundColor: "#6a9174",
      },
      body: {

        backgroundColor: "#fbf2e8",
        flex: 1,
      },
    scrollView: {
        flex: 1, 
      },
      scrollContainer: {
        flexGrow: 1, 
      },
      container: {
        flex: 1,
      },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#34607d',
    padding: 10,
    borderRadius: 10,
    zIndex: 10,
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
