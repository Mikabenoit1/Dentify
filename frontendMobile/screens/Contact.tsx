import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';

export default function ContactScreen({ navigation }) {
    return (
        <View style={styles.container}>
            {/* Bouton de retour */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <FontAwesome name="chevron-left" size={24} color="white" />
            </TouchableOpacity>

            {/* Page d'entête */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Contactez-nous</Text>
            </View>

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
                        <Text style={styles.infoText}> dentify082@gmail.com</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Entypo name="location-pin" size={20} color="#34607d" />
                        <Text style={styles.infoText}>Notre adresse</Text>
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
            <Image 
                    source={require("../assets/contactez-nous.png")} 
                    style={styles.image}
                  />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbf2e8',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#6a9174',
        width: '100%',
        padding: 20,
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 15, 
        left: 20,
        zIndex: 10, 
        backgroundColor: "#34607d",
        padding: 10,
        borderRadius: 10,
    },
    content: {
        width: '90%',
        marginTop: 20,
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
    },
    image: {
        width: '90%',
        height: 200,
        marginTop: 10,
      },
});

