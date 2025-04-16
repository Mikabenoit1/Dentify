import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Types
interface Message {
  id: string;
  text: string;
  isFromMe: boolean;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
}

type RootStackParamList = {
  ChatScreen: { 
    conversationId: string;
    contactId: string;
    contactName: string;
    avatar?: string;
  };
};

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;

const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ChatScreenRouteProp>();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { width } = Dimensions.get('window');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState('');

  // Informations du contact basées sur les paramètres de navigation
  const contact: Contact = {
    id: route.params?.contactId || 'unknown',
    name: route.params?.contactName || 'Contact',
    avatar: route.params?.avatar
  };

  // Aucun message initial
  const [messages, setMessages] = useState<Message[]>([]);

  // Envoyer un nouveau message
  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isFromMe: true,
      timestamp: new Date().toISOString(),
      status: 'read' // Statut direct à 'read' pour l'exemple
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');

    // Faire défiler automatiquement vers le bas
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Formater l'heure pour l'affichage
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Gérer la modification du message
  const handleEditMessage = () => {
    if (!selectedMessageId || editText.trim() === '') return;

    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === selectedMessageId 
          ? { ...msg, text: editText } 
          : msg
      )
    );
    
    setEditMode(false);
    setSelectedMessageId(null);
  };

  // Gérer la suppression du message
  const handleDeleteMessage = () => {
    if (!selectedMessageId) return;

    Alert.alert(
      "Supprimer le message",
      "Êtes-vous sûr de vouloir supprimer ce message ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Supprimer", 
          onPress: () => {
            setMessages(prevMessages => 
              prevMessages.filter(msg => msg.id !== selectedMessageId)
            );
            setSelectedMessageId(null);
          },
          style: "destructive"
        }
      ]
    );
  };

  // Gérer la sélection d'un message
  const handleMessagePress = (message: Message) => {
    if (!message.isFromMe) return;
    
    if (selectedMessageId === message.id) {
      // Si c'est déjà sélectionné, désélectionner
      setSelectedMessageId(null);
      setEditMode(false);
    } else {
      // Sinon, sélectionner ce message
      setSelectedMessageId(message.id);
      setEditText(message.text);
      setEditMode(false);
    }
  };

  // Rendu des options pour un message
  const renderMessageOptions = (messageId: string) => {
    return (
      <View style={styles.messageOptionsContainer}>
        {editMode ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={setEditText}
              multiline
              autoFocus
            />
            <View style={styles.editButtonsRow}>
              <TouchableOpacity
                style={[styles.editButton, styles.cancelButton]}
                onPress={() => {
                  setEditMode(false);
                  setSelectedMessageId(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editButton, styles.saveButton]}
                onPress={handleEditMessage}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setEditMode(true)}
            >
              <Icon name="create-outline" size={20} color="#007AFF" />
              <Text style={styles.optionText}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleDeleteMessage}
            >
              <Icon name="trash-outline" size={20} color="#FF3B30" />
              <Text style={[styles.optionText, styles.deleteText]}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Rendu d'un élément de message
  const renderMessageItem = ({ item }: { item: Message }) => {
    const isSelected = selectedMessageId === item.id;
    
    return (
      <View>
        <TouchableOpacity
          activeOpacity={item.isFromMe ? 0.7 : 1}
          onLongPress={() => handleMessagePress(item)}
          disabled={!item.isFromMe}
        >
          <View style={[
            styles.messageBubbleRow,
            item.isFromMe ? styles.myMessageRow : styles.theirMessageRow
          ]}>
            <View style={[
              styles.messageBubble,
              item.isFromMe ? styles.myMessage : styles.theirMessage,
              { maxWidth: width * 0.7 }
            ]}>
              <Text style={[
                styles.messageText,
                item.isFromMe ? styles.myMessageText : styles.theirMessageText
              ]}>
                {item.text}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {isSelected && renderMessageOptions(item.id)}
      </View>
    );
  };

  // Fonction vide pour le statut des messages (supprimé)
  const renderMessageStatus = () => {
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color="#007AFF" />
            <Text style={styles.backText}>Messages</Text>
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <TouchableOpacity style={styles.contactWrapper}>
              {contact.avatar ? (
                <Image 
                  source={{ uri: contact.avatar }} 
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarText}>
                    {contact.name.charAt(0)}
                  </Text>
                </View>
              )}
              <Text style={styles.contactName}>{contact.name}</Text>
              <Icon name="chevron-forward" size={16} color="#8E8E93" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Pas de messages</Text>
              <Text style={styles.emptySubText}>Envoyez votre premier message!</Text>
            </View>
          }
        />
        
        {renderMessageStatus()}
        
        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Icon name="add-circle" size={24} color="#007AFF" />
          </TouchableOpacity>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="iMessage"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.micButton}>
              <Icon name="mic" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          
          {inputText.length > 0 ? (
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Icon name="arrow-up-circle-fill" size={32} color="#007AFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.cameraButton}>
              <Icon name="camera" size={24} color="#007AFF" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 2,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  contactWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  avatarPlaceholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  messagesContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 300,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  messageBubbleRow: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginVertical: 2,
  },
  myMessage: {
    backgroundColor: '#007AFF',
    marginLeft: 60,
  },
  theirMessage: {
    backgroundColor: '#E5E5EA',
    marginRight: 60,
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#000000',
  },
  // Styles pour les options et l'édition de message
  messageOptionsContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 50,
    padding: 5,
    marginHorizontal: 10,
    marginBottom: 8,
    marginTop: 4,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    width: '50%',
    alignSelf: 'flex-end',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 2,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
  },
  optionText: {
    fontSize: 1,
    marginLeft: 2,
    color: '#007AFF',
  },
  deleteText: {
    color: '#FF3B30',
  },
  editContainer: {
    width: '100%',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#E5E5EA',
  },
  cancelButtonText: {
    color: '#000000',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
  },
  attachButton: {
    marginRight: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
  },
  micButton: {
    marginLeft: 8,
  },
  sendButton: {
    marginLeft: 8,
  },
  cameraButton: {
    marginLeft: 8,
  },
});

export default ChatScreen;