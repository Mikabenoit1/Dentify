import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Modal } from "react-native";
import { AntDesign, MaterialCommunityIcons, Ionicons,MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Link } from "expo-router";
import OffreStore from "../utils/OffreStore"; 
import { ScrollView } from "react-native-gesture-handler";
import DropDownPicker from 'react-native-dropdown-picker';

// Type pour les événements du DateTimePicker
type DateTimePickerEvent = {
  type: string;
  nativeEvent: {
    timestamp: number;
  };
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CreationOffre() {
  const [activePage, setActivePage] = useState<string>("CreationOffre");
  const [titre, setTitre] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [profession, setProfession] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [professions, setProfessions] = useState([
    { label: "Dentiste", value: "Dentiste" },
    { label: "Assistant dentaire", value: "Assistant dentaire" },
    { label: "Hygiéniste dentaire", value: "Hygiéniste dentaire" }
  ]);
  const [date, setDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState<boolean>(false);
  const [heureDebut, setHeureDebut] = useState<string>("");
  const [heureFin, setHeureFin] = useState<string>("");
  const [exigences, setExigences] = useState<string>("");
  const [remuneration, setRemuneration] = useState<string>("");
  const [redirectToMesOffres, setRedirectToMesOffres] = useState<boolean>(false);
  const [newOffreId, setNewOffreId] = useState<string>("");

  const handleNavigation = (page: string): void => {
    setActivePage(page);
  };

  const handlePublier = (): void => {
    if (titre.trim() && description.trim() && profession && heureDebut && heureFin && exigences && remuneration) {
      // crée nouvelle offre
      const newOffre = { 
        titre, 
        description, 
        profession, 
        date: date.toLocaleDateString("fr-FR", { 
          weekday: "long", 
          day: "2-digit", 
          month: "long", 
          year: "numeric" 
        }), 
        heureDebut, 
        heureFin, 
        exigences, 
        remuneration,
        id: Date.now().toString() // ID unique
      };
      
      // ajout au store
      const savedOffre = OffreStore.addOffre(newOffre);
      
      // Préparer la redirection
      setNewOffreId(savedOffre.id);
      
      // affiche confirmation de l'offre publié si respecte tout
      Alert.alert(
        "Succès",
        "Votre offre a été publiée avec succès!",
        [{ text: "OK", onPress: () => {
          // réinitialiser les champs
          setTitre("");
          setDescription("");
          setProfession("");
          setDate(new Date());
          setHeureDebut("");
          setHeureFin("");
          setExigences("");
          setRemuneration("");
          
          // Activer la redirection
          setRedirectToMesOffres(true);
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

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    if (selectedDate) {
      setDate(selectedDate);
      setShowModal(false); // Fermer le modal après sélection
    }
  };

  // Si redirection est active, rendre le Link qui va déclencher la navigation
  if (redirectToMesOffres) {
    return (
      <View style={{position: 'absolute'}}>
        <Link href={{pathname: "/mesoffres", params: { newOffreId }}} asChild>
          <TouchableOpacity>
            <Text>Redirection...</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

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
            {date.toLocaleDateString("fr-FR", { 
              weekday: "long", 
              day: "2-digit", 
              month: "long", 
              year: "numeric" 
            })}
          </Text>
        </TouchableOpacity>

        {/* Modal pour afficher le DateTimePicker */}
        <Modal 
          transparent={true} 
          animationType="slide" 
          visible={showModal} 
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                themeVariant="light"
                textColor="#000000"
              />
              <TouchableOpacity style={styles.confirmButton} onPress={() => setShowModal(false)}>
                <Text style={styles.confirmText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Heure début et fin */}
        <Text style={styles.label}>Heure de début :</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Heure de début (HH:MM)" 
          value={heureDebut} 
          onChangeText={setHeureDebut} 
        />
        
        <Text style={styles.label}>Heure de fin :</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Heure de fin (HH:MM)" 
          value={heureFin} 
          onChangeText={setHeureFin} 
        />

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
        <TextInput 
          style={styles.input} 
          placeholder="Exigences" 
          value={exigences} 
          onChangeText={setExigences} 
        />

        <Text style={styles.label}>Salaire :</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Rémunération" 
          value={remuneration} 
          onChangeText={setRemuneration} 
        />

        <TouchableOpacity style={styles.publishButton} onPress={handlePublier}>
          <Text style={styles.publishButtonText}>Publier l'offre</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Barre de tâche */}
      <View style={styles.footer}>
        <Link href="/mesoffres" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <AntDesign name="calendar" size={24} color="white" />
            <Text style={styles.footerText}>Offres publiés</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/creation-offre" asChild>
          <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="create-outline" size={24} color="black" />
          <Text style={styles.footerTextClick}>Création d'une offre</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/AccueilMore" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <MaterialIcons name="more-horiz" size={24} color="white" />
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
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: "#6a9174",
    padding: 10,
    borderRadius: 5,
    width: "50%",
    alignItems: "center",
  },
  confirmText: { 
    color: "white", 
    fontWeight: "bold", 
  },
});
