import React, { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Image, ImageBackground } from 'react-native';

const Error = () => {
  const [dentPositionX] = useState(new Animated.Value(-60)); 
  const [dentPositionY] = useState(new Animated.Value(35)); 
  const [soucoupePositionX] = useState(new Animated.Value(-50)); 
  const [soucoupePositionY] = useState(new Animated.Value(-145)); 


  useEffect(() => {
    // Animation de l'image de la dent qui suit un mouvement en triangle
    const dentAnimation = Animated.loop(
      Animated.sequence([
        // 2ème côté du triangle
        Animated.parallel([
          Animated.timing(dentPositionX, {
            toValue: 0,
            duration: 3500, // Va au centre
            useNativeDriver: true,
          }),
          Animated.timing(dentPositionY, {
            toValue: -45, // 2e position, la plus haute
            duration: 3500,
            useNativeDriver: true,
          }),
        ]),
        // 3ème côté du triangle
        Animated.parallel([
          Animated.timing(dentPositionX, {
            toValue: 60, // Va à droite
            duration: 3500, // Durée du mouvement
            useNativeDriver: true,
          }),
          Animated.timing(dentPositionY, {
            toValue: -10, // Derniere position, env entre les deux
            duration: 3500,
            useNativeDriver: true,
          }),
        ]),
        // 1er côté du triangle
        Animated.parallel([
          Animated.timing(dentPositionX, {
            toValue: -60, // Commence à gauche
            duration: 3500,
            useNativeDriver: true,
          }),
          Animated.timing(dentPositionY, {
            toValue: 35, // Premiere position, le plus bas
            duration: 3500,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    dentAnimation.start();

    return () => dentAnimation.stop(); // Nettoyage de l'animation de la dent
  }, [dentPositionX, dentPositionY]);

  useEffect(() => {
    // Animation de la soucoupe volante qui suit aussi un mouvement en triangle
    const soucoupeAnimation = Animated.loop(
      Animated.sequence([
        // 2ème côté du triangle pour la soucoupe
        Animated.parallel([
          Animated.timing(soucoupePositionX, {
            toValue: 0,   // Va au centre
            duration: 3500,
            useNativeDriver: true,
          }),
          Animated.timing(soucoupePositionY, {
            toValue: -215, // 2e position, la plus haute
            duration: 3500,
            useNativeDriver: true,
          }),
        ]),
        // 3ème côté du triangle
        Animated.parallel([
          Animated.timing(soucoupePositionX, {
            toValue: 50,  // Va à droite
            duration: 3500,
            useNativeDriver: true,
          }),
          Animated.timing(soucoupePositionY, {
            toValue: -185, // Derniere position, env entre les deux
            duration: 3500,
            useNativeDriver: true,
          }),
        ]),
        // 1er côté du triangle
        Animated.parallel([
          Animated.timing(soucoupePositionX, {
            toValue: -50, // Commence à gauche
            duration: 3500,
            useNativeDriver: true,
          }),
          Animated.timing(soucoupePositionY, {
            toValue: -145, // Premiere position, le plus bas
            duration: 3500,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    soucoupeAnimation.start();

    return () => soucoupeAnimation.stop(); // Nettoyage de l'animation de la soucoupe
  }, [soucoupePositionX, soucoupePositionY]);

  return (
    <View style={styles.container}>
      {/* L'arrière-plan étoilé */}
      <ImageBackground
        source={require('../assets/star-4773.gif')}  
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.dentcentre}>
          {/* Animation de la soucoupe volante */}
          <Animated.Image
            source={require('../assets/ufo_4.png')} 
            style={[
              styles.soucoupe,
              { 
                transform: [
                  { translateX: soucoupePositionX },
                  { translateY: soucoupePositionY },
                ],
              },
            ]}
          />
          
          {/* Animation de la dent qui bouge */}
          <Animated.Image
            source={require('../assets/tooth.png')} 
            style={[
                styles.dent,
                { 
                  transform: [
                    { translateX: dentPositionX },
                    { translateY: dentPositionY },
                  ],
                },
              ]}
          />
        </View>
        <Text style={styles.textError}> 404 ERROR </Text>
        <Text style={styles.text}> Page not found </Text>
      </ImageBackground>
    </View>
  );
};

export default Error;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  dentcentre: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', 
  },
  dent: {
    width: 70, 
    height: 70,
  },
  soucoupe: {
    width: 240, 
    height: 295, 
    position: 'absolute', 
    top: 50, 
  },
  textError: {
    position: 'absolute',
    bottom: 150,
    fontSize: 32,
    color: 'gray',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    position: 'absolute',
    bottom: 120,
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
});
