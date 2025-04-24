# Étape 1 : Utiliser une image Node
FROM node:18

# Créer un dossier de travail
WORKDIR /app

# Copier uniquement les fichiers package.json (et lock)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Exposer le port utilisé par le backend
EXPOSE 4000

# Lancer le serveur
CMD ["npm", "start"]
