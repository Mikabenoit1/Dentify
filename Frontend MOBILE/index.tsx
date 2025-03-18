import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../components/ThemedText";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      {/* ScrollView pour permettre le défilement */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer} // Permet au contenu de s'étendre
        style={styles.scrollView} // Prend toute la hauteur disponible
      >
        {/* Header avec fond vert */}
        <View style={styles.header}>
          <Image
            source={require("../assets/images/dentify_logo_noir.png")}
            style={{ width: 90, height: 50 }}
            resizeMode="contain"
          />
          <View style={styles.linksContainer}>
            <ThemedText variant="subtitle1">
              <Link href="/login">Connexion</Link>
            </ThemedText>
            <ThemedText variant="subtitle1">
              <Link href="/menu">Menu</Link>
            </ThemedText>
          </View>
        </View>

        {/* Body avec fond blanc */}
        <View style={styles.body}>
          <ThemedText variant="headline">Simplifiez.Engagez.</ThemedText>
          <ThemedText variant="headline">Remplacer</ThemedText>
          <ThemedText variant="body3">Découvrez nos services et trouvez le professionnel de santé qui vous correspond.</ThemedText>

          {/* Bouton "Découvrir" */}
          <Link href="/fonctionnalite" asChild>
            <TouchableOpacity style={styles.discoverButton}>
              <Text style={styles.discoverButtonText}>Découvrir</Text>
            </TouchableOpacity>
          </Link>

          {/* Conteneur pour les flaques de fond et les images des médecins */}
          <View style={styles.imagesContainer}>
            {/* Première flaque de fond avec 2 dentistes */}
            <View style={styles.flaqueContainer}>
              <Image
                source={require("../assets/images/tachepistache.png")}
                style={styles.backgroundImage}
                resizeMode="cover"
              />
              <View style={styles.imagesWrapper}>
                <Link href="/fonctionnalite" asChild>
                  <TouchableOpacity style={styles.imageWrapper}>
                    <Image
                      source={require("../assets/images/infirmiere_1.png")}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <ThemedText variant="body3" style={styles.subtitle}>Fonctionnalité</ThemedText>
                  </TouchableOpacity>
                </Link>
                <Link href="/profession" asChild>
                  <TouchableOpacity style={styles.imageWrapper}>
                    <Image
                      source={require("../assets/images/infirmiere_2.png")}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <ThemedText variant="body3" style={styles.subtitle}>Profession</ThemedText>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            {/* Deuxième flaque de fond avec 2 dentistes */}
            <View style={[styles.flaqueContainer, { marginTop: 40 }]}> {/* Espace entre les flaques */}
              <Image
                source={require("../assets/images/tachepistache.png")}
                style={styles.backgroundImage}
                resizeMode="cover"
              />
              <View style={styles.imagesWrapper}>
                <Link href="/contact" asChild>
                  <TouchableOpacity style={styles.imageWrapper}>
                    <Image
                      source={require("../assets/images/infirmiere_3.png")}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <ThemedText variant="body3" style={styles.subtitle}>Contact</ThemedText>
                  </TouchableOpacity>
                </Link>
                <Link href="/aPropos" asChild>
                  <TouchableOpacity style={styles.imageWrapper}>
                    <Image
                      source={require("../assets/images/infirmiere_4.png")}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <ThemedText variant="body3" style={styles.subtitle}>À propos</ThemedText>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1, 
  },
  scrollContainer: {
    flexGrow: 1, 
  },
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