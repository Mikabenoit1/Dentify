import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Types
export interface Conversation {
  id: string;
  contact: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isFromMe: boolean;
    read: boolean;
  };
  unreadCount: number;
}

const MessageListeScreen: React.FC = () => {
  const navigation = useNavigation();
  
  // Données statiques de conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      contact: {
        id: 'u1',
        name: 'Jérémy Francoeur',
        avatar: 'https://example.com/default-avatar.png'
      },
      lastMessage: {
        text: 'Fini le frontend pour aujourd\'hui',
        timestamp: new Date().toISOString(),
        isFromMe: false,
        read: false
      },
      unreadCount: 1
    },
    {
      id: '2',
      contact: {
        id: 'u2',
        name: 'Pauline Carrie',
        avatar: 'https://example.com/default-avatar.png'
      },
      lastMessage: {
        text: 'J\'ai envoyé les documents sur discord',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 heure avant
        isFromMe: true,
        read: true
      },
      unreadCount: 0
    },
    {
      id: '3',
      contact: {
        id: 'u3',
        name: 'Jean Tifrice',
        avatar: 'https://example.com/default-avatar.png'
      },
      lastMessage: {
        text: 'Super, merci !',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 jour avant
        isFromMe: false,
        read: true
      },
      unreadCount: 0
    }
  ]);

  // Ajouter une nouvelle conversation
  const addConversation = (contactName: string) => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      contact: {
        id: `user_${Date.now()}`,
        name: contactName
      },
      lastMessage: {
        text: 'Nouvelle conversation',
        timestamp: new Date().toISOString(),
        isFromMe: true,
        read: true
      },
      unreadCount: 0
    };

    setConversations([newConversation, ...conversations]);
  };

  // Fonction pour formater l'affichage des dates
  const formatMessageDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][messageDate.getDay()];
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const navigateToChat = (conversation: Conversation) => {
    // @ts-ignore: navigation typing would need to be properly set up
    navigation.navigate('ChatScreen', { 
      conversationId: conversation.id,
      contactName: conversation.contact.name,
      contactId: conversation.contact.id,
      avatar: conversation.contact.avatar
    });
    
    // Marquer la conversation comme lue quand on la sélectionne
    if (conversation.unreadCount > 0) {
      const updatedConversations = conversations.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, read: true } } 
          : conv
      );
      setConversations(updatedConversations);
    }
  };

  const handleNewMessage = () => {
    // Pour l'exemple, ajoutons simplement une nouvelle conversation statique
    const contactName = `Contact ${Math.floor(Math.random() * 100)}`;
    addConversation(contactName);
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity 
      style={styles.messageItem} 
      onPress={() => navigateToChat(item)}
    >
      {/* Avatar du contact */}
      {item.contact.avatar ? (
        <Image 
          source={{ uri: item.contact.avatar }} 
          style={styles.avatar}
        />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarText}>
            {item.contact.name.charAt(0)}
          </Text>
        </View>
      )}
      
      <View style={styles.messageContent}>
        <Text style={[styles.senderName, item.unreadCount > 0 && styles.unreadText]}>
          {item.contact.name}
        </Text>
        <Text style={styles.preview} numberOfLines={1}>
          {item.lastMessage.isFromMe ? 'Vous: ' : ''}{item.lastMessage.text}
        </Text>
      </View>
      <View style={styles.messageTime}>
        <Text style={styles.timestamp}>
          {formatMessageDate(item.lastMessage.timestamp)}
        </Text>
        {item.unreadCount > 0 && <View style={styles.unreadIndicator} />}
        <Icon name="chevron-forward" size={16} color="#C7C7CC" />
      </View>
    </TouchableOpacity>
  );

  // Calculer le nombre total de messages non lus
  const totalUnreadCount = conversations.reduce((count, conv) => count + conv.unreadCount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
         <TouchableOpacity>
          <Text style={styles.editButton}>Modifier</Text>
         </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>
          Messages {totalUnreadCount > 0 ? `(${totalUnreadCount})` : ''}
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleNewMessage}>
            <Icon name="create-outline" size={28} color="#34607d" />
          </TouchableOpacity>
        </View>
      </View>
      
      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Pas de conversations</Text>
          <TouchableOpacity 
            style={styles.newMessageButton}
            onPress={handleNewMessage}
          >
            <Text style={styles.newMessageButtonText}>Nouveau message</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf2e8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#ae9f86',
  },
  headerLeft: {
    width: 60,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  editButton: {
    color: 'white',
    fontSize: 13,
    padding: 4,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#6a9174',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#6a9174',
  },
  list: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
  },
  avatarPlaceholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  messageContent: {
    flex: 1,
    paddingRight: 10,
  },
  senderName: {
    fontSize: 16,
    marginBottom: 3,
    color: '#000000',
  },
  unreadText: {
    fontWeight: 'bold',
  },
  preview: {
    fontSize: 15,
    color: '#8E8E93',
  },
  messageTime: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  timestamp: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 5,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginRight: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 78, // Aligner avec le bord droit de l'avatar
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 20,
  },
  newMessageButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  newMessageButtonText: {
    color: '#34607d',
    fontWeight: '600',
  },
});

export default MessageListeScreen;