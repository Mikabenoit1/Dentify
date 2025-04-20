import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import OffreStore from '../utils/OffreStore';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Mesoffres: undefined;
  Review: { 
    offreId: string;
    professionnel: string;
    titre: string;
    onGoBack?: () => void;
  };
  ProfilClinique: undefined;
  NotificationClinique: undefined;
};

type NotificationType = {
  id: string;
  type: 'new_offer' | 'offer_ending' | 'offer_completed' | 'profile_reminder';
  title: string;
  message: string;
  date: string;
  read: boolean;
  relatedId?: string;
};

const notificationStorage = {
  data: [] as NotificationType[],
  save: function(notifs: NotificationType[]) {
    this.data = [...notifs];
  },
  load: function() {
    return [...this.data];
  },
  clear: function() {
    this.data = [];
  }
};

const NotificationClinique = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [offres, setOffres] = useState<any[]>([]);
  const [hasProfileNotification, setHasProfileNotification] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const storedOffres = OffreStore.getOffres();
      const savedNotifs = notificationStorage.load();
      
      const initialNotifs = [
        {
          id: 'fictive1',
          type: 'offer_completed',
          title: 'Quart terminé',
          message: 'Votre quart avec Dr. Dupont est terminé',
          date: new Date(Date.now() - 86400000).toISOString(),
          read: false,
          relatedId: 'fictive1'
        },
        {
          id: 'fictive2',
          type: 'offer_completed', 
          title: 'Quart terminé',
          message: 'Votre quart avec l\'hygiéniste Marie est terminé',
          date: new Date(Date.now() - 172800000).toISOString(),
          read: false,
          relatedId: 'fictive2'
        }
      ];
      
      const mergedNotifs = [
        ...initialNotifs,
        ...savedNotifs.filter((n: NotificationType) => !initialNotifs.some(init => init.id === n.id))
      ];
      
      setOffres(storedOffres);
      setNotifications(mergedNotifs);
      generateNotifications(storedOffres, mergedNotifs);
    };

    if (isFocused) loadData();
  }, [isFocused]);

  const generateNotifications = (offresList: any[], existingNotifs: NotificationType[]) => {
    const newNotifications = [...existingNotifs];
    const now = new Date();

    if (hasProfileNotification && !newNotifications.some(n => n.id === 'profile_reminder')) {
      newNotifications.unshift({
        id: 'profile_reminder',
        type: 'profile_reminder',
        title: 'Profil à compléter',
        message: 'Complétez votre profil pour être visible par les professionnels',
        date: new Date().toISOString(),
        read: false
      });
    }

    offresList.forEach(offre => {
      if (!offre || !offre.dateISO || !offre.heureFin) return;

      try {
        const offreDate = new Date(offre.dateISO);
        const diffInHours = Math.abs(now.getTime() - offreDate.getTime()) / (1000 * 60 * 60);
        
        if (diffInHours < 24 && !newNotifications.some(n => n.id === `new_${offre.id}`)) {
          newNotifications.unshift({
            id: `new_${offre.id}`,
            type: 'new_offer',
            title: 'Nouveau quart publié',
            message: `Vous avez publié un nouveau quart pour ${offre.profession || 'une profession'}`,
            date: new Date().toISOString(),
            read: false,
            relatedId: offre.id
          });
        }
        
        const heureFinParts = offre.heureFin.split(':');
        const finOffre = new Date(offre.dateISO);
        finOffre.setHours(parseInt(heureFinParts[0]) || 0);
        finOffre.setMinutes(parseInt(heureFinParts[1]) || 0);
        
        if (finOffre < now && !newNotifications.some(n => n.id === `completed_${offre.id}`)) {
          newNotifications.unshift({
            id: `completed_${offre.id}`,
            type: 'offer_completed',
            title: 'Quart terminé',
            message: `Le quart "${offre.titre || 'sans titre'}" est terminé`,
            date: finOffre.toISOString(),
            read: false,
            relatedId: offre.id
          });
        } 
        else if ((finOffre.getTime() - now.getTime()) < (2 * 60 * 60 * 1000) && 
                !newNotifications.some(n => n.id === `ending_${offre.id}`)) {
          newNotifications.unshift({
            id: `ending_${offre.id}`,
            type: 'offer_ending',
            title: 'Quart se termine bientôt',
            message: `Le quart "${offre.titre || 'sans titre'}" se termine à ${offre.heureFin}`,
            date: new Date().toISOString(),
            read: false,
            relatedId: offre.id
          });
        }
      } catch (error) {
        console.error('Erreur traitement offre:', error);
      }
    });

    notificationStorage.save(newNotifications);
    setNotifications(newNotifications);
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(notif => 
      notif.id === id ? {...notif, read: true} : notif
    );
    setNotifications(updated);
    notificationStorage.save(updated);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Confirmer",
      "Voulez-vous vraiment supprimer toutes les notifications ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          onPress: () => {
            notificationStorage.clear();
            setNotifications([]);
          }
        }
      ]
    );
  };

  const handleNotificationPress = (notification: NotificationType) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    switch(notification.type) {
      case 'offer_completed':
        navigation.navigate('Review', {
          offreId: notification.relatedId || '',
          professionnel: 'Professionnel',
          titre: 'Quart terminé',
          onGoBack: () => markAsRead(notification.id)
        });
        break;
      case 'profile_reminder':
        setHasProfileNotification(false);
        navigation.navigate('ProfilClinique');
        break;
      case 'new_offer':
        navigation.navigate('Mesoffres');
        break;
      default:
        break;
    }
  };

  const formatDate = (dateString: string) => {
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

  const getIcon = (type: string) => {
    switch(type) {
      case 'new_offer': 
        return <Ionicons name="add-circle-outline" size={24} color="#6a9174" />;
      case 'offer_ending': 
        return <MaterialCommunityIcons name="clock-alert-outline" size={24} color="#6a9174" />;
      case 'offer_completed': 
        return <MaterialCommunityIcons name="check-circle-outline" size={24} color="#6a9174" />;
      case 'profile_reminder': 
        return <MaterialCommunityIcons name="account-alert-outline" size={24} color="#6a9174" />;
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
        <Text style={styles.headerTitle}>Notifications Clinique</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={handleClearAll} 
            disabled={notifications.length === 0}
          >
            <AntDesign 
              name="delete" 
              size={22} 
              color={notifications.length === 0 ? "#aaa" : "white"} 
              style={styles.deleteIcon} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ProfilClinique')}>
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
          notifications.map(notification => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => handleNotificationPress(notification)}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadNotification
              ]}
            >
              <View style={styles.notificationIcon}>
                {getIcon(notification.type)}
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                {notification.type === 'offer_completed' && !notification.read && (
                  <Text style={styles.notificationAction}>Appuyez pour noter le professionnel</Text>
                )}
                {notification.type === 'profile_reminder' && !notification.read && (
                  <Text style={styles.notificationAction}>Appuyez pour compléter votre profil</Text>
                )}
                <Text style={styles.notificationDate}>
                  {formatDate(notification.date)}
                </Text>
              </View>
              {!notification.read && (
                <View style={styles.unreadIndicator}>
                  <View style={styles.unreadBadge} />
                </View>
              )}
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
  deleteIcon: {
    marginRight: 15,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
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
  unreadIndicator: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6a9174',
  },
});

export default NotificationClinique;
