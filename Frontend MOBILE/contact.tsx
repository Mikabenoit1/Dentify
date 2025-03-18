import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../components/ThemedText";
import { Link } from "expo-router";
import { MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';

export default function Contact() {
    return (
        <SafeAreaView style={styles.container}>
            {/* ScrollView pour permettre le défilement */}
            <ScrollView
                contentContainerStyle={styles.scrollContainer} // Permet au contenu de s'étendre
                style={styles.scrollView} // Prend toute la hauteur disponible
            >
                {/* Header avec fond vert */}
                <View style={styles.header}>
                    <Link href="/">
                    <Image
                        source={require("../assets/images/dentify_logo_noir.png")}
                        style={{ width: 90, height: 50 }}
                        resizeMode="contain"
                    />
                    </Link>
                    <View style={styles.linksContainer}>
                        <ThemedText variant="subtitle1">
                            <Link href="/login">Connexion</Link>
                        </ThemedText>
                        <ThemedText variant="subtitle1">
                            <Link href="/menu">Menu</Link>
                        </ThemedText>
                    </View>
                </View>

                {/* Page d'entête */}
                <View style={styles.titleContainer}>
                    <ThemedText variant="headline">
                        Contactez-nous
                    </ThemedText>
                </View>

                {/* Contenu principal */}
                <View style={styles.content}>
                    {/* Plus d'information sur nos coordonnés */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Nos Coordonnées</Text>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="phone" size={20} color="#34607d" />
                            <Text style={styles.infoText}>514 868 8686</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="email" size={20} color="#34607d" />
                            <Text style={styles.infoText}> papanoël082@gmail.com</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Entypo name="location-pin" size={20} color="#34607d" />
                            <Text style={styles.infoText}>1 Rue Meuh, St-ClinClin-des-Meuh-Meuh, QC</Text>
                        </View>
                    </View>

                    {/* Information pour envoyer un message */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Envoyez-nous un message</Text>
                        <TextInput style={styles.input} placeholder="Votre nom" />
                        <TextInput style={styles.input} placeholder="Votre email" keyboardType="email-address" />
                        <TextInput style={[styles.input, styles.messageInput]} placeholder="Votre message" multiline />

                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>ENVOYER</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Icônes des réseaux sociaux */}
                <View style={styles.socialMedia}>
                    <FontAwesome name="facebook" size={24} color="#34607d" />
                    <FontAwesome name="twitter" size={24} color="#34607d" />
                    <FontAwesome name="instagram" size={24} color="#34607d" />
                    <FontAwesome name="linkedin" size={24} color="#34607d" />
                </View>

                {/* Image de contact */}
                <Image
                    source={require("../assets/images/contactez-nous.png")}
                    style={styles.image}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbf2e8',
    },
    header: {
        width: '100%', // Prend toute la largeur de l'écran
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#6a9174',
    },
    linksContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    scrollView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    titleContainer: {
        alignItems: 'center',
        margin: 24,
    },
    content: {
        width: '90%',
        marginTop: 20,
        alignSelf: 'center', // Centre le contenu horizontalement
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6a9174',
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    infoText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    messageInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#34607d',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    socialMedia: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '50%',
        marginBottom: 20,
        alignSelf: 'center', // Centre les icônes des réseaux sociaux
    },
    image: {
        width: '70%',
        height: 200,
        marginTop: 10,
        alignSelf: 'center', // Centre l'image horizontalement
    },
});