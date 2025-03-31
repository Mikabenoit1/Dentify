import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Animated } from 'react-native';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Horaire = () => {
 
  const appointments = [
    {
      id: 1,
      date: "Samedi 5 avril 2025",
      time: "09:00 - 10:30",
      patient: "Jean Dupont",
      procedure: "Détartrage complet"
    },
    {
      id: 2,
      date: "Mardi 8 avril 2025", 
      time: "14:00 - 15:00",
      patient: "Marie Martin",
      procedure: "Consultation dentaire"
    },
    {
      id: 3,
      date: "Jeudi 18 Mars 2024",
      time: "10:30 - 11:30",
      patient: "Mohamed Yasser",
      procedure: "Pose d'implant"
    }
  ];

  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
              contentContainerStyle={styles.scrollContainer} // Permet au contenu de s'étendre
              style={styles.scrollView} // Prend toute la hauteur disponible
            >
        {/* Header animé */}
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

        {/* Contenu principal */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Mon horaire</Text>
          
          {appointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <Text style={styles.appointmentDate}>{appointment.date}</Text>
              <View style={styles.timeContainer}>
                <Text style={styles.appointmentTime}>{appointment.time}</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.patientName}>{appointment.patient}</Text>
                <Text style={styles.procedure}>{appointment.procedure}</Text>
              </View>
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionText}>Confirmer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#ffecec'}]}>
                  <Text style={[styles.actionText, {color: '#ff6b6b'}]}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer fixe */}
      <View style={styles.footer}>
        <Link href="/horaire" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <AntDesign name="calendar" size={24} color="black" />
            <Text style={styles.footerTextClick}>Mon horaire</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/offre" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <MaterialIcons name="work-outline" size={24} color="white" />
            <Text style={styles.footerText}>Mes Offres</Text>
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
  iconText: {
    fontSize: 24,
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#fbf2e8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Pour le footer
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#6a9174',
    width: '100%',
  },
  content: {
    padding: 15,
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#34607d',
    marginBottom: 20,
  },
  appointmentCard: {
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
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34607d',
    marginBottom: 5,
  },
  timeContainer: {
    backgroundColor: '#e8f4ea',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  appointmentTime: {
    fontSize: 14,
    color: '#6a9174',
    fontWeight: '600',
  },
  detailsContainer: {
    marginBottom: 15,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  procedure: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#e8f4ea',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  actionText: {
    color: '#6a9174',
    fontWeight: 'bold',
    fontSize: 14,
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

export default Horaire;