import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { AntDesign, Ionicons, MaterialCommunityIcons,MaterialIcons } from '@expo/vector-icons';
import { Link } from "expo-router";
import OffreStore from "../utils/OffreStore";

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
export interface Offre {
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
        <Image 
          source={require('../assets/images/dentify_logo_noir.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        <View style={styles.rightIcons}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Recherche..." 
            placeholderTextColor="#999"
          />
          <Link href="/messages" asChild>
            <TouchableOpacity style={styles.iconButton}>
              <AntDesign name="message1" style={styles.iconText} />
            </TouchableOpacity>
          </Link>
          <Link href="../profilClinique" asChild>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="account-circle-outline" style={styles.iconText} />
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

        <Link href="/creation-offre" asChild>
          <TouchableOpacity style={styles.addButton}>
            <AntDesign name="plus" size={24} color="white" />
            <Text style={styles.addButtonText}>Ajouter une offre</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Barre de tâche */}
      <View style={styles.footer}>
        <Link href="/mesoffres" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <AntDesign name="calendar" size={24} color="black"   />
            <Text style={styles.footerTextClick}>Offres publiés</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/creation-offre" asChild>
          <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="create-outline"  size={24} color="white" /> 
           <Text style={styles.footerText}> Création d'une offre</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/AccueilMore" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <MaterialIcons name="more-horiz" style={styles.footerIcon} />
            <Text style={styles.footerText}>Plus</Text>
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
