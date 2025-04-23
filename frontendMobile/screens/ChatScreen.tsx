import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  SafeAreaView, FlatList, KeyboardAvoidingView, Platform,
  Image, Dimensions, Alert
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons as Icon } from '@expo/vector-icons';
import {
  getMessagesForConversation,
  sendMessage,
  deleteMessage,
  updateMessage
} from '../api/messagesApi';
import { getProfileDetails } from '../api';

type RootStackParamList = {
  ChatScreen: {
    id_conversation: number;
    contact: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
};

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ChatScreenRouteProp>();

  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const { width } = Dimensions.get('window');

  const idConversation = route.params.id_conversation;
  const contact = route.params?.contact || {
    id: null,
    name: "Utilisateur inconnu",
    avatar: null,
  };
  

  useEffect(() => {
    const init = async () => {
      try {
        const { user } = await getProfileDetails();
        setUserId(user.id_utilisateur);

        console.log(" ID conversation à charger :", idConversation);

        const msgs = await getMessagesForConversation(idConversation);
        const formatted = msgs.map(msg => ({
          id: msg.id_message.toString(),
          text: msg.contenu,
          isFromMe: msg.expediteur_id === user.id_utilisateur,
          timestamp: msg.date_envoi,
          originalId: msg.id_message
        }));
        setMessages(formatted);
      } catch (e) {
        console.error('Erreur chargement messages:', e);
      }
    };

    init();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    try {
      const newMsg = await sendMessage({
        contenu: inputText,
        destinataire_id: contact.id,
        id_conversation: idConversation,
        type_message: 'normal'
      });

      const toAdd = {
        id: newMsg.id_message.toString(),
        text: newMsg.contenu,
        isFromMe: true,
        timestamp: newMsg.date_envoi,
        originalId: newMsg.id_message
      };

      setMessages(prev => [...prev, toAdd]);
      setInputText('');
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (e) {
      Alert.alert("Erreur", "Impossible d'envoyer le message.");
    }
  };

  const handleDelete = () => {
    Alert.alert("Supprimer", "Confirmer la suppression ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            const id = messages.find(m => m.id === selectedMessageId)?.originalId;
            await deleteMessage(id);
            setMessages(prev => prev.filter(m => m.id !== selectedMessageId));
            setSelectedMessageId(null);
          } catch {
            Alert.alert("Erreur", "Suppression échouée.");
          }
        }
      }
    ]);
  };

  const handleEdit = async () => {
    if (!editText.trim()) return;
    const id = messages.find(m => m.id === selectedMessageId)?.originalId;
    try {
      await updateMessage(id, editText);
      setMessages(prev =>
        prev.map(m =>
          m.id === selectedMessageId ? { ...m, text: editText } : m
        )
      );
      setEditMode(false);
      setSelectedMessageId(null);
    } catch {
      Alert.alert("Erreur", "Modification échouée.");
    }
  };

  const handleMessagePress = (msg) => {
    if (!msg.isFromMe) return;
    if (selectedMessageId === msg.id) {
      setSelectedMessageId(null);
      setEditMode(false);
    } else {
      setSelectedMessageId(msg.id);
      setEditText(msg.text);
      setEditMode(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isSelected = selectedMessageId === item.id;
    return (
      <View>
        <TouchableOpacity
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
              <Text style={item.isFromMe ? styles.myMessageText : styles.theirMessageText}>
                {item.text}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {isSelected && (
          <View style={styles.messageOptionsContainer}>
            {editMode ? (
              <>
                <TextInput
                  style={styles.editInput}
                  value={editText}
                  onChangeText={setEditText}
                  multiline
                />
                <View style={styles.editButtonsRow}>
                  <TouchableOpacity onPress={() => { setEditMode(false); setSelectedMessageId(null); }}>
                    <Text>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleEdit}>
                    <Text>Enregistrer</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.optionsRow}>
                <TouchableOpacity onPress={() => setEditMode(true)}>
                  <Icon name="create-outline" size={20} color="#007AFF" />
                  <Text>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete}>
                  <Icon name="trash-outline" size={20} color="red" />
                  <Text style={{ color: 'red' }}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="#34607d" />
            <Text style={styles.backText}>Messages</Text>
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <View style={styles.contactWrapper}>
              {contact.avatar ? (
                <Image source={{ uri: contact.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text>{contact?.name?.charAt(0) || "?"}</Text>
                </View>
              )}
              <Text style={styles.contactName}>{contact?.name || "Utilisateur inconnu"}</Text>

            </View>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesContent}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Écrire un message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity onPress={handleSend}>
            <Icon name="send" size={28} color="#34607d" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fbf2e8' 
  },
  keyboardAvoid: { 
    flex: 1 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ae9f86', 
    padding: 10 
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  backText: { 
    color: '#34607d', 
    fontSize: 16 
  },
  headerInfo: { 
    flex: 1, 
    alignItems: 'center' 
  },
  contactWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  avatar: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    marginRight: 8 
  },
  avatarPlaceholder: { 
    backgroundColor: '#007AFF', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  contactName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#34607d'
  },
  messagesContent: { 
    padding: 10 
  },
  messageBubbleRow: { 
    flexDirection: 'row', 
    marginVertical: 3 
  },
  myMessageRow: { 
    justifyContent: 'flex-end' 
  },
  theirMessageRow: { 
    justifyContent: 'flex-start' 
  },
  messageBubble: { 
    borderRadius: 18, 
    paddingHorizontal: 14, 
    paddingVertical: 8 
  },
  myMessage: { 
    backgroundColor: '#007AFF', 
    marginLeft: 60 
  },
  theirMessage: { 
    backgroundColor: '#E5E5EA', 
    marginRight: 60 
  },
  myMessageText: { 
    color: '#FFFFFF' 
  },
  theirMessageText: { 
    color: '#000000' 
  },
  messageOptionsContainer: { 
    margin: 10 
  },
  editInput: { 
    backgroundColor: '#fff', 
    padding: 8, 
    borderRadius: 8 
  },
  editButtonsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 8 
  },
  optionsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around' 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    borderTopWidth: 1, 
    borderColor: '#ccc' 
  },
  textInput: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 10, 
    borderRadius: 20, 
    marginRight: 10 
  },
});

export default ChatScreen;
