import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Modal } from "react-native";
import { AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import OffreStore from "../utils/OffreStore"; 
import { ScrollView } from "react-native-gesture-handler";
import DropDownPicker from 'react-native-dropdown-picker';

export default function CreationOffre({ navigation, route }) {
  const [activePage, setActivePage] = useState("CreationOffre");
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [profession, setProfession] = useState("");
  const [open, setOpen] = useState(false);
  const [professions, setProfessions] = useState([
    { label: "Dentiste", value: "Dentiste" },
    { label: "Assistant dentaire", value: "Assistant dentaire" },
    { label: "Hygiéniste dentaire", value: "Hygieniste dentaire" }
  ]);
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [heureDebut, setHeureDebut] = useState("");
  const [heureFin, setHeureFin] = useState("");
  const [exigences, setExigences] = useState("");
  const [remuneration, setRemuneration] = useState("");

  const handleNavigation = (page) => {
    setActivePage(page);
    navigation.navigate(page);
  };

  const handlePublier = () => {
    if (titre.trim() && description.trim() && profession && heureDebut && heureFin && exigences && remuneration) {
      // crée nouvelle offre
      const newOffre = { titre, description, profession, date: date.toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }), heureDebut, heureFin, exigences, remuneration };
      
      // ajout au store
      const savedOffre = OffreStore.addOffre(newOffre);
      
      // affiche confirmation de l'offre publié si respecte tout
      Alert.alert(
        "Succès",
        "Votre offre a été publiée avec succès!",
        [{ text: "OK", onPress: () => {
          // naviguer vers Mesoffres avec la nouvelle offre
          navigation.navigate("Mesoffres", { newOffre: savedOffre });
          
          // réinitialiser les champs
          setTitre("");
          setDescription("");
          setProfession("");
          setDate(new Date());
          setHeureDebut("");
          setHeureFin("");
          setExigences("");
          setRemuneration("");
        }}]
      );
    } else {
      // affiche erreur si un/des champs est/sont vide(s) 
      Alert.alert(
        "Erreur",
        "Veuillez remplir tous les champs requis.",
        [{ text: "OK" }]
      );
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
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
      <ScrollView style={styles.container2}>
        <Text style={styles.titlecreation}>Création d'une Offre</Text>

        <Text style={styles.label}>Titre de l'offre :</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Titre de l'offre" 
          value={titre} 
          onChangeText={setTitre} 
        />

        {/* Liste déroulante */}
      <Text style={styles.label}>Choisir une profession :</Text>
      <DropDownPicker
          style={styles.input}
          open={open}
          value={profession}
          items={professions}
          setOpen={setOpen}
          setValue={setProfession}
          setItems={setProfessions}
          
          placeholder="Sélectionner une profession"
        />
      


      <Text style={styles.label}>Sélectionner une date :</Text>
      <TouchableOpacity onPress={() => setShowModal(true)} style={styles.datePicker}>
        <AntDesign name="calendar" size={24} color="#6a9174" style={styles.icon} />
        <Text style={styles.dateText}>
          {date.toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
        </Text>
      </TouchableOpacity>

      {/* Modal pour afficher le DateTimePicker */}
      <Modal transparent={true} animationType="slide" visible={showModal} onRequestClose={() => setShowModal(false)}>
        <TouchableOpacity style={styles.modalBackground} onPress={() => setShowModal(false)}>
          <View style={styles.modalContent}>
            <DateTimePicker value={date} mode="date" display="spinner" onChange={handleDateChange} />
            <TouchableOpacity style={styles.confirmButton} onPress={() => setShowModal(false)}>
              <Text style={styles.confirmText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>



      {/* Heure début et fin */}
      <Text style={styles.label}>Heure de début :</Text>
      <TextInput style={styles.input} placeholder="Heure de début (HH:MM)" value={heureDebut} onChangeText={setHeureDebut} />
      <Text style={styles.label}>Heure de fin :</Text>
      <TextInput style={styles.input} placeholder="Heure de fin (HH:MM)" value={heureFin} onChangeText={setHeureFin} />


      <Text style={styles.label}>Description :</Text>
      <TextInput 
          style={[styles.input, styles.inputdesc]} 
          placeholder="Description" 
          value={description} 
          onChangeText={setDescription} 
          multiline 
        />
      
      {/* Exigences et rémunération */}
      <Text style={styles.label}>Exigences :</Text>
      <TextInput style={styles.input} placeholder="Exigences" value={exigences} onChangeText={setExigences} />

      <Text style={styles.label}>Salaire :</Text>
      <TextInput style={styles.input} placeholder="Rémunération" value={remuneration} onChangeText={setRemuneration} />

        <TouchableOpacity style={styles.publishButton} onPress={handlePublier}>
          <Text style={styles.publishButtonText}>Publier l'offre</Text>
        </TouchableOpacity>
      </ScrollView>







      {/* Barre de tâche */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleNavigation("Mesoffres")}
        >
          <AntDesign style={styles.footerIcon} name="calendar" />
          <Text
            style={[
              styles.footerText,
              activePage === "Mesoffres" && styles.activeButtonText,
            ]}
          >
            Mes offres
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleNavigation("CreationOffre")}>
          <Ionicons name="create-outline"  size={24} color="black" /> 
          <Text
            style={[
              styles.footerTextClick,
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
  titlecreation: { 
    fontSize: 24, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 20 
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "white",
    fontSize: 16,
  },
  inputdesc: { 
    height: 100, 
    textAlignVertical: "top" 
  },
  publishButton: { 
    backgroundColor: "#6a9174", 
    padding: 15, 
    borderRadius: 8, 
    alignItems: "center" 
  },
  publishButtonText: { 
    color: "white", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  label: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 5, 
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "white",
    marginBottom: 15,
  },
  icon: { 
    marginRight: 10,
  },
  dateText: { 
    fontSize: 16, 
    color: "#333" 
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: "#6a9174",
    padding: 10,
    borderRadius: 5,
  },
  confirmText: { 
    color: "white", 
    fontWeight: "bold", 
},

});