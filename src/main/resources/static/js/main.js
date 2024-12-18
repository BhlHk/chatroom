'use strict'; // 'strict' mode (aucune traduction directe)

var usernamePage = document.querySelector('#username-page');
// var usernamePage = document.querySelector('#page-nom-utilisateur');

var chatPage = document.querySelector('#chat-page');
// var chatPage = document.querySelector('#page-discussion');

var usernameForm = document.querySelector('#usernameForm');
// var usernameForm = document.querySelector('#formulaire-nom-utilisateur');

var messageForm = document.querySelector('#messageForm');
// var messageForm = document.querySelector('#formulaire-message');

var messageInput = document.querySelector('#message');
// var messageInput = document.querySelector('#champ-message');

var messageArea = document.querySelector('#messageArea');
// var messageArea = document.querySelector('#zone-messages');

var connectingElement = document.querySelector('.connecting');
// var connectingElement = document.querySelector('.connexion-en-cours');

var stompClient = null; // le client STOMP est nul au départ
var username = null; // le nom d'utilisateur est nul au départ

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];
// Les couleurs pour les avatars des utilisateurs

function connect(event) {
    username = document.querySelector('#name').value.trim();
    // Récupérer le nom d'utilisateur saisi

    if (username) {
        usernamePage.classList.add('hidden');
        // Masquer la page du nom d'utilisateur

        chatPage.classList.remove('hidden');
        // Afficher la page de discussion

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        // Configurer la connexion WebSocket via SockJS

        stompClient.connect({}, onConnected, onError);
        // Essayer de se connecter
    }
    event.preventDefault();
}

function onConnected() {
    stompClient.subscribe('/topic/chat', onMessageReceived);
    // S'abonner au sujet "/topic/chat" pour recevoir des messages

    stompClient.send("/app/chat.addUser", {}, JSON.stringify({sender: username, type: 'JOIN'}));
    // Envoyer un message pour indiquer qu'un utilisateur a rejoint le chat

    connectingElement.classList.add('hidden');
    // Masquer l'indicateur "connexion en cours"
    fetchOldMessages();
}

function onError(error) {
    connectingElement.textContent = 'Impossible de se connecter. Veuillez réessayer';
    // Afficher un message d'erreur en cas d'échec de connexion

    connectingElement.style.color = 'red';
    // Changer la couleur de l'indicateur en rouge
}

function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    // Récupérer le contenu du message saisi

    if (messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        // Créer un objet message contenant le nom d'utilisateur et le texte

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        // Envoyer le message au serveur

        messageInput.value = '';
        // Réinitialiser le champ de saisie
    }
    event.preventDefault();
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    // Décoder le message reçu

    var messageElement = document.createElement('li');
    // Créer un élément pour afficher le message

    if (message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' a rejoint !';
        // Indiquer qu'un utilisateur a rejoint la discussion
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' a quitté !';
        // Indiquer qu'un utilisateur a quitté la discussion
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);
        // Générer l'avatar avec une couleur unique

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    // Ajouter le message à la zone des messages

    messageArea.scrollTop = messageArea.scrollHeight;
    // Faire défiler automatiquement vers le bas
}

function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    // Associer une couleur unique à chaque utilisateur
    return colors[index];
}

function fetchOldMessages() {
    // Vérifiez si déjà abonné pour éviter des abonnements multiples
    if (!stompClient.subscribedToOldMessages) {
        stompClient.subscribe('/topic/chat.oldMessages', function(payload) {
            var messages = JSON.parse(payload.body);
            messages.forEach(function(message) {
                displayOldMessage(message);
            });
        });
        stompClient.subscribedToOldMessages = true; // Ajoutez une propriété pour marquer l'abonnement
    }

    // Envoyer une demande pour récupérer les anciens messages
    stompClient.send("/app/chat.getOldMessages", {}, JSON.stringify({
        sender: username,
        type: 'EXISTING_USER'
    }));
}


// Réutilisez la fonction displayOldMessage que vous aviez précédemment
function displayOldMessage(message) {
    var messageElement = document.createElement('li');
    messageElement.classList.add('chat-message');

    var avatarElement = document.createElement('i');
    var avatarText = document.createTextNode(message.sender[0]);
    avatarElement.appendChild(avatarText);
    avatarElement.style['background-color'] = getAvatarColor(message.sender);
    messageElement.appendChild(avatarElement);

    var usernameElement = document.createElement('span');
    var usernameText = document.createTextNode(message.sender);
    usernameElement.appendChild(usernameText);
    messageElement.appendChild(usernameElement);

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);
    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


// Ajouter des écouteurs pour les formulaires
usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);



