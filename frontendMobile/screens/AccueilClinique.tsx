import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { AntDesign, MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';

const AccueilClinique = ({navigation}) => {
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
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('NotificationClinique')}>
                        <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
                  </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('MessageListeScreen')}
          >
            <AntDesign name="message1" style={styles.iconText} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('ProfilClinique')}
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
            onPress={() => navigation.navigate('ProfilClinique')}
          >
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.plusLabel}>Veuillez ajouter vos documents</Text>
          <Text style={styles.plusSubLabel}>(ou compléter profil)</Text>
        </View>
      </View>

      {/* Footer - Modifié avec 4ème icône */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('Mesoffres')}
        >
          <AntDesign name="profile" size={24} color="white" />
          <Text style={styles.footerText}>Offres publiés</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('CreationOffre')}
        >
          <Ionicons name="create-outline" style={styles.footerIcon} />
          <Text style={styles.footerText}>Création d'une offre</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('CalendrierCli')}
        >
          <AntDesign name="calendar" style={styles.footerIcon} />
          <Text style={styles.footerText}>Calendrier</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('AccueilMoreCli')}
        >
          <MaterialIcons name="more-horiz" size={24} color="white" />
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
  // Styles du header 
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
    width: '100%', 
  },
  plusCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6a9174',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center', 
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

  // Styles du footer modifié
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
    fontSize: 24, // Taille légèrement réduite
    color: 'white',
  },
  footerText: {
    fontSize: 12,
    color: 'white',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default AccueilClinique;
