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
import AccueilMore from "./screens/AccueilMore";
import Mesoffres from "./screens/Mesoffres";
import CreationOffre from "./screens/CreationOffre";
import Indexx from "./screens/Indexx";
import Professions from "./screens/Professions";
import Fonctionnalite from "./screens/Fonctionnalite";
import AccueilClinique from "./screens/AccueilClinique";
import Offre from "./screens/Offre";
import Horaire from "./screens/Horaire";


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
        <Stack.Screen name="AccueilMore" component={AccueilMore} />
        <Stack.Screen name="Mesoffres" component={Mesoffres} />
        <Stack.Screen name="CreationOffre" component={CreationOffre} />
        <Stack.Screen name="Indexx" component={Indexx} />
        <Stack.Screen name="Professions" component={Professions} />
        <Stack.Screen name="Fonctionnalite" component={Fonctionnalite} />
        <Stack.Screen name="AccueilClinique" component={AccueilClinique} />
        <Stack.Screen name="Offre" component={Offre} />
        <Stack.Screen name="Horaire" component={Horaire} />
        
        {/* Ajoutez d'autres écrans ici */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
