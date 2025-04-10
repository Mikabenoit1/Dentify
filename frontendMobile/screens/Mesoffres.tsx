
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import OffreStore from "../utils/OffreStore"; 

export default function Mesoffres({ navigation, route }) {
  const [activePage, setActivePage] = useState("Mesoffres");
  const [offres, setOffres] = useState<{ id: string; titre: string; profession: string; date: string; heureDebut: string; heureFin: string; description: string; exigences: string; remuneration: string; }[]>([]);


  // sert à mettre à jour les offres lorsque l'on revient sur la page 
  useEffect(() => {
    // pour refresh la liste des offres
    const refreshOffres = () => {
      setOffres(OffreStore.getOffres());
    };

    // donc ça refresh tout de suite
    refreshOffres();

    // l'écouteur, pour rafraichir à cahque fois qu'on revient sur la page
    const unsubscribe = navigation.addListener('focus', refreshOffres);
    
    
    return unsubscribe;
  }, [navigation]);

  // vérifie si nouvelle offre dans les params de route 
  useEffect(() => {
    if (route?.params?.newOffre) {
      // reset pour si nouvelle offre dans storeoffre
      setOffres(OffreStore.getOffres());
    }
  }, [route?.params?.newOffre]);

  const handleNavigation = (page) => {
    setActivePage(page);
    navigation.navigate(page);
  };




  const supprimerOffre = (id) => {
    OffreStore.supprimerOffre(id);
    setOffres(OffreStore.getOffres());
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../assets/dentify_logo_noir.png")} style={styles.logo} />
        
        <View style={styles.rightIcons}>
          <TextInput style={styles.searchInput} placeholder="Recherche..." placeholderTextColor="#999"/>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('MessageListeScreen')}>
            <AntDesign style={styles.iconText} name="message1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("ProfilCli")}>
            <MaterialCommunityIcons style={styles.iconText} name="account-circle-outline" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Page content */}
      <View style={styles.container2}>
        <Text style={styles.titleoffre}>Mes Offres</Text>

        <FlatList
          data={offres}
          keyExtractor={(item) => item.id || String(Math.random())}
          renderItem={({ item }) => (
            <View style={styles.offreCard}>
              <Text style={styles.offreTitle}>{item.titre}</Text>
              <Text>Profession : {item.profession}</Text>
              <Text>Date : {item.date}</Text>
              <Text>Heure de début : {item.heureDebut}</Text>
              <Text>Heure de fin : {item.heureFin}</Text>
              <Text>Description : {item.description}</Text>
              <Text>Exigences : {item.exigences}</Text>
              <Text>Salaire : {item.remuneration}</Text>

              <TouchableOpacity onPress={() => supprimerOffre(item.id)} style={styles.supprimeroffre}>
                <Text style={styles.supprimeroffreText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucune offre pour le moment.</Text>}
        />

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate("CreationOffre")}
        >
          <AntDesign name="plus" size={24} color="white" />
          <Text style={styles.addButtonText}>Ajouter une offre</Text>
        </TouchableOpacity>
      </View>

      {/* Barre de tâche */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleNavigation("Mesoffres")}
        >
          <AntDesign name="calendar" size={24} color="black"   />

          <Text
            style={[
              styles.footerTextClick,
              activePage === "Mesoffres" && styles.activeButtonText,
            ]}
          >
            Mes offres
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleNavigation("CreationOffre")}
        >
          <Ionicons style={styles.footerIcon} name="create-outline" /> 
          <Text
            style={[
              styles.footerText,
              activePage === "CreationOffre" && styles.activeButtonText,
            ]}
          >
            Création d'une offre
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleNavigation("AccueilMoreCli")}
        >
          <AntDesign style={styles.footerIcon} name="ellipsis1" />
          <Text
            style={[
              styles.footerText,
              activePage === "AccueilMore" && styles.activeButtonText,
            ]}
          >
            More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    width: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 8,
    backgroundColor: 'white',
    fontSize: 14,
    marginRight: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  iconText: {
    fontSize: 24,
    color: 'white',
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 200,
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
  footerIcon: {
    fontSize: 24,
    color: 'white',
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
  container2: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fbf2e8" 
  },
  titleoffre: { 
    fontSize: 24, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 20, 
    color: "#34607d",
  },
  offreCard: { 
    padding: 15, 
    marginVertical: 8, 
    backgroundColor: "#fff", 
    borderRadius: 8, 
    elevation: 2 
  },
  offreTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#34607d",
  },
  emptyText: { 
    textAlign: "center", 
    color: "#777", 
    marginTop: 20 
  },
  addButton: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "#6a9174", 
    padding: 15, 
    borderRadius: 8, 
    marginTop: 20 
  },
  addButtonText: { 
    color: "white", 
    fontSize: 18, 
    fontWeight: "bold", 
    marginLeft: 8 
  },
  supprimeroffre: {
    marginTop: 10,
    backgroundColor: "red",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  supprimeroffreText: {
    color: "white",
    fontWeight: "bold",
  },
  
});