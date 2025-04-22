import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, RefreshControl, Alert } from 'react-native';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOffresDisponibles, accepterOffre, getCandidaturesPro, annulerCandidature } from '../api/offreApi';
import moment from 'moment';

export default function Offre({ navigation }) {
  const [offers, setOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [candidatures, setCandidatures] = useState([]);
  const [hiddenOffers, setHiddenOffers] = useState([]);

  const fetchOffers = async () => {
    try {
      const [offresData, candidaturesData] = await Promise.all([
        getOffresDisponibles(),
        getCandidaturesPro()
      ]);

      const hidden = await AsyncStorage.getItem('hiddenOffers');
      const hiddenParsed = hidden ? JSON.parse(hidden) : [];

      setOffers(offresData);
      setCandidatures(candidaturesData);
      setHiddenOffers(hiddenParsed);
    } catch (error) {
      console.error('Erreur récupération offres/candidatures :', error);
    }
  };

  const acceptOffer = async (id_offre) => {
    try {
      await accepterOffre(id_offre);
      Alert.alert("Succès", "Offre acceptée avec succès !");
      fetchOffers();
    } catch (error) {
      console.error("Erreur acceptation :", error);
      Alert.alert("Erreur", error.message || "Impossible d'accepter l'offre");
    }
  };

  const cancelOffer = (id_offre) => {
    Alert.alert(
      "Confirmation",
      "Es-tu sûr de vouloir annuler ton acceptation de cette offre?",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui", onPress: async () => {
            try {
              await annulerCandidature(id_offre);
              Alert.alert("Annulation", "Votre acceptation a été annulée.");
              fetchOffers();
            } catch (error) {
              console.error("Erreur annulation :", error);
              Alert.alert("Erreur", error.message || "Impossible d'annuler l'acceptation");
            }
          }
        }
      ]
    );
  };

  const maskOffer = async (id_offre) => {
    const updated = [...hiddenOffers, id_offre];
    setHiddenOffers(updated);
    await AsyncStorage.setItem('hiddenOffers', JSON.stringify(updated));
  };

  const isOfferAccepted = (id_offre) => {
    return candidatures.some(
      (c) => c.id_offre === id_offre && c.statut === 'acceptee'
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOffers();
    setRefreshing(false);
  };

  const handleNavigation = (page) => {
    navigation.navigate(page);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../assets/dentify_logo_noir.png")} style={styles.logo} />
        <View style={styles.rightIcons}>
          <TextInput style={styles.searchInput} placeholder="Recherche..." value={searchQuery} onChangeText={setSearchQuery} />
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MessageListeScreen')}>
            <AntDesign name="message1" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
            <MaterialCommunityIcons name="account-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6a9174']} />}
      >
        <Text style={styles.mainTitle}>Offres disponibles</Text>

        {offers.length === 0 ? (
          <Text style={styles.emptyText}>Aucune offre disponible.</Text>
        ) : (
          offers.filter(offer => !hiddenOffers.includes(offer.id_offre)).map((offer) => {
            const accepted = isOfferAccepted(offer.id_offre);
            const isPassed = moment(offer.date_mission).isBefore(moment(), 'day') && moment(offer.heure_fin).isBefore(moment());

            return (
              <View key={offer.id_offre} style={[styles.offerCard, (isPassed && accepted) && styles.completedCard, (isPassed && !accepted) && styles.expiredCard]}>
                <Text style={styles.offerTitle}>{offer.titre}</Text>
                <Text style={styles.offerPrice}>{offer.remuneration} $ /h</Text>
                <Text style={styles.offerDetail}>Clinique : {offer.CliniqueDentaire?.nom_clinique || 'Inconnue'}</Text>
                <Text style={styles.offerDetail}>Adresse : {offer.adresse_complete}, {offer.CliniqueDentaire?.ville || ''}</Text>
                <Text style={styles.offerDetail}>Type recherché : {offer.type_professionnel}</Text>
                <Text style={styles.offerDetail}>Description : {offer.descript}</Text>
                <Text style={styles.offerDetail}>Date : {new Date(offer.date_mission).toLocaleDateString()}</Text>
                <Text style={styles.offerDetail}>Heure : {offer.heure_debut?.slice(11, 16)} à {offer.heure_fin?.slice(11, 16)}</Text>

                {accepted && !isPassed && (
                  <Text style={styles.acceptedText}>✔️ Offre déjà acceptée</Text>
                )}

                {accepted && isPassed && (
                  <Text style={styles.acceptedText}>✅ Offre complétée</Text>
                )}

                {!accepted && isPassed && (
                  <Text style={styles.acceptedText}>📅 Offre expirée</Text>
                )}

                {!isPassed && (
                  <TouchableOpacity
                    style={[styles.reserveButton, accepted && styles.acceptedButton]}
                    onPress={() => accepted ? cancelOffer(offer.id_offre) : acceptOffer(offer.id_offre)}
                  >
                    <Text style={styles.reserveButtonText}>
                      {accepted ? "Annuler l'acceptation" : "Accepter cette offre"}
                    </Text>
                  </TouchableOpacity>
                )}

                {isPassed && (
                  <TouchableOpacity
                    style={[styles.reserveButton, { backgroundColor: '#ccc' }]}
                    onPress={() => maskOffer(offer.id_offre)}
                  >
                    <Text style={styles.reserveButtonText}>Masquer</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => handleNavigation("Horaire")}>
          <AntDesign name="profile" size={24} color="black" />
          <Text style={styles.footerTextClick}>Horaire</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => handleNavigation("Offre")}>
          <MaterialIcons name="work-outline" size={24} color="white" />
          <Text style={styles.footerText}>Offre</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => handleNavigation("Calendrier")}>
          <AntDesign name="calendar" size={24} color="white" />
          <Text style={styles.footerText}>Calendrier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => handleNavigation("AccueilMore")}>
          <MaterialIcons name="more-horiz" size={24} color="white" />
          <Text style={styles.footerText}>Plus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbf2e8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#6a9174',
  },
  logo: { width: 100, height: 50 },
  rightIcons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchInput: {
    width: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 8,
    backgroundColor: 'white',
    fontSize: 14,
  },
  scrollContent: { padding: 15, paddingBottom: 100 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15 },
  offerCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  completedCard: { backgroundColor: '#e6e6e6' },
  expiredCard: { backgroundColor: '#f2f2f2' },
  offerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  offerPrice: { fontSize: 20, fontWeight: 'bold', color: '#6a9174', marginVertical: 5 },
  offerDetail: { fontSize: 14, color: '#34495e', marginVertical: 1 },
  reserveButton: {
    backgroundColor: '#6a9174',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  acceptedButton: { backgroundColor: '#4CAF50' },
  reserveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#7f8c8d', fontSize: 16 },
  acceptedText: { color: '#2c3e50', fontStyle: 'italic', marginTop: 5 },
  footer: {
    flexDirection: 'row', justifyContent: 'space-around',
    padding: 15, backgroundColor: '#6a9174',
    borderTopWidth: 1, borderTopColor: '#ccc',
  },
  footerButton: { alignItems: 'center', flex: 1 },
  footerText: { fontSize: 12, color: 'white', marginTop: 5 },
  footerTextClick: { fontSize: 12, color: 'black', marginTop: 5 },
});
