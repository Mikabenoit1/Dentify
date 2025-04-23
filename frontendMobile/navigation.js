import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import Inscription from "./screens/Inscription";
import Accueil from "./screens/Accueil";
import ConnexionCli from "./screens/ConnexionCli";
import InscriptionCli from "./screens/InscriptionCli";
import ContactScreen from "./screens/Contact";
import Connexions from "./screens/Connexions";
import AboutScreen from "./screens/AboutUs";
import Profil from "./screens/Profil";
import ProfilClinique from "./screens/ProfilClinique";
import Notification from "./screens/Notification";
import AccueilMore from "./screens/AccueilMore";
import Mesoffres from "./screens/Mesoffres";
import CreationOffre from "./screens/CreationOffre";
import Indexx from "./screens/Indexx";
import Professions from "./screens/Professions";
import Fonctionnalite from "./screens/Fonctionnalite";
import AccueilClinique from "./screens/AccueilClinique";
import Offre from "./screens/Offre";
import Horaire from "./screens/Horaire";
import Calendrier from "./screens/Calendrier"; // Nouvel import
import ResetMdp from "./screens/ResetMdp";
import EmailVerification from "./screens/EmailVerification";
import NewMdp from "./screens/NewMdp";
import Error from "./screens/Error";
import Review from "./screens/Review";
import MessageListeScreen from "./screens/MessageListeScreen";
import ChatScreen from "./screens/ChatScreen";
import Parametre from "./screens/Parametre";
import NotificationClinique from "./screens/NotificationClinique";
import ParametreClinique from "./screens/ParametreClinique";
import NouvelleConversation from "./screens/NouvelleConversation";


const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Indexx">
        
        <Stack.Screen name="Inscription" component={Inscription} />
        <Stack.Screen name="Accueil" component={Accueil} />
        <Stack.Screen name="ConnexionCli" component={ConnexionCli} />
        <Stack.Screen name="InscriptionCli" component={InscriptionCli} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="Connexions" component={Connexions} />
        <Stack.Screen name="AboutUs" component={AboutScreen} />
        <Stack.Screen name="Profil" component={Profil} />
        <Stack.Screen name="ProfilClinique" component={ProfilClinique} />
        <Stack.Screen name="AccueilMore" component={AccueilMore} />
        <Stack.Screen name="Mesoffres" component={Mesoffres} />
        <Stack.Screen name="CreationOffre" component={CreationOffre} />
        <Stack.Screen name="Indexx" component={Indexx} />
        <Stack.Screen name="Professions" component={Professions} />
        <Stack.Screen name="Fonctionnalite" component={Fonctionnalite} />
        <Stack.Screen name="AccueilClinique" component={AccueilClinique} />
        <Stack.Screen name="Offre" component={Offre} />
        <Stack.Screen name="Horaire" component={Horaire} />
        <Stack.Screen name="Calendrier" component={Calendrier} />
        <Stack.Screen name="ResetMdp" component={ResetMdp} />
        <Stack.Screen name="EmailVerification" component={EmailVerification} />
        <Stack.Screen name="NewMdp" component={NewMdp} />
        <Stack.Screen name="Error" component={Error} />
        <Stack.Screen name="Review" component={Review} />
        <Stack.Screen name="MessageListeScreen" component={MessageListeScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Notification" component={Notification}/>
        <Stack.Screen name="NotificationClinique" component={NotificationClinique}/>
        <Stack.Screen name="Parametre" component={Parametre}/>
        <Stack.Screen name="ParametreClinique" component={ParametreClinique}/>
        <Stack.Screen name="NouvelleConversation" component={NouvelleConversation}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}