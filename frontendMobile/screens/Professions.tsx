import React from 'react';
import { Image, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '../utils/ThemedText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function Professions({navigation}) {
  
  
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
        {/* Titre et sous-titre centrés */}
        <View style={styles.titleContainer}>
          <ThemedText variant="headline">
            Nos Professions
          </ThemedText>
        </View>
        {/* Section pour les professions */}
        <View style={styles.iconSection}>
          {/* Dentistes */}
          <View style={styles.iconWrapper}>
            <Icon name="tooth" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Dentistes
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Des professionnels qualifiés pour vos soins dentaires.
            </ThemedText>
          </View>
          {/* Hygiénistes Dentaires */}
          <View style={styles.iconWrapper}>
            <Icon name="toothbrush" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Hygiénistes Dentaires
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Spécialistes de l'hygiène et de la prévention dentaire.
            </ThemedText>
          </View>
          {/* Assistants Dentaires */}
          <View style={styles.iconWrapper}>
            <Icon name="medical-bag" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Assistants Dentaires
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Soutien essentiel pour les soins dentaires au quotidien.
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
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mainTitle: {
    textAlign: 'center',
    color: '#6a9174',
    fontWeight: 'bold',
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