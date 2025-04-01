import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import { Link } from "expo-router"; // Import ajouté

interface AccueilMoreProps {
  navigation: any; // Typage plus spécifique possible avec @react-navigation
}

export default function AccueilMore({ navigation }: AccueilMoreProps) {
  const [activePage, setActivePage] = useState("Accueil");

  const handleNavigation = (page: string): void => {
    setActivePage(page);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../assets/images/dentify_logo_noir.png")} style={styles.logo} />
        
        <View style={styles.rightIcons}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Recherche..." 
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.iconButton}>
            <AntDesign style={styles.iconText} name="message1" />
          </TouchableOpacity>
          <Link href="/Profil" asChild>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons style={styles.iconText} name="account-circle-outline" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Page content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 80 }} // Ajout pour éviter le chevauchement avec le footer
      >
        <Text style={styles.titleinfo}>À propos de l'application</Text>  
        <TouchableOpacity style={styles.buttoninfo}> 
          <Text style={styles.textinfo}>Nos professions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttoninfo}> 
          <Text style={styles.textinfo}>Nos services</Text> {/* Texte corrigé pour varier */}
        </TouchableOpacity>

        <Text style={styles.titleinfo}>À propos de nous</Text>  
        <TouchableOpacity style={styles.buttoninfo}> 
          <Text style={styles.textinfo}>Notre équipe</Text> {/* Texte corrigé */}
        </TouchableOpacity>
      </ScrollView>

      {/* Barre de navigation */}
      <View style={styles.footer}>
        <Link href="/Mesoffres" asChild>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => handleNavigation("Mesoffres")}
          >
            <AntDesign 
              style={[
                styles.iconText,
                activePage === "Mesoffres" && styles.activeButtonText
              ]} 
              name="calendar" 
            />
            <Text
              style={[
                styles.buttonText,
                activePage === "Mesoffres" && styles.activeButtonText,
              ]}
            >
              Mes offres
            </Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/CreationOffre" asChild>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => handleNavigation("CreationOffre")}
          >
            <Text
              style={[
                styles.buttonText,
                activePage === "CreationOffre" && styles.activeButtonText,
              ]}
            >
              Création d'une offre
            </Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/AccueilMore" asChild>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => handleNavigation("AccueilMore")}
          >
            <Text
              style={[
                styles.buttonText,
                activePage === "AccueilMore" && styles.activeButtonText,
              ]}
            >
              More
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fbf2e8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#6a9174",
  },
  logo: {
    width: 100,
    height: 50,
  },
  searchInput: {
    flex: 0.5,
    marginHorizontal: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    paddingVertical: 5,
    fontSize: 10,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right:10,
  },
  iconButton: {
    marginLeft: 10,
  },
  iconText: {
    fontSize: 30,
    color: "#ffffff",
  },
  titleinfo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  content: {
    width: '100%',
    marginTop: 10,
  },
  textinfo: {
    fontSize: 18,
  },
  buttoninfo: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#6a9174",
    paddingVertical: 30,
    borderTopWidth: 3,
    alignItems: "center",
    borderTopColor: "#ccc",
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
  },
  activeButtonText: {
    textDecorationLine: "underline",
  },
});
