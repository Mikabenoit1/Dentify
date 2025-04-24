import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar, Image
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getConversationsDetails } from '../api/messagesApi';
import { FontAwesome } from '@expo/vector-icons';
import { RootStackParamList } from '../Navigation'; 

type NavigationProp = StackNavigationProp<RootStackParamList, 'MessageListeScreen'>;

const MessageListeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversationsDetails();
        const formatted = data.map(conv => ({
          id_conversation: conv.id_conversation,
          id: conv.contact.id,
          name: conv.contact.nom,
          avatar: conv.contact.avatar || null,
          lastMessage: conv.dernier_message || 'Touchez pour voir les messages',
          date: new Date(conv.date).toLocaleDateString('fr-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          unreadCount: conv.unreadCount || 0,
          
        }));
        setConversations(formatted);
      } catch (e) {
        console.error('Erreur chargement conversations :', e);
      }
    };

    fetchConversations();
  }, []);

  const goToChat = (conversation) => {
    navigation.navigate('ChatScreen', {
      id_conversation: conversation.id_conversation,
      contact: {
        id: conversation.id,
        name: conversation.name,
        avatar: conversation.avatar,
      },
    });
  };

  const goToNewConversation = () => {
    navigation.navigate('NouvelleConversation');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => goToChat(item)}>
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholder]}>
          <Text style={styles.placeholderText}>{item.name.charAt(0)}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        <Text style={styles.date}>{item.date}</Text>
        <View style={styles.badgeWrapper}>
  {item.unreadCount > 0 && (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{item.unreadCount}</Text>
    </View>
  )}
</View>

      </View>
      <Icon name="chevron-forward" size={18} color="#888" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#34607d" />
        </TouchableOpacity>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity onPress={goToNewConversation}>
            <Icon name="add-circle-outline" size={28} color="#34607d" />
          </TouchableOpacity>
        </View>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucune conversation</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={item => item.id_conversation.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbf2e8' },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ae9f86',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34607d',
  },
  item: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  placeholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
  },
  lastMessage: {
    color: '#888',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 70,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  date: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  badgeWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MessageListeScreen;
