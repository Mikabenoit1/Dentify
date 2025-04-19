import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/fr'; // pour avoir les dates en français
import { getHorairePro, annulerCandidature } from '../api/offreApi';

const Horaire = ({ navigation }) => {
  const [activePage, setActivePage] = useState("Horaire");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getHorairePro();
      setAppointments(data);
    } catch (error) {
      console.error("Erreur horaire :", error);
      Alert.alert("Erreur", "Impossible de charger votre horaire.");
    }
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    navigation.navigate(page);
  };

  const handleAnnulation = async (id_offre) => {
    try {
      await annulerCandidature(id_offre);
      Alert.alert("Candidature annulée", "Vous avez annulé votre présence.");
      fetchAppointments(); // recharge après suppression
    } catch (error) {
      console.error("Erreur annulation :", error);
      Alert.alert("Erreur", "Impossible d'annuler la candidature.");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={require("../assets/dentify_logo_noir.png")} style={styles.logo} />
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notification')}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('MessageListeScreen')}>
            <AntDesign name="message1" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Profil')}>
            <MaterialCommunityIcons name="account-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENU */}
      <ScrollView style={styles.content}>
        <Text style={styles.mainTitle}>Mon Horaire</Text>

        {appointments.length === 0 ? (
          <Text>Aucun rendez-vous à venir.</Text>
        ) : (
          appointments.map((appointment) => (
            <View key={appointment.id_candidature} style={styles.appointmentContainer}>
              <Text style={styles.appointmentDate}>
                {moment(appointment.Offre.date_mission).locale("fr").format("dddd D MMMM")}
              </Text>
              <View style={styles.appointmentCard}>
                <Text style={styles.appointmentTime}>
                  {moment(appointment.Offre.heure_debut, "HH:mm:ss").format("HH:mm")}
                </Text>
                <Text style={styles.patientName}>
                  {appointment.Offre.CliniqueDentaire?.User?.prenom || "Clinique"}
                </Text>
                <Text style={styles.procedure}>
                  {appointment.Offre.titre}
                </Text>

                <TouchableOpacity
                  onPress={() => handleAnnulation(appointment.Offre.id_offre)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => handleNavigation("Horaire")}>
          <AntDesign name="profile" size={24} color="black" />
          <Text style={styles.footerTextClick}>Horaire</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => handleNavigation("Offre")}>
          <MaterialIcons name="work-outline" size={24} color="white" />
          <Text style={styles.footerText}>Offre</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => handleNavigation("Calendrier")}>
          <AntDesign name="calendar" size={24} color="white" />
          <Text style={styles.footerText}>Calendrier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => handleNavigation("AccueilMore")}>
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
  content: {
    flex: 1,
    padding: 15,
    paddingBottom: 80,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  appointmentContainer: {
    marginBottom: 20,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a9174',
    marginBottom: 5,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 3,
  },
  procedure: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#c0392b",
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
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
