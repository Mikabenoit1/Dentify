import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { ThemedText } from '../utils/ThemedText';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Professions({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Professions</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.body}>
        <View style={styles.titleContainer}>
          <ThemedText variant="headline">
            Nos Professions
          </ThemedText>
        </View>

        <View style={styles.iconSection}>
          {/* Dentistes */}
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="tooth-outline" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Dentistes
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Professionnels qualifiés pour les soins dentaires complets.
            </ThemedText>
          </View>

          {/* Hygiénistes Dentaires */}
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="toothbrush" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Hygiénistes Dentaires
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Spécialistes de l'hygiène et prévention dentaire.
            </ThemedText>
          </View>

          {/* Assistants Dentaires */}
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="medical-bag" size={48} color="#6a9174" />
            <ThemedText variant="body2" style={styles.iconText}>
              Assistants Dentaires
            </ThemedText>
            <ThemedText variant="body2" style={styles.descriptionText}>
              Soutien essentiel pour les soins dentaires quotidiens.
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
  titleContainer: {
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
