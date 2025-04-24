import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../utils/ThemedText";

export default function Index({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={[styles.scrollContainer, styles.scrollView]}>
        <View style={styles.header}>
          <Image
            source={require("../assets/dentify_logo_noir.png")}
            style={{ width: 90, height: 50 }}
            resizeMode="contain"
          />
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Connexions')}>
              <ThemedText variant="subtitle1">Connexion</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('menu')}>
              <ThemedText variant="subtitle1">Menu</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.body}>
          <ThemedText variant="headline">Simplifiez.Engagez.</ThemedText>
          <ThemedText variant="headline">Remplacer</ThemedText>
          <ThemedText variant="body3">
            Découvrez nos services et trouvez le professionnel de santé qui vous correspond.
          </ThemedText>

          <TouchableOpacity
            style={styles.discoverButton}
            onPress={() => navigation.navigate('Fonctionnalite')}
          >
            <Text style={styles.discoverButtonText}>Découvrir</Text>
          </TouchableOpacity>

          <View style={styles.imagesContainer}>
            <View style={styles.flaqueContainer}>
              <Image
                source={require("../assets/tachepistache.png")}
                style={styles.backgroundImage}
                resizeMode="cover"
              />
              <View style={styles.imagesWrapper}>
                <TouchableOpacity
                  style={styles.imageWrapper}
                  onPress={() => navigation.navigate('Fonctionnalite')}
                >
                  <Image
                    source={require("../assets/infirmiere_1.png")}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <ThemedText variant="body3" style={styles.subtitle}>Fonctionnalité</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageWrapper}
                  onPress={() => navigation.navigate('Professions')}
                >
                  <Image
                    source={require("../assets/infirmiere_2.png")}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <ThemedText variant="body3" style={styles.subtitle}>Profession</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.flaqueContainer, { marginTop: 40 }]}>
              <Image
                source={require("../assets/tachepistache.png")}
                style={styles.backgroundImage}
                resizeMode="cover"
              />
              <View style={styles.imagesWrapper}>
                <TouchableOpacity
                  style={styles.imageWrapper}
                  onPress={() => navigation.navigate('Contact')}
                >
                  <Image
                    source={require("../assets/infirmiere_3.png")}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <ThemedText variant="body3" style={styles.subtitle}>Contact</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageWrapper}
                  onPress={() => navigation.navigate('AboutUs')}
                >
                  <Image
                    source={require("../assets/infirmiere_4.png")}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <ThemedText variant="body3" style={styles.subtitle}>À propos</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#6a9174",
  },
  linksContainer: {
    flexDirection: "row",
    gap: 16,
  },
  body: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fbf2e8",
  },
  discoverButton: {
    backgroundColor: "#6a9174",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 20,
  },
  discoverButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagesContainer: {
    marginTop: 20,
    width: "100%",
  },
  flaqueContainer: {
    position: "relative",
    height: 350,
    marginBottom: 100,
  },
  backgroundImage: {
    position: "absolute",
    top: 60,
    left: 30,
    width: "90%",
    height: "90%",
    zIndex: 1,
  },
  imagesWrapper: {
    position: "relative",
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
  },
  imageWrapper: {
    width: "45%",
    aspectRatio: 1,
    alignItems: "center",
  },
  image: {
    width: "190%",
    height: "190%",
  },
  subtitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
