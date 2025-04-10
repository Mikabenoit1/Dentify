import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';



const Accueil = ({navigation}) => {
  

  return (
    <View style={styles.container}>
      {/* Header - Identique à l'original */}
      <View style={styles.header}>
        <Image 
          source={require('../assets/dentify_logo_noir.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        <View style={styles.rightIcons}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Recherche..." 
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('MessageListeScreen')}
          >
            <AntDesign name="message1" style={styles.iconText} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Profil')}
          >
            <MaterialCommunityIcons name="account-circle-outline" style={styles.iconText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenu principal modifié */}
      <View style={styles.content}>
        <View style={styles.plusContainer}>
          <TouchableOpacity 
            style={styles.plusCircle}
            onPress={() => navigation.navigate('Profil')}
          >
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.plusLabel}>Veuillez ajouter vos documents</Text>
          <Text style={styles.plusSubLabel}>(ou compléter profil)</Text>
        </View>
      </View>

      {/* Footer - Identique à l'original */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('Horaire')}
        >
          <AntDesign name="profile" style={styles.footerIcon} />
          <Text style={styles.footerText}>Mon horaire</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('Offre')}
        >
          <MaterialIcons name="work-outline" style={styles.footerIcon} />
          <Text style={styles.footerText}> Offres </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('Calendrier')}
        >
          <AntDesign name="calendar" style={styles.footerIcon} />
          <Text style={styles.footerText}>Calendrier</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('AccueilMore')}
        >
          <MaterialIcons name="more-horiz" style={styles.footerIcon} />
          <Text style={styles.footerText}>Plus</Text>
        </TouchableOpacity>
      </View>
    </View>
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