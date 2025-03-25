import React from 'react';
import { Image, StyleSheet, View, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Accueil() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Link href="/">
          <Image
            source={require('../assets/images/dentify_logo_noir.png')}
            style={{ width: 90, height: 50 }}
            resizeMode="contain"
          />
        </Link>
        <View style={styles.linksContainer}>
          <ThemedText variant="subtitle1">
            <Link href="/login">Connexion</Link>
          </ThemedText>
          <ThemedText variant="subtitle1">
            <Link href="/menu">Menu</Link>
          </ThemedText>
        </View>
      </View>

      <ScrollView style={styles.body}>
        {/* Section de bienvenue */}
        <View style={styles.welcomeSection}>
          <ThemedText variant="headline" style={styles.mainTitle}>
            Bienvenue sur Dentify
          </ThemedText>
          <ThemedText variant="body2" style={styles.welcomeText}>
            Dentify est la plateforme qui simplifie la gestion des remplacements et des missions pour les professionnels dentaires et les cliniques.
          </ThemedText>
        </View>

        {/* Section des fonctionnalités principales */}
        <View style={styles.featuresSection}>
          <ThemedText variant="headline" style={styles.sectionTitle}>
            Découvrez nos fonctionnalités
          </ThemedText>

          {/* Lien vers la page des fonctionnalités */}
          <View style={styles.featureLink}>
            <Icon name="chart-line" size={32} color="#6a9174" />
            <ThemedText variant="body2" style={styles.featureText}>
              <Link href="/fonctionnalite">Nos Fonctionnalités</Link>
            </ThemedText>
          </View>

          {/* Lien vers la page des professions */}
          <View style={styles.featureLink}>
            <Icon name="account-group" size={32} color="#6a9174" />
            <ThemedText variant="body2" style={styles.featureText}>
              <Link href="/profession">Nos Professions</Link>
            </ThemedText>
          </View>
        </View>

        {/* Section de contact */}
        <View style={styles.contactSection}>
          <ThemedText variant="headline" style={styles.sectionTitle}>
            Contactez-nous
          </ThemedText>
          <ThemedText variant="body2" style={styles.contactText}>
            Vous avez des questions ? N'hésitez pas à nous contacter.
          </ThemedText>
          <View style={styles.contactLink}>
            <Icon name="email" size={32} color="#6a9174" />
            <ThemedText variant="body2" style={styles.featureText}>
              <Link href="/contact">Contact</Link>
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mainTitle: {
    textAlign: 'center',
    color: '#6a9174',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  welcomeText: {
    textAlign: 'center',
    color: '#6a9174',
    paddingHorizontal: 16,
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    textAlign: 'center',
    color: '#6a9174',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureText: {
    marginLeft: 8,
    color: '#6a9174',
    fontWeight: 'bold',
  },
  contactSection: {
    marginBottom: 32,
  },
  contactText: {
    textAlign: 'center',
    color: '#6a9174',
    marginBottom: 16,
  },
  contactLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});