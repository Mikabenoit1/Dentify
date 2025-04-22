
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  TextInput
} from "react-native";
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import moment from "moment";

import {
  getMesOffres,
  supprimerOffre,
  archiverOffre,
  refuserCandidature
} from "../api/offreApi";

export default function Mesoffres({ navigation }) {
  const [activePage, setActivePage] = useState("Mesoffres");
  const [offres, setOffres] = useState([]);

  const fetchOffres = async () => {
    try {
      const data = await getMesOffres();
      setOffres(data);
    } catch (error) {
      console.error("Erreur chargement offres :", error);
      Alert.alert("Erreur", "Impossible de charger les offres");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOffres();
    }, [])
  );

  const handleNavigation = (page) => {
    setActivePage(page);
    navigation.navigate(page);
  };

  const handleSupprimer = async (id) => {
    try {
      await supprimerOffre(id);
      fetchOffres();
    } catch {
      Alert.alert("Erreur", "Échec de la suppression.");
    }
  };

  const handleMasquer = async (id) => {
    try {
      await archiverOffre(id);
      fetchOffres();
    } catch {
      Alert.alert("Erreur", "Échec du masquage.");
    }
  };

  // === NOUVEAU HANDLER ===
  const handleRefuser = async (idCandidature) => {
    try {
      await refuserCandidature(idCandidature);
      Alert.alert("Succès", "Candidature refusée.");
      fetchOffres();
    } catch (err) {
      console.error("Erreur refus candidature :", err);
      Alert.alert("Erreur", err.message || "Échec du refus");
    }
  };

  const renderOffre = ({ item }) => {
    const isPasse =
      moment(item.date_mission).isBefore(moment(), "day") &&
      moment(item.heure_fin).isBefore(moment());
  
    const confirmerSuppression = () => {
      Alert.alert(
        "Confirmation",
        "Voulez-vous vraiment supprimer cette offre ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: () => handleSupprimer(item.id_offre),
          },
        ]
      );
    };
  
    const confirmerMasquage = () => {
      Alert.alert(
        "Masquer l'offre",
        "Cette offre sera masquée de votre liste. Continuer ?",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Masquer", onPress: () => handleMasquer(item.id_offre) },
        ]
      );
    };
  
    // 🔥 ICI : corriger le nom exact du champ (Utilisateur et pas User)
    const candidature = item.Candidatures?.[0];
    const professionnel = candidature?.ProfessionnelDentaire;
    const userPro = professionnel?.Utilisateur;
  
    return (
      <View style={styles.offreCard}>
        <Text style={styles.offreTitle}>{item.titre}</Text>
        <Text>Profession : {item.type_professionnel}</Text>
        <Text>Date : {moment(item.date_mission).format("DD MMMM YYYY")}</Text>
        <Text>Heure début : {moment(item.heure_debut).format("HH:mm")}</Text>
        <Text>Heure fin : {moment(item.heure_fin).format("HH:mm")}</Text>
        <Text>Description : {item.descript}</Text>
        <Text>Exigences : {item.competences_requises}</Text>
        <Text>Salaire : {item.remuneration} $</Text>
  
        {userPro && (
          <View style={styles.candidatureContainer}>
            <Text style={styles.proInfo}>
              Acceptée par : {userPro.prenom} {userPro.nom} ({professionnel.type_profession})
            </Text>
            <TouchableOpacity
              style={styles.refuserButton}
              onPress={() => handleRefuser(candidature.id_candidature)}
            >
              <Text style={styles.refuserText}>Refuser la candidature</Text>
            </TouchableOpacity>
          </View>
        )}
  
        <TouchableOpacity
          onPress={confirmerSuppression}
          style={styles.supprimeroffre}
        >
          <Text style={styles.supprimeroffreText}>Supprimer</Text>
        </TouchableOpacity>
  
        {userPro && isPasse && (
          <TouchableOpacity
            onPress={confirmerMasquage}
            style={[styles.supprimeroffre, { backgroundColor: "#888", marginTop: 5 }]}
          >
            <Text style={styles.supprimeroffreText}>Masquer</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/dentify_logo_noir.png")}
          style={styles.logo}
        />
        <View style={styles.rightIcons}>
          <TextInput
            style={styles.searchInput}
            placeholder="Recherche..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("MessageListeScreen")}
          >
            <AntDesign style={styles.iconText} name="message1" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("ProfilCli")}
          >
            <MaterialCommunityIcons
              style={styles.iconText}
              name="account-circle-outline"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenu */}
      <View style={styles.container2}>
        <Text style={styles.titleoffre}>Mes Offres</Text>
        <FlatList
          data={offres}
          keyExtractor={(item) => item.id_offre.toString()}
          renderItem={renderOffre}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucune offre pour le moment.</Text>
          }
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("CreationOffre")}
        >
          <AntDesign name="plus" size={24} color="white" />
          <Text style={styles.addButtonText}>Ajouter une offre</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleNavigation("Mesoffres")}
        >
          <AntDesign name="calendar" size={24} color="black" />
          <Text
            style={[
              styles.footerTextClick,
              activePage === "Mesoffres" && styles.activeButtonText
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
              activePage === "CreationOffre" && styles.activeButtonText
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
              activePage === "AccueilMore" && styles.activeButtonText
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



  /* === NOUVEAUX STYLES === */
  candidatureContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  proInfo: {
    fontSize: 16,
    marginBottom: 8,
  },
  refuserButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  refuserText: {
    color: "white",
    fontWeight: "bold",
  },
  
});