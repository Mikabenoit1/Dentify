import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function Review({ navigation }) {
    // État pour les notes et le commentaire
  const [q1, setQ1] = useState(0);
  const [q2, setQ2] = useState(0);
  const [q3, setQ3] = useState(0);
  const [q4, setQ4] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);

  const handleSubmit = () => {
    if ([q1, q2, q3, q4].includes(0)) {
      alert('Note chaque question avec une note entre 1 et 5.');
      return;
    }

    const average = ((q1 + q2 + q3 + q4) / 4).toFixed(1);

    setReviews([
      {
        q1, q2, q3, q4,
        comment,
        average,
        date: new Date().toLocaleString(),
      },
      ...reviews,
    ]);

    // Réinitialiser
    setQ1(0);
    setQ2(0);
    setQ3(0);
    setQ4(0);
    setComment('');
    alert("Merci pour votre avis !");
  };

  const renderButtons = (value: number, setValue: (val: number) => void) => (
    <View style={styles.buttonRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity
          key={n}
          onPress={() => setValue(n)}
          style={[
            styles.noteButton,
            { backgroundColor: value === n ? '#6a9174' : '#ae9f86' },
          ]}
        >
          <Text style={styles.noteText}>{n}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>

        <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.navigate("Indexx")}>
            <Text style={styles.buttonTextBack}> Retour à la page principale </Text>
        </TouchableOpacity>

      <Text style={styles.title}>Évaluation</Text>

      <Text style={styles.question}>1. Le lieu était-il propre ?</Text>
      {renderButtons(q1, setQ1)}

      <Text style={styles.question}>2. Les autres employés étaient-ils agréables ?</Text>
      {renderButtons(q2, setQ2)}

      <Text style={styles.question}>3. La clinique était-elle bien organisée ?</Text>
      {renderButtons(q3, setQ3)}

      <Text style={styles.question}>4. Comment avez-vous aimé votre shift en général ?</Text>
      {renderButtons(q4, setQ4)}

      <Text style={styles.commentTitle}>Commentaire :</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="(facultatif)"
        multiline
        style={styles.commentInput}
      />

      <TouchableOpacity onPress={handleSubmit} >
        <Text style={styles.submit}> Soumettre </Text>
      </TouchableOpacity>

      <Text style={styles.reviewTitle}>Avis reçus :</Text>
      {reviews.map((r, idx) => (
        <View key={idx} style={styles.reviewBox}>
          <Text style={styles.reviewTexte}>{r.date}</Text>
          <Text style={styles.reviewTexte}>Q1 : {r.q1}/5</Text>
          <Text style={styles.reviewTexte}>Q2 : {r.q2}/5</Text>
          <Text style={styles.reviewTexte}>Q3 : {r.q3}/5</Text>
          <Text style={styles.reviewTexte}>Q4 : {r.q4}/5</Text>
          <Text style={styles.reviewMoy}>Moyenne : {r.average}/5</Text>
          {r.comment ? <Text>💬 {r.comment}</Text> : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fbf2e8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34607d',
    textAlign: 'center',
    marginTop: 70,
  },
  question: {
    fontSize: 15,
    marginTop: 20,
    color: '#34607d',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 15,
  },
  noteButton: {
    padding: 10,
    marginRight: 5,
    borderRadius: 10,
  },
  noteText: {
    fontSize: 15,
    color: 'white',
  },
  commentTitle: {
    fontSize: 15,
    marginTop: 40,
    color: '#34607d',
    fontWeight: 'bold',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    height: 120,
    marginBottom: 15,
    marginTop: 10,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    fontSize: 16,
  },
  reviewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#34607d',
    marginTop: 40,
  },
  reviewBox: {
    marginBottom: 10,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  reviewTexte: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 5,
  },
  reviewMoy: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  submit: {
    backgroundColor: '#6a9174',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    borderRadius: 10,
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonBack: {
    position: "absolute",
    top: 5,
    left: 5,
    zIndex: 10,
    backgroundColor: "#34607d",
    padding: 10,
    borderRadius: 10,
  },
  buttonTextBack: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
