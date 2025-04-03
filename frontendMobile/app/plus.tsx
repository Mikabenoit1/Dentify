import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Link } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccueilMore() {
  const [activePage, setActivePage] = useState("Accueil");

  const handleNavigation = (page: string): void => {
    setActivePage(page);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header dans le ScrollView pour qu'il défile */}
        <View style={styles.header}>
          <Link href="/" asChild> 
            <Image 
              source={require("../assets/images/dentify_logo_noir.png")} 
              style={styles.logo}
              resizeMode="contain"
            />
          </Link>
          
          <View style={styles.rightIcons}>
            <TextInput 
              style={styles.searchInput} 
              placeholder="Recherche..." 
              placeholderTextColor="#999"
            />
            <Link href="/messages" asChild>
              <TouchableOpacity style={styles.iconButton}>
                <AntDesign name="message1" size={24} color="white" />
              </TouchableOpacity>
            </Link>
            <Link href="/profil" asChild>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialCommunityIcons name="account-circle-outline" size={24} color="white" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Page content */}
        <View style={styles.content}>
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
        </View>
      </ScrollView>

      {/* Footer fixe */}
      <View style={styles.footer}>
                <Link href="/horaire" asChild>
                  <TouchableOpacity style={styles.footerButton}>
                    <AntDesign name="profile" size={24}  color={"white"}/>
                    <Text style={styles.footerText}>Mon horaire</Text>
                  </TouchableOpacity>
                </Link>
                    
                <Link href="/offre" asChild>
                  <TouchableOpacity style={styles.footerButton}>
                    <MaterialIcons name="work-outline" size={24} color={"white"}/>
                    <Text style={styles.footerText}>Mes Offres</Text>
                  </TouchableOpacity>
                </Link>
            
                <Link href="/calendrier" asChild>
                  <TouchableOpacity style={styles.footerButton}>
                    <AntDesign name="calendar" size={24} color={"white"} />
                    <Text style={styles.footerText}>Calendrier</Text>
                  </TouchableOpacity>
                </Link>
                    
                <Link href="/plus" asChild>
                  <TouchableOpacity style={styles.footerButton}>
                    <MaterialIcons name="more-horiz" size={24} color={"black"} />
                    <Text style={styles.footerTextClick}>Plus</Text>
                  </TouchableOpacity>
                </Link>
            </View>
          </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf2e8',
  },
  scrollView: {
    flex: 1,
    marginBottom: 80, // Pour laisser de la place au footer
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
  content: {
    padding: 15,
  },
  titleinfo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    color: '#2c3e50',
  },
  textinfo: {
    fontSize: 18,
    color: '#2c3e50',
  },
  buttoninfo: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#6a9174',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerButton: {
    alignItems: 'center',
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
});
