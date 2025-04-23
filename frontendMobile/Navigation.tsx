export type RootStackParamList = {
    Accueil: undefined;
    ConnexionCli: undefined;
    ChatScreen: {
      id_conversation: number;
      contact: {
        id: string | number;
        name: string;
        avatar?: string | null;
      };
    };
    NouvelleConversation: undefined;
    MessageListeScreen: undefined;
  };
  