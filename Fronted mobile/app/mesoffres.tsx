import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from '@react-navigation/native';
import OffreStore from "../components/OffreStore"; 

// Types pour les routes et navigation
interface RouteParams {
  newOffre?: any;
}

interface MesoffresProps {
  route: {
    params?: RouteParams;
  };
}

// Type pour les offres
interface Offre {
  id: string;
  titre: string;
  profession: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  description: string;
  exigences: string;
  remuneration: string;
}

export default function Mesoffres({ route }: MesoffresProps) {
  const [activePage, setActivePage] = useState<string>("Mesoffres");
  const [offres, setOffres] = useState<Offre[]>([]);

  // sert à mettre à jour les offres lorsque l'on monte le composant
  useEffect(() => {
    // pour refresh la liste des offres
    const refreshOffres = (): void => {
      setOffres(OffreStore.getOffres());
    };

    // refresh les offres au chargement du composant
    refreshOffres();
    
    // configurer un intervalle pour rafraîchir régulièrement les offres
    const intervalId = setInterval(refreshOffres, 1000); // rafraîchir chaque seconde
    
    // nettoyer l'intervalle quand le composant est démonté
    return () => clearInterval(intervalId);
  }, []);

  // vérifie si nouvelle offre dans les params de route 
  useEffect(() => {
    if (route?.params?.newOffre) {
      // reset pour si nouvelle offre dans storeoffre
      setOffres(OffreStore.getOffres());
    }
  }, [route?.params?.newOffre]);

  const handleNavigation = (page: string): void => {
    setActivePage(page);
  };

  const supprimerOffre = (id: string): void => {
    OffreStore.supprimerOffre(id);
    setOffres(OffreStore.getOffres());
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../assets/dentify_logo_noir.png")} style={styles.logo} />
        
        <View style={styles.rightIcons}>
          <TextInput style={styles.searchInput} placeholder="Recherche..." />
          <TouchableOpacity style={styles.iconButton}>
            <AntDesign style={styles.iconText} name="message1" />
          </TouchableOpacity>
          <Link href="/Profil" asChild>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons style={styles.iconText} name="account-circle-outline" />
            </TouchableOpacity>
          </Link>
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

        <Link href="/CreationOffre" asChild>
          <TouchableOpacity style={styles.addButton}>
            <AntDesign name="plus" size={24} color="white" />
            <Text style={styles.addButtonText}>Ajouter une offre</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Barre de tâche */}
      <View style={styles.footer}>
        <Link href="/Mesoffres" asChild>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigation("Mesoffres")}>
            <AntDesign style={styles.iconText} name="calendar" />
            <Text
              style={[
                styles.buttonText,
                activePage === "Mesoffres" && styles.activeButtonText,
              ]}
            >
              Mes offres
            </Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/CreationOffre" asChild>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigation("CreationOffre")}>
            <Ionicons style={styles.iconText} name="create-outline" />
            <Text
              style={[
                styles.buttonText,
                activePage === "CreationOffre" && styles.activeButtonText,
              ]}
            >
              Création d'une offre
            </Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/AccueilMore" asChild>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigation("AccueilMore")}>
            <AntDesign style={styles.iconText} name="ellipsis1" />
            <Text
              style={[
                styles.buttonText,
                activePage === "AccueilMore" && styles.activeButtonText,
              ]}
            >
              More
            </Text>
          </TouchableOpacity>
        </Link>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#6a9174",
  },
  logo: {
    width: 100,
    height: 50,
  },
  searchInput: {
    flex: 0.5,
    marginHorizontal: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    paddingVertical: 5,
    fontSize: 10,
    backgroundColor: "white",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  iconText: {
    fontSize: 30,
    color: "#ffffff",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 200,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#6a9174",
    paddingVertical: 30,
    borderTopWidth: 3,
    alignItems: "center",
    borderTopColor: "#ccc",
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
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
