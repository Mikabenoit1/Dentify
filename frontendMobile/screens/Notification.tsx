import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext, type NotificationType } from '../utils/AppContext';

const Notification = ({ navigation }) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications,
    appointments
  } = useAppContext();

  const handleNotificationPress = (notification: NotificationType) => {
    markNotificationAsRead(notification.id);
    
    if (notification.type === 'appointment' && notification.relatedId) {
      const appointment = appointments.find(a => a.id === notification.relatedId);
      const isPastAppointment = appointment && new Date(appointment.date) < new Date();
      
      if (isPastAppointment) {
        navigation.navigate('Review', { 
          appointmentId: notification.relatedId,
          patientName: appointment.patient,
          procedure: appointment.procedure
        });
      }
    } else if (notification.type === 'offer') {
      navigation.navigate('Offres');
    }
  };

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  const isPastAppointment = (notification: NotificationType) => {
    if (notification.type !== 'appointment' || !notification.relatedId) return false;
    const appointment = appointments.find(a => a.id === notification.relatedId);
    return appointment && new Date(appointment.date) < new Date();
  };

  const getNotificationIcon = (type?: string) => {
    switch(type) {
      case 'offer':
        return <MaterialCommunityIcons name="tag-outline" size={24} color="#6a9174" />;
      case 'appointment':
        return <MaterialCommunityIcons name="calendar-clock" size={24} color="#6a9174" />;
      default:
        return <MaterialCommunityIcons name="bell-outline" size={24} color="#6a9174" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={clearAllNotifications}
            disabled={notifications.length === 0}
          >
        <AntDesign name="delete" size={22} color="white" paddingRight ={10} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
            <MaterialCommunityIcons name="account-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="bell-off-outline" size={50} color="#6a9174" />
            <Text style={styles.emptyText}>Aucune notification</Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity 
              key={notification.id} 
              onPress={() => handleNotificationPress(notification)}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadNotification
              ]}
            >
              <View style={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                {isPastAppointment(notification) && !notification.read && (
                  <Text style={styles.notificationAction}>Appuyez pour noter ce quart</Text>
                )}
                <Text style={styles.notificationDate}>
                  {formatNotificationDate(notification.date)}
                </Text>
              </View>
              {!notification.read && <View style={styles.unreadBadge} />}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf2e8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#6a9174',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearText: {
    color: 'white',
    marginRight: 15,
    fontWeight: 'bold',
  },
  disabledText: {
    opacity: 0.5,
  },
  content: {
    padding: 15,
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
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#6a9174',
  },
  notificationIcon: {
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  notificationAction: {
    fontSize: 12,
    color: '#6a9174',
    fontStyle: 'italic',
    marginTop: 3
  },
  notificationDate: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6a9174',
    marginLeft: 10,
  },
});

export default Notification;