import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../utils/AppContext';

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

const Calendrier = ({ navigation }) => {
  const { appointments, offers, cancelAppointment } = useAppContext();
  
  // Date actuelle fixe (3 avril 2025)
  const currentDate = '2025-04-03';
  const [selectedDate, setSelectedDate] = React.useState(currentDate);

  // Formatage de la date avec +1 jour pour l'affichage seulement
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  // Fusion des rendez-vous et offres acceptées
  const allAppointments = {
    ...appointments.reduce((acc, app) => {
      if (!acc[app.date]) acc[app.date] = [];
      acc[app.date].push({
        ...app,
        completed: app.date < currentDate,
        isOffer: false
      });
      return acc;
    }, {}),
    ...offers
      .filter(offer => offer.accepted)
      .reduce((acc, offer) => {
        if (!acc[offer.date]) acc[offer.date] = [];
        acc[offer.date].push({
          id: offer.id,
          time: offer.time,
          patient: offer.patient,
          procedure: offer.title,
          completed: offer.date < currentDate,
          isOffer: true
        });
        return acc;
      }, {})
  };

  // Marquage des dates
  const markedDates = {
    [currentDate]: {
      selected: true,
      selectedColor: '#6a9174',
      marked: false
    },
    ...Object.keys(allAppointments).reduce((acc, date) => {
      acc[date] = { 
        marked: true, 
        dotColor: date < currentDate ? '#f39c12' : '#6a9174'
      };
      return acc;
    }, {})
  };

  const handleReview = (appointmentId: number) => {
    navigation.navigate('ReviewScreen', { appointmentId });
  };

  const handleCancel = (appointmentId: number) => {
    cancelAppointment(appointmentId);
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
          style={styles.calendar}
          current={currentDate}
          markedDates={markedDates}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          firstDay={1}
          theme={{
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
            selectedDayBackgroundColor: '#6a9174',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#6a9174',
            arrowColor: '#6a9174',
          }}
        />

        {selectedDate && allAppointments[selectedDate] ? (
          <View style={styles.appointmentsContainer}>
            <Text style={styles.dateTitle}>
              {formatDisplayDate(selectedDate)}
            </Text>
            
            {allAppointments[selectedDate].map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <Text style={styles.appointmentTime}>{appointment.time}</Text>
                <Text style={styles.appointmentTitle}>{appointment.procedure}</Text>
                <Text style={styles.appointmentPatient}>
                  <MaterialCommunityIcons name="account" size={16} color="#7f8c8d" /> 
                  {appointment.patient}
                </Text>
                
                {appointment.completed ? (
                  <TouchableOpacity 
                    style={styles.reviewButton}
                    onPress={() => navigation.navigate('Review', { appointmentId: appointment.id })}	
                  >
                    <AntDesign name="star" size={20} color="#f39c12" />
                    <Text style={styles.reviewText}>Noter ce rendez-vous</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => handleCancel(appointment.id)}
                  >
                    <AntDesign name="close" size={20} color="#ff6b6b" />
                    <Text style={styles.cancelText}>Annuler</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="schedule" size={50} color="#6a9174" />
            <Text style={styles.emptyText}>
              {selectedDate === currentDate 
                ? "Aucun rendez-vous prévu aujourd'hui" 
                : "Aucun rendez-vous prévu pour cette date"}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
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
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
    marginBottom: 20,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  appointmentsContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
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
  appointmentTitle: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 5,
  },
  appointmentPatient: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 6,
    marginTop: 5,
  },
  cancelText: {
    color: '#ff6b6b',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#f39c12',
    borderRadius: 6,
    marginTop: 5,
  },
  reviewText: {
    color: '#f39c12',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 10,
    textAlign: 'center',
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

export default Calendrier;