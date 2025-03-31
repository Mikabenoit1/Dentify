import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Offre = () => {
  const offers = [
    {
      id: 1,
      title: "Détartrage complet",
      price: "135$",
      clinic: "Avenue Sourire",
      duration: "45 min",
      rating: "4.8",
      distance: "1.2 km"
    },
    {
      id: 2,
      title: "Blanchiment dentaire",
      price: "250$",
      clinic: "hellodent",
      duration: "1h30",
      rating: "4.6",
      distance: "2.5 km"
    },
    {
      id: 3,
      title: "Consultation d'urgence",
      price: "76$",
      clinic: "Urgences Dentaires Montréal",
      duration: "30 min",
      rating: "4.2",
      distance: "0.8 km"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header dans le ScrollView pour qu'il défile */}
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

        {/* Contenu principal */}
        <View style={styles.content}>
          <Text style={styles.mainTitle}>Offres disponibles</Text>
          
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Toutes</Text>
            <Text style={[styles.subtitle, styles.activeSubtitle]}>• Proches</Text>
          </View>

          {offers.map((offer) => (
            <View key={offer.id} style={styles.offerCard}>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerPrice}>{offer.price}</Text>
              
              <Text style={styles.clinicName}>{offer.clinic}</Text>
              
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>{offer.duration}</Text>
                <Text style={styles.ratingText}>{offer.rating}</Text>
                <Text style={styles.distanceText}>{offer.distance}</Text>
              </View>

              {/* Bouton Réserver ajouté ici */}
              <TouchableOpacity style={styles.reserveButton}>
                <Text style={styles.reserveButtonText}>Réserver</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.discoverButton}>
            <Text style={styles.discoverText}>Découvrir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer fixe */}
      <View style={styles.footer}>
        <Link href="/horaire" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <AntDesign name="calendar" size={24} color="white" />
            <Text style={styles.footerText}>Mon horaire</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/offre" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <MaterialIcons name="work-outline" size={24} color="black" />
            <Text style={styles.footerTextClick}>Mes Offres</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/plus" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <MaterialIcons name="more-horiz" size={24} color="white" />
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
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitleContainer: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginRight: 10,
  },
  activeSubtitle: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  offerCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  offerPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 10,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  ratingText: {
    fontSize: 14,
    color: '#f39c12',
  },
  distanceText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  // Styles pour le bouton Réserver
  reserveButton: {
    backgroundColor: '#6a9174',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  reserveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  discoverButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  discoverText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: 'bold',
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

export default Offre;