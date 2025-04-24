import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getHorairePro, annulerCandidature } from '../api/offreApi';
import moment from "moment";

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

export default function Calendrier({ navigation }) {
  const [offers, setOffers] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [markedDates, setMarkedDates] = useState({});
  const [appointmentsByDate, setAppointmentsByDate] = useState({});

  const loadData = async () => {
    try {
      const data = await getHorairePro();
      const grouped = {};
      const marked = {};
  
      data.forEach((candidature) => {
        const offre = candidature.Offre;
        if (!offre) return;
  
        const date = offre.heure_debut?.split("T")[0];
        if (!date) return;
  
        if (!grouped[date]) grouped[date] = [];
  
        const clinique = offre.CliniqueDentaire || {};
        const utilisateur = clinique.Utilisateur || {};
  
        grouped[date].push({
          id: offre.id_offre,
          time: `${moment(offre.heure_debut).format("HH:mm")} - ${moment(offre.heure_fin).format("HH:mm")}`,
          nom_clinique: clinique.nom_clinique || "Inconnu",
          adresse: clinique.adresse_complete || "Adresse inconnue",
          ville: utilisateur.ville || "Ville inconnue",
          procedure: offre.titre || "Sans titre",
          completed: new Date(date) < new Date(),
        });
  
        marked[date] = { marked: true, dotColor: '#6a9174' };
      });
  
      setOffers(data);
      setAppointmentsByDate(grouped);
      setMarkedDates(marked);
    } catch (error) {
      console.error("Erreur chargement calendrier:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async (id) => {
    try {
      await annulerCandidature(id);
      await loadData();
      Alert.alert("Candidature annulée");
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'annuler la candidature");
    }
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
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

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Calendrier</Text>
        <Calendar
          current={selectedDate}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              ...(markedDates[selectedDate] || {}),
              selected: true,
              selectedColor: '#6a9174',
              selectedTextColor: '#ffffff'
            }
          }}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          firstDay={1}
          theme={{
            selectedDayBackgroundColor: '#6a9174',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#6a9174',
            arrowColor: '#6a9174',
          }}
        />

        {selectedDate && appointmentsByDate[selectedDate] ? (
          <View style={styles.appointmentsContainer}>
            <Text style={styles.dateTitle}>{formatDisplayDate(selectedDate)}</Text>
            {appointmentsByDate[selectedDate].map((item) => (
              <View key={item.id} style={styles.appointmentCard}>
                <Text style={styles.appointmentTime}>{item.time}</Text>
                <Text style={styles.appointmentTitle}>{item.procedure}</Text>
                <Text style={styles.appointmentPatient}>{item.nom_clinique}</Text>
                <Text style={styles.appointmentPatient}>{item.adresse}</Text>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancel(item.id)}
                >
                  <AntDesign name="close" size={20} color="#ff6b6b" />
                  <Text style={styles.cancelText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="schedule" size={50} color="#6a9174" />
            <Text style={styles.emptyText}>
              {selectedDate === today
                ? "Aucun rendez-vous prévu aujourd'hui"
                : "Aucun rendez-vous pour cette date"}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Horaire')}>
          <AntDesign name="profile" size={24} color="white" />
          <Text style={styles.footerText}>Horaire</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Offre')}>
          <MaterialIcons name="work-outline" size={24} color="white" />
          <Text style={styles.footerText}>Offre</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Calendrier')}>
          <AntDesign name="calendar" size={24} color="black" />
          <Text style={styles.footerTextClick}>Calendrier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('AccueilMore')}>
          <MaterialIcons name="more-horiz" size={24} color="white" />
          <Text style={styles.footerText}>Plus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", backgroundColor: "#fbf2e8" },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#6a9174' },
  logo: { width: 100, height: 50, resizeMode: 'contain' },
  rightIcons: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 15 },
  content: { flex: 1, paddingBottom: 80 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 20, paddingHorizontal: 15 },
  appointmentsContainer: { marginTop: 20, paddingHorizontal: 15 },
  dateTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15, textTransform: 'capitalize' },
  appointmentCard: { backgroundColor: 'white', borderRadius: 8, padding: 15, marginBottom: 15, elevation: 2 },
  appointmentTime: { fontSize: 16, fontWeight: 'bold', color: '#6a9174', marginBottom: 5 },
  appointmentTitle: { fontSize: 16, color: '#2c3e50', marginBottom: 5 },
  appointmentPatient: { fontSize: 14, color: '#7f8c8d', marginBottom: 5 },
  cancelButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 8, borderWidth: 1, borderColor: '#ff6b6b', borderRadius: 6 },
  cancelText: { color: '#ff6b6b', marginLeft: 5, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, color: '#7f8c8d', marginTop: 10, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: '#6a9174', borderTopWidth: 1, borderTopColor: '#ccc' },
  footerButton: { alignItems: 'center', flex: 1 },
  footerText: { fontSize: 12, color: 'white', marginTop: 5 },
  footerTextClick: { fontSize: 12, color: 'black', marginTop: 5 },
});
