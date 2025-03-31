import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Accueil = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header - Identique à l'original */}
      <View style={styles.header}>
        <Image 
          source={require('../assets/images/dentify_logo_noir.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        <View style={styles.rightIcons}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Recherche..." 
            placeholderTextColor="#999"
          />
          <Link href="/messages" asChild>
            <TouchableOpacity style={styles.iconButton}>
              <AntDesign name="message1" style={styles.iconText} />
            </TouchableOpacity>
          </Link>
          <Link href="/profil" asChild>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="account-circle-outline" style={styles.iconText} />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Contenu principal modifié */}
      <View style={styles.content}>
  <View style={styles.plusContainer}>
    <Link href="/profil" asChild>
      <TouchableOpacity style={styles.plusCircle}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
    </Link>
    <Text style={styles.plusLabel}>Veuillez ajouter vos documents</Text>
    <Text style={styles.plusSubLabel}>(ou compléter profil)</Text>
  </View>
</View>


      {/* Footer - Identique à l'original */}
      <View style={styles.footer}>
        <Link href="/horaire" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <AntDesign name="calendar" style={styles.footerIcon} />
            <Text style={styles.footerText}>Mon horaire</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/offre" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <MaterialIcons name="work-outline" style={styles.footerIcon} />
            <Text style={styles.footerText}>Mes Offres</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/plus" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <MaterialIcons name="more-horiz" style={styles.footerIcon} />
            <Text style={styles.footerText}>Plus</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf2e8',
  },
  // Styles du header (inchangés)
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
  
  // Styles pour le contenu central
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  plusContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%', // Prend toute la largeur
  },
  plusCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6a9174',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center', // Centre le cercle
  },
  plusText: {
    fontSize: 40,
    color: 'white',
    lineHeight: 40,
    marginTop: 10,
  },
  plusLabel: {
    fontSize: 18,
    color: '#34607d',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  plusSubLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  // Styles du footer (inchangés)
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
});

export default Accueil;