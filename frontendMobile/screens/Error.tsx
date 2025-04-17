import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';


export default function Error ({navigation}) {

    return ( 
        <View style={styles.container}>
            <View style={styles.premiercarre}>
                <View style={styles.deuxiemecarre}>
                <Image source={require("../assets/dentify_logo_noir.png")} style={styles.logo}/>
                </View>

            <Text style={styles.titleText}>Oups ! Page introuvable</Text>
            <Text style={styles.texteDescription}>Il semble qu'une carie ait rongé cette page... Elle n'existe plus ou n'a jamais existé</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Indexx')}>
                <Text style={styles.backButtonText}>Retour à l'accueil</Text>
            </TouchableOpacity>
            
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fbf2e8',
    },
    premiercarre: {
        width: '85%',
        height: '60%',
        backgroundColor: '#fff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deuxiemecarre: {
        width: '80%',
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#34607d',
        marginBottom: 20,
        marginTop: 20,
    },
    texteDescription: {
        fontSize: 16,
        color: '#34607d',
        textAlign: 'center',
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#34607d',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    logo: {
        width: 220,
        height: 220,
        marginBottom: 20,
        resizeMode: "contain",
        borderRadius: 20,
      },
});
        
