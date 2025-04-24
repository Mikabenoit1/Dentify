import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { AntDesign, MaterialCommunityIcons, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

export default function AccueilMoreCli({ navigation }) {
  const [activePage, setActivePage] = useState("AccueilMore");

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
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('NotificationClinique')}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('MessageListeScreen')}>
            <AntDesign name="message1" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("ProfilClinique")}>
            <MaterialCommunityIcons style={styles.iconText} name="account-circle-outline" />
          </TouchableOpacity>        
        </View>
      </View>

      {/* Contenu principal */}
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos de l'application</Text>

          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Fonctionnalite')}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <Ionicons name="information-circle-outline" size={24} color="#6a9174" />
                </View>
                <Text style={styles.menuItemText}>Fonctionnalités</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#95a5a6" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Professions')}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <MaterialCommunityIcons name="doctor" size={24} color="#6a9174" />
                </View>
                <Text style={styles.menuItemText}>Nos professions</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#95a5a6" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ParametreClinique')}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <Ionicons name="settings-outline" size={24} color="#6a9174" />
                </View>
                <Text style={styles.menuItemText}>Paramètres</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#95a5a6" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('NotificationClinique')}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <MaterialCommunityIcons name="bell-outline" size={24} color="#6a9174" />
                </View>
                <Text style={styles.menuItemText}>Notifications</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#95a5a6" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Contact')}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <Feather name="mail" size={24} color="#6a9174" />
                </View>
                <Text style={styles.menuItemText}>Nous contacter</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#95a5a6" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>COMPTE</Text>

          <View style={styles.sectionContent}>
            {/* L'option "Mon profil" a été retirée */}
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Connexions')}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <MaterialIcons name="logout" size={24} color="#e74c3c" />
                </View>
                <Text style={[styles.menuItemText, { color: '#e74c3c' }]}>Se déconnecter</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#95a5a6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Version de l'app */}
        <Text style={styles.versionText}>Dentify v1.0.0</Text>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Mesoffres')}>
          <AntDesign name="profile" size={24} color="white" />
          <Text style={styles.footerText}>Offres publiés</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('CreationOffre')}>
        <Ionicons name="create-outline" size={24} color="white" />
          <Text style={styles.footerText}>Création d'une offre</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('CalendrierCli')}>
          <AntDesign name="calendar" size={24} color="white" />
          <Text style={styles.footerText}>Calendrier</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('AccueilMoreCli')}>
          <MaterialIcons name="more-horiz" size={24} color="black" />
          <Text style={styles.footerTextClick}>Plus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    resizeMode: 'contain',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
  },
  iconText: {
    fontSize: 24,
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 20,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#6a9174',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerIcon: {
    fontSize: 24,
    color: 'white',
  },
  footerButton: {
    alignItems: 'center',
    flex: 1,
  },
  footerText: {
    fontSize: 12,
    color: 'white',
    marginTop: 5,
    textAlign: 'center',
  },
  footerTextClick: {
    fontSize: 12,
    color: 'black',
    marginTop: 5,
    textAlign: 'center',
  },
});