import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";

export default function AccueilMore({ navigation }) {
  const [activePage, setActivePage] = useState("Accueil");

  const handleNavigation = (page) => {
    setActivePage(page);
    navigation.navigate(page);
  };

  return (
   <View style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
           <Image source={require("../assets/dentify_logo_noir.png")} style={styles.logo} />
           
           <View style={styles.rightIcons}>
             <TextInput style={styles.searchInput} placeholder="Recherche..." placeholderTextColor="#999"/>
             <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('MessageListeScreen')}>
               <AntDesign style={styles.iconText} name="message1" />
             </TouchableOpacity>
             <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("ProfilCli")}>
               <MaterialCommunityIcons style={styles.iconText} name="account-circle-outline" />
             </TouchableOpacity>
           </View>
         </View>


      {/* Page content  */}
      <ScrollView style={styles.content}>

        <Text style={styles.titleinfo}> À propos de l'application </Text>  
        <TouchableOpacity style={styles.buttoninfo}> 
            <Text style={styles.textinfo}> Nos professions </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttoninfo}> 
            <Text style={styles.textinfo}> Nos professions </Text>
        </TouchableOpacity>


        <Text style={styles.titleinfo}> À propos de nous </Text>  
        <TouchableOpacity style={styles.buttoninfo}> 
            <Text style={styles.textinfo}> Nos professions </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttoninfo}> 
            <Text style={styles.textinfo}> Se déconnecter </Text>
        </TouchableOpacity>

      </ScrollView>


      {/* Barre de tâche */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleNavigation("Mesoffres")}
        >
          <AntDesign style={styles.footerIcon} name="calendar" />
          <Text
            style={[
              styles.footerText,
              activePage === "Mesoffres" && styles.activeButtonText,
            ]}
          >
            Mes offres
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleNavigation("CreationOffre")}>
          <Ionicons style={styles.footerIcon} name="create-outline" /> 
          <Text
            style={[
              styles.footerText,
              activePage === "CreationOffre" && styles.activeButtonText,
            ]}
          >
            Création d'une offre
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleNavigation("AccueilMore")}
        >
          <AntDesign name="ellipsis1"  size={24} color="black"/>
          <Text
            style={[
              styles.footerTextClick,
              activePage === "AccueilMore" && styles.activeButtonText,
            ]}
          >
            More
          </Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#6a9174',
  },
  logo: {
    width: 100,
    height: 50,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    width: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 8,
    backgroundColor: 'white',
    fontSize: 14,
    marginRight: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  iconText: {
    fontSize: 24,
    color: 'white',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#6a9174',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerButton: {
    alignItems: 'center',
    flex: 1,
  },
  footerIcon: {
    fontSize: 24,
    color: 'white',
  },
  footerText: {
    fontSize: 12,
    color: 'white',
    marginTop: 5,
  },
  footerTextClick: {
    fontSize: 12,
    color: 'black',
    marginTop: 5,
  },
  activeButtonText: {
    textDecorationLine: "underline",
  },
});
