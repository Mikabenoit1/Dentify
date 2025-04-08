import React from 'react';
import { Image, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';

import { ThemedText } from '../utils/ThemedText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';


export default function Fonctionnalite({navigation}) {
  
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Indexx')}>
          <Image
            source={require('../assets/dentify_logo_noir.png')}
            style={{ width: 90, height: 50 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.linksContainer}>
          <ThemedText variant="subtitle1">
            <TouchableOpacity onPress={() => navigation.navigate('Connexions')}>
              <ThemedText>Connexion</ThemedText>
            </TouchableOpacity>
          </ThemedText>
          <ThemedText variant="subtitle1">
            <TouchableOpacity onPress={() => navigation.navigate('menu')}>
              <ThemedText>Menu</ThemedText>
            </TouchableOpacity>
          </ThemedText>
        </View>
      </View>

      <ScrollView style={styles.body}>
        <View style={styles.center}>
        <ThemedText variant="headline">
          Nos Fonctionnalités
        </ThemedText>
        <ThemedText variant="caption"/>
        <ThemedText variant="body2">
          Pour les Professionnels Dentaires
        </ThemedText>
        </View>

        {/* Section pour les professionnels dentaires */}
        <View style={styles.iconSection}>
          <View style={styles.iconWrapper}>
            <Entypo name="calendar" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Gestion des disponibilités
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Planifiez vos disponibilités avec un calendrier intégré et postulez aux offres correspondantes.
            </ThemedText>
          </View>

          <View style={styles.iconWrapper}>
            <Entypo name="message" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Messagerie intégrée
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Communiquez directement avec les cliniques pour discuter des détails des missions.
            </ThemedText>
          </View>

          <View style={styles.iconWrapper}>
            <Entypo name="bell" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Notifications intelligentes
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Recevez des alertes en temps réel pour les nouvelles offres et les rappels de mission.
            </ThemedText>
          </View>

          <View style={styles.iconWrapper}>
            <Entypo name="text-document" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Profil professionnel
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Mettez en avant vos compétences, certifications et expériences pour attirer les meilleures opportunités.
            </ThemedText>
          </View>
        </View>

        {/* Section pour les cliniques dentaires */}
        <View style={styles.center}>
        <ThemedText variant="body2">
          Pour les Cliniques Dentaires
        </ThemedText>
        </View>

        <View style={styles.iconSection}>
          <View style={styles.iconWrapper}>
            <Entypo name="folder" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Gestion des offres de remplacement
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Créez, modifiez et suivez vos annonces de recrutement en toute simplicité.
            </ThemedText>
          </View>

          <View style={styles.iconWrapper}>
            <Icon name="account-search" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Sélection des candidats
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Accédez aux profils détaillés des professionnels et sélectionnez le candidat idéal.
            </ThemedText>
          </View>

          <View style={styles.iconWrapper}>
            <Icon name="history" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Historique et évaluation
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Consultez les missions passées et notez les candidats pour optimiser vos recrutements futurs.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf2e8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#6a9174',
  },
  linksContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  body: {
    flex: 1,
    padding: 16,
    
  },

  center: {
    alignItems: 'center',
    marginBottom: 24,
  },
 

  iconSection: {
    marginBottom: 24,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#6a9174',
    fontWeight: 'bold',
  },
  descriptionText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#6a9174',
    paddingHorizontal: 16,
  },
 
});