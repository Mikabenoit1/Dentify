import React from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ContactScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Contact</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Image 
                    source={require("../assets/contactez-nous.png")}
                    style={styles.topImage}
                />

                <View style={styles.contactInfo}>
                    <Text style={styles.sectionTitle}>Nous contacter</Text>
                    
                    <TouchableOpacity style={styles.contactMethod} onPress={() => Linking.openURL('tel:5148688686')}>
                        <Feather name="phone" size={24} color="#6a9174" />
                        <Text style={styles.contactText}>514 868 8686</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactMethod} onPress={() => Linking.openURL('mailto:dentify082@gmail.com')}>
                        <Feather name="mail" size={24} color="#6a9174" />
                        <Text style={styles.contactText}>dentify082@gmail.com</Text>
                    </TouchableOpacity>

                    <View style={styles.contactMethod}>
                        <Feather name="map-pin" size={24} color="#6a9174" />
                        <Text style={styles.contactText}>123 Rue Dentaire, Montréal</Text>
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Envoyez un message</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Votre nom"
                        placeholderTextColor="#95a5a6"
                    />
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Votre email"
                        keyboardType="email-address"
                        placeholderTextColor="#95a5a6"
                    />
                    
                    <TextInput
                        style={[styles.input, styles.messageInput]}
                        placeholder="Votre message"
                        multiline
                        placeholderTextColor="#95a5a6"
                    />
                    
                    <TouchableOpacity style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Envoyer</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbf2e8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#6a9174',
        paddingTop: 50,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    headerRight: {
        width: 24,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    topImage: {
        width: '100%',
        height: 180,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6a9174',
        marginBottom: 15,
    },
    contactInfo: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    contactMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    contactText: {
        marginLeft: 15,
        fontSize: 16,
        color: '#2c3e50',
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#dfe6e9',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: 'white',
    },
    messageInput: {
        height: 120,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#6a9174',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    bottomImage: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginTop: 20,
    },
});
