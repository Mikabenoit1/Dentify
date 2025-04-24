import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TextInput, StyleSheet,
  TouchableOpacity, Image, ActivityIndicator
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAllUsers, sendMessage, getConversationsDetails } from '../api/messagesApi';
import { getProfileDetails } from '../api';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import { RootStackParamList } from '../Navigation'; 

type NavigationProp = StackNavigationProp<RootStackParamList, 'NouvelleConversation'>;

const NouvelleConversation = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUtilisateurs(data);
        setFiltered(data);
      } catch (err) {
        console.error('Erreur chargement utilisateurs :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.trim() === '') {
      setFiltered(utilisateurs);
    } else {
      const query = text.toLowerCase();
      const result = utilisateurs.filter(u =>
        `${u.prenom} ${u.nom}`.toLowerCase().includes(query) ||
        u.courriel?.toLowerCase().includes(query)
      );
      setFiltered(result);
    }
  };

  const goToChat = async (user: any) => {
    try {
      const { user: currentUser } = await getProfileDetails();

      // Vérifie si la conversation existe déjà
      const conversations = await getConversationsDetails();
      const existing = conversations.find(conv =>
        (conv.contact?.id === user.id_utilisateur || conv.contact?.id_utilisateur === user.id_utilisateur)
      );

      let idConversation;

      if (existing) {
        idConversation = existing.id_conversation;
      } else {
        // Crée une nouvelle conversation avec un message "Salut" une seul fois par nouvelle conversation
        const message = await sendMessage({
          contenu: "Salut",
          destinataire_id: user.id_utilisateur,
          type_message: 'normal',
          id_offre: null
        });
        idConversation = message.id_conversation;
      }

      navigation.navigate('ChatScreen', {
        id_conversation: idConversation,
        contact: {
          id: user.id_utilisateur,
          name: `${user.prenom} ${user.nom}`,
          avatar: user.photo_profil || null
        }
      });

    } catch (e) {
      console.error('Erreur lors de la navigation vers la conversation :', e);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => goToChat(item)}>
      {item.photo_profil ? (
        <Image source={{ uri: item.photo_profil }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarText}>{item.prenom.charAt(0)}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.prenom} {item.nom}</Text>
        <Text style={styles.email}>{item.courriel}</Text>
      </View>
      <Icon name="chevron-forward" size={18} color="#888" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#34607d" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#34607d" />
        </TouchableOpacity>
      <TextInput
        style={styles.search}
        placeholder="Rechercher un utilisateur..."
        value={search}
        onChangeText={handleSearch}
      />

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun résultat trouvé.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_utilisateur.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbf2e8', paddingTop: 10 },
  search: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  avatarPlaceholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 70,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default NouvelleConversation;