import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { AntDesign, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { publierOffre } from "../api/offreApi";
import { ScrollView } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";

export default function CreationOffre({ navigation }) {
  const [activePage, setActivePage] = useState("CreationOffre");
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [profession, setProfession] = useState("");
  const [open, setOpen] = useState(false);
  const [professions, setProfessions] = useState([
    { label: "Dentiste", value: "Dentiste" },
    { label: "Assistant dentaire", value: "Assistant dentaire" },
    { label: "Hygiéniste dentaire", value: "Hygieniste dentaire" },
  ]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [heureDebut, setHeureDebut] = useState("");
  const [heureFin, setHeureFin] = useState("");
  const [exigences, setExigences] = useState("");
  const [remuneration, setRemuneration] = useState("");

  const handleNavigation = (page) => {
    setActivePage(page);
    navigation.navigate(page);
  };

  const construireDateHeure = (date, heure) => {
    try {
      const [h, m] = heure.split(":");
      const clone = new Date(date);
      clone.setHours(parseInt(h), parseInt(m), 0);
      return clone.toLocaleString("sv-SE").replace(" ", "T"); 
    } catch (err) {
      return null;
    }
  };
  

  const handlePublier = () => {
    if (
      titre.trim() &&
      description.trim() &&
      profession &&
      heureDebut &&
      heureFin &&
      exigences &&
      remuneration
    ) {
      const heureDebutISO = construireDateHeure(date, heureDebut);
      const heureFinISO = construireDateHeure(date, heureFin);

      if (!heureDebutISO || !heureFinISO) {
        return Alert.alert(
          "Erreur",
          "Format d'heure invalide. Utilisez HH:MM (ex: 09:00)"
        );
      }

      const payload = {
        titre,
        descript: description,
        type_professionnel: profession,
        date_mission: date,
        heure_debut: heureDebutISO,
        heure_fin: heureFinISO,
        remuneration: parseFloat(remuneration),
        competences_requises: exigences,
        statut: "active",
      };

      publierOffre(payload)
        .then(() => {
          Alert.alert("Succès", "Votre offre a été publiée avec succès!", [
            {
              text: "OK",
              onPress: () => navigation.navigate("Mesoffres"),
            },
          ]);

          setTitre("");
          setDescription("");
          setProfession("");
          setDate(new Date());
          setHeureDebut("");
          setHeureFin("");
          setExigences("");
          setRemuneration("");
        })
        .catch((error) => {
          console.error("Erreur lors de la publication :", error);
          Alert.alert("Erreur", error.message || "Échec de la publication");
        });
    } else {
      Alert.alert("Erreur", "Veuillez remplir tous les champs requis.", [
        { text: "OK" },
      ]);
    }
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
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePicker}
        >
          <AntDesign
            name="calendar"
            size={24}
            color="#6a9174"
            style={styles.icon}
          />
          <Text style={styles.dateText}>
            {date.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

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

      {/* Footer */}
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
          onPress={() => handleNavigation("CreationOffre")}
        >
          <Ionicons name="create-outline" size={24} color="black" />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#6a9174",
  },
  logo: {
    width: 100,
    height: 50,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    width: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 8,
    backgroundColor: "white",
    fontSize: 14,
    marginRight: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  iconText: {
    fontSize: 24,
    color: "white",
  },
  container2: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fbf2e8",
  },
  titlecreation: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
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
    textAlignVertical: "top",
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
    color: "#333",
  },
  publishButton: {
    backgroundColor: "#6a9174",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  publishButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#6a9174",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  footerButton: {
    alignItems: "center",
    flex: 1,
  },
  footerIcon: {
    fontSize: 24,
    color: "white",
  },
  footerText: {
    fontSize: 12,
    color: "white",
    marginTop: 5,
  },
  footerTextClick: {
    fontSize: 12,
    color: "black",
    marginTop: 5,
  },
  activeButtonText: {
    textDecorationLine: "underline",
  },
});
