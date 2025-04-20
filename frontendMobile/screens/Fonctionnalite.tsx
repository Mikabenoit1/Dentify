import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { ThemedText } from '../utils/ThemedText';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Fonctionnalite({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fonctionnalités</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.body}>
        <View style={styles.center}>
          <ThemedText variant="headline">
            Nos Fonctionnalités
          </ThemedText>
          <ThemedText variant="body2">
            Pour les Professionnels Dentaires
          </ThemedText>
        </View>

        <View style={styles.iconSection}>
          <View style={styles.iconWrapper}>
            <MaterialIcons name="calendar-today" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Gestion des disponibilités
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Planifiez vos disponibilités avec un calendrier intégré et postulez aux offres correspondantes.
            </ThemedText>
          </View>

          <View style={styles.iconWrapper}>
            <MaterialIcons name="message" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Messagerie intégrée
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Communiquez directement avec les cliniques pour discuter des détails des missions.
            </ThemedText>
          </View>

          <View style={styles.iconWrapper}>
            <MaterialIcons name="notifications" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Notifications intelligentes
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Recevez des alertes en temps réel pour les nouvelles offres et les rappels de mission.
            </ThemedText>
          </View>

          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="account-details" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Profil professionnel
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Mettez en avant vos compétences, certifications et expériences pour attirer les meilleures opportunités.
            </ThemedText>
          </View>
        </View>

        <View style={styles.center}>
          <ThemedText variant="body2">
            Pour les Cliniques Dentaires
          </ThemedText>
        </View>

        <View style={styles.iconSection}>
          <View style={styles.iconWrapper}>
            <MaterialIcons name="folder" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Gestion des offres de remplacement
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Créez, modifiez et suivez vos annonces de recrutement en toute simplicité.
            </ThemedText>
          </View>

          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="account-search" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Sélection des candidats
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Accédez aux profils détaillés des professionnels et sélectionnez le candidat idéal.
            </ThemedText>
          </View>

          <View style={styles.iconWrapper}>
            <MaterialIcons name="history" size={48} color="#6a9174" />
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
    width: 24,
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
