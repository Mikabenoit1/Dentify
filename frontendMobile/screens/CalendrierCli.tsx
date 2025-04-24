import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { AntDesign, MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getCalendrierClinique } from '../api/offreApi';
import moment from "moment";


LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

export default function CalendrierCli({ navigation }) {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [appointmentsByDate, setAppointmentsByDate] = useState({});
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCalendrierClinique();
        const grouped = {};
        const marked = {};

        data.forEach((item) => {
          const offre = item.Offre;
          const pro = item.ProfessionnelDentaire;
          const user = pro?.Utilisateur;

          const date = offre.heure_debut?.split("T")[0];
          if (!date) return;

          if (!grouped[date]) grouped[date] = [];

          grouped[date].push({
            id: offre.id_offre,
            titre: offre.titre,
            heure: `${moment(offre.heure_debut).format("HH:mm")} - ${moment(offre.heure_fin).format("HH:mm")}`,
            nomPro: user ? `${user.prenom} ${user.nom}` : "Inconnu",
            typePro: pro?.type_profession || "Inconnu"
          });

          marked[date] = { marked: true, dotColor: '#6a9174' };
        });

        setAppointmentsByDate(grouped);
        setMarkedDates(marked);
      } catch (err) {
        console.error("Erreur calendrier clinique :", err);
      }
    };

    loadData();
  }, []);

  const formatDisplayDate = (isoDateString) => {
    const parts = isoDateString.split("-");
    const date = new Date(parts[0], parts[1] - 1, parts[2]); // mois = index 0
    return date.toLocaleDateString("fr-FR", {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={require("../assets/dentify_logo_noir.png")} style={styles.logo} />
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('NotificationClinique')}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('MessageListeScreen')}>
            <AntDesign name="message1" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('ProfilClinique')}>
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
            {appointmentsByDate[selectedDate].map((app, index) => (
              <View key={index} style={styles.appointmentCard}>
                <Text style={styles.appointmentTime}>{app.heure}</Text>
                <Text style={styles.appointmentTitle}>{app.titre}</Text>
                <Text style={styles.appointmentPatient}>{app.nomPro}</Text>
                <Text style={styles.appointmentPatient}>{app.typePro}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="schedule" size={50} color="#6a9174" />
            <Text style={styles.emptyText}>
              {selectedDate === today
                ? "Aucun rendez-vous prévu aujourd'hui"
                : "Aucun rendez-vous prévu pour cette date"}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Mesoffres')}>
          <AntDesign name="profile" size={24} color="white" />
          <Text style={styles.footerText}>Offres publiées</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('CreationOffre')}>
          <Ionicons name="create-outline" size={24} color="white" />
          <Text style={styles.footerText}>Créer une offre</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('CalendrierCli')}>
          <AntDesign name="calendar" size={24} color="black" />
          <Text style={styles.footerTextClick}>Calendrier</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('AccueilMoreCli')}>
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
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, color: '#7f8c8d', marginTop: 10, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: '#6a9174', borderTopWidth: 1, borderTopColor: '#ccc' },
  footerButton: { alignItems: 'center', flex: 1 },
  footerText: { fontSize: 12, color: 'white', marginTop: 5 },
  footerTextClick: { fontSize: 12, color: 'black', marginTop: 5 },
});
