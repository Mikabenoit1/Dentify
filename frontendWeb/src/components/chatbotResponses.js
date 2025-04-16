// src/components/chatbotResponses.js

const responses = {
    // Réponse par défaut quand aucune correspondance n'est trouvée
    "default": "Je ne suis pas sûr de comprendre votre demande. Pouvez-vous reformuler ou demander des informations sur les offres d'emploi, votre compte, ou comment utiliser notre plateforme?",
    
    // Salutations
    "greeting": "Bonjour! Comment puis-je vous aider aujourd'hui?",
    "greeting_keywords": ["bonjour", "salut", "allo", "hello", "hey", "hi", "bonsoir"],
    
    // Remerciements
    "thanks": "De rien! N'hésitez pas si vous avez d'autres questions.",
    "thanks_keywords": ["merci", "thanks", "thank you", "thx"],
    
    // Au revoir
    "goodbye": "Au revoir! Bonne journée!",
    "goodbye_keywords": ["au revoir", "bye", "adieu", "à plus", "ciao", "a+"],
    
    // Offres d'emploi
    "jobs": "Vous pouvez consulter les offres d'emploi disponibles dans la section 'Offres'. Vous pourrez filtrer selon vos critères et postuler directement.",
    "jobs_keywords": ["offre", "emploi", "job", "poste", "travail", "annonce", "offres"],
    
    // Compte utilisateur
    "account": "Pour créer ou modifier votre compte, rendez-vous dans la section 'Mon Compte'. Vous pourrez y ajouter vos informations professionnelles et CV.",
    "account_keywords": ["compte", "profil", "inscription", "connecter", "login", "enregistrer", "cv", "curriculum"],
    
    // Contact et messagerie
    "contact": "Vous pouvez contacter directement les cliniques via notre système de messagerie après avoir postulé à une offre.",
    "contact_keywords": ["contact", "message", "messagerie", "communiquer", "contacter", "écrire", "parler"],
    
    // Cliniques
    "clinics": "Les cliniques peuvent publier des offres et gérer leurs recrutements via notre plateforme. Pour plus d'informations, consultez la section 'Services'.",
    "clinics_keywords": ["clinique", "établissement", "hôpital", "cabinet", "centre"],
    
    // Comment postuler
    "how_to_apply": "Pour postuler, consultez les offres disponibles, cliquez sur celle qui vous intéresse puis sur le bouton 'Postuler'. Complétez ensuite le formulaire.",
    "how_to_apply_keywords": ["postuler", "candidature", "candidater", "comment postuler"],
    
    // Comment publier une offre
    "how_to_post": "Pour publier une offre, connectez-vous à votre compte clinique, puis accédez à 'Clinique-Cree' et remplissez le formulaire.",
    "how_to_post_keywords": ["publier", "créer", "poster", "publication", "comment publier", "nouvelle offre", "ajouter"],
    
    // Calendrier
    "calendar": "Le calendrier vous permet de gérer vos rendez-vous et entretiens. Accédez-y depuis votre espace personnel.",
    "calendar_keywords": ["calendrier", "rendez-vous", "agenda", "planning", "horaire", "entretien", "interview"],
    
    // Services proposés
    "services": "Notre plateforme propose la mise en relation entre professionnels de santé et cliniques, la gestion des candidatures, et un système de messagerie intégré.",
    "services_keywords": ["service", "prestation", "fonctionnalité", "outil", "option"],
    
    // Aide/Assistance
    "help": "Pour obtenir de l'aide sur une fonctionnalité spécifique, merci de préciser votre question. Je suis là pour vous aider!",
    "help_keywords": ["aide", "help", "assister", "assistance", "problème", "question", "comment"]
  };
  
  export default responses;