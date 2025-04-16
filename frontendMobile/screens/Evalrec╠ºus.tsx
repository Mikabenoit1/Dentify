import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function ReviewsScreen({ route }: any) {
  const { review } = route.params; // On récupère l'avis envoyé depuis la page de notation

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Avis Reçus</Text>

      <View style={styles.reviewBox}>
        <Text style={styles.reviewDate}>{review.date}</Text>
        <Text>Q1 : {review.q1}/5</Text>
        <Text>Q2 : {review.q2}/5</Text>
        <Text>Q3 : {review.q3}/5</Text>
        <Text>Q4 : {review.q4}/5</Text>
        <Text style={styles.reviewAverage}>Moyenne : {review.average}/5</Text>
        {review.comment ? <Text>💬 {review.comment}</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  reviewBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  reviewDate: {
    fontStyle: 'italic',
  },
  reviewAverage: {
    fontWeight: 'bold',
  },
});
