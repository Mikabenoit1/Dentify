import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, RefreshControl } from 'react-native';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../utils/AppContext';

const Offre = ({ navigation }) => {
  const { offers, acceptOffer, reloadOffers } = useAppContext();
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [visibleOffers, setVisibleOffers] = React.useState(3);
  const [activePage, setActivePage] = React.useState("Offre");

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.clinic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await reloadOffers();
    setRefreshing(false);
  };

  const loadMoreOffers = () => {
    setVisibleOffers(prev => prev + 3);
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    navigation.navigate(page);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
  <Image source={require("../assets/dentify_logo_noir.png")} style={styles.logo} />
  
  <View style={styles.rightIcons}>
    <TextInput 
      style={styles.searchInput} 
      placeholder="Recherche..." 
      placeholderTextColor="#999"
      value={searchQuery}
      onChangeText={setSearchQuery}
    />
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6a9174']}
            tintColor="#6a9174"
          />
        }
      >
        <Text style={styles.mainTitle}>Offres disponibles</Text>
        
        {filteredOffers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={50} color="#6a9174" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Aucun résultat trouvé' : 'Aucune offre disponible'}
            </Text>
            <TouchableOpacity 
              style={styles.reloadButton}
              onPress={onRefresh}
            >
              <AntDesign name="reload1" size={20} color="#6a9174" />
              <Text style={styles.reloadText}>Recharger les offres</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>Toutes</Text>
              <Text style={[styles.subtitle, styles.activeSubtitle]}>• Proches</Text>
            </View>

            {filteredOffers.slice(0, visibleOffers).map((offer) => (
              <View key={offer.id} style={styles.offerCard}>
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <Text style={styles.offerPrice}>{offer.price}</Text>
                
                <View style={styles.clinicInfo}>
                  <Text style={styles.clinicName}>{offer.clinic}</Text>
                  <View style={styles.ratingContainer}>
                    <AntDesign name="star" size={16} color="#f39c12" />
                    <Text style={styles.ratingText}>{offer.rating}</Text>
                  </View>
                </View>
                
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="access-time" size={16} color="#7f8c8d" />
                    <Text style={styles.detailText}>{offer.duration}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="map-marker-distance" size={16} color="#7f8c8d" />
                    <Text style={styles.detailText}>{offer.distance}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={[
                    styles.reserveButton, 
                    offer.accepted && styles.acceptedButton
                  ]} 
                  onPress={() => acceptOffer(offer.id)}
                  disabled={offer.accepted}
                >
                  <Text style={styles.reserveButtonText}>
                    {offer.accepted ? (
                      <>
                        <AntDesign name="checkcircle" size={16} color="white" /> Accepté
                      </>
                    ) : (
                      'Accepter cette offre'
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            {visibleOffers < filteredOffers.length && (
              <TouchableOpacity 
                style={styles.discoverButton}
                onPress={loadMoreOffers}
              >
                <Text style={styles.discoverText}>Voir plus d'offres</Text>
                <AntDesign name="arrowright" size={16} color="#3498db" />
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleNavigation("Horaire")}
        >
          <AntDesign name="profile" size={24} color="white" />
          <Text
            style={[
              styles.footerText,
              activePage === "Horaire" && styles.activeButtonText,
            ]}
          >
            Horaire
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleNavigation("Offre")}
        >
          <MaterialIcons name="work-outline" size={24} color="black" />
          <Text
            style={[
              styles.footerTextClick,
              activePage === "Offre" && styles.activeButtonText,
            ]}
          >
            Offre
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleNavigation("Calendrier")}
        >
          <AntDesign name="calendar" size={24} color="white" />
          <Text
            style={[
              styles.footerText,
              activePage === "Calendrier" && styles.activeButtonText,
            ]}
          >
            Calendrier
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleNavigation("AccueilMore")}
        >
          <MaterialIcons name="more-horiz" size={24} color="white" />
          <Text
            style={[
              styles.footerText,
              activePage === "AccueilMore" && styles.activeButtonText,
            ]}
          >
            Plus
          </Text>
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
    gap: 15,
  },
  searchInput: {
    width: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 8,
    backgroundColor: 'white',
    fontSize: 14,
  },
  iconButton: {
    marginLeft: 15,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 100,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  subtitleContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginRight: 15,
  },
  activeSubtitle: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
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
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  offerPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 8,
  },
  clinicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498db',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#f39c12',
    marginLeft: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 5,
  },
  reserveButton: {
    backgroundColor: '#6a9174',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  acceptedButton: {
    backgroundColor: '#4CAF50',
  },
  reserveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  discoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
  },
  discoverText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: 'bold',
    marginRight: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#2c3e50',
    marginTop: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#6a9174',
    borderRadius: 20,
  },
  reloadText: {
    marginLeft: 5,
    color: '#6a9174',
    fontWeight: 'bold',
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
  activeButtonText: {
    textDecorationLine: "underline",
  },
});

export default Offre;