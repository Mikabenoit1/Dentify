import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


type RootStackParamList = {
  Profil: undefined;
  NewMdp: undefined;
  Notification: undefined;
  Horaire: undefined;
  Fonctionnalite: undefined;
  Contact: undefined;

};

type ParametreScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profil'>;

const Parametre = () => {
  const navigation = useNavigation<ParametreScreenNavigationProp>();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const settingsSections = [
    {
      title: "Compte",
      items: [
        {
          icon: <MaterialIcons name="person-outline" size={24} color="#6a9174" />,
          title: "Profil professionnel",
          action: () => navigation.navigate('Profil')
        },
        {
          icon: <MaterialCommunityIcons name="shield-account-outline" size={24} color="#6a9174" />,
          title: "Mot de passe",
          action: () => navigation.navigate('NewMdp')
        }
      ]
    },
    {
      title: "Préférences",
      items: [
        {
          icon: <MaterialIcons name="notifications-none" size={24} color="#6a9174" />,
          title: "Notifications",
          action: () => navigation.navigate('Notification'),
          toggle: (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#767577", true: "#6a9174" }}
              thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
            />
          )
        },
        {
          icon: <MaterialCommunityIcons name="calendar-clock" size={24} color="#6a9174" />,
          title: "Horaires",
          action: () => navigation.navigate('Horaire')
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          icon: <MaterialIcons name="help-outline" size={24} color="#6a9174" />,
          title: "Fonctionnalités",
          action: () => navigation.navigate('Fonctionnalite')
        },
        {
          icon: <MaterialIcons name="email" size={24} color="#6a9174" />,
          title: "Contact",
          action: () => navigation.navigate('Contact')
        }
      ]
    }
    // La section "Actions" avec la déconnexion a été retirée
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {settingsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionItems}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={itemIndex} 
                  style={styles.item} 
                  onPress={item.action}
                >
                  <View style={styles.itemIcon}>{item.icon}</View>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <View style={styles.itemRight}>
                    {item.toggle || <MaterialIcons name="chevron-right" size={24} color="#95a5a6" />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
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
  content: {
    padding: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 10,
    paddingLeft: 10,
  },
  sectionItems: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  itemIcon: {
    marginRight: 15,
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Parametre;