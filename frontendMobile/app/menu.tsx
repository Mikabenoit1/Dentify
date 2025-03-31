import {StyleSheet, Text, View } from "react-native";
import {Link} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";



export default function Menu() {
  return (
    <SafeAreaView>
      <Text>A propos</Text>
      <Text>Je commence vraiment a etre heureux</Text>
      <Link href="/">Accueil</Link>
      
    </SafeAreaView>
  );
}