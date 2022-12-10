importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

firebase.initializeApp({
  // databaseURL: '<your-database-URL>',
  projectId: 'secretsanta-f00c5',
  appId: '1:417223216458:web:2582d906d16ffb27d305b3',
  storageBucket: 'secretsanta-f00c5.appspot.com',
  apiKey: 'AIzaSyDt4FEyk_RosFCTxu5J-FWLzEs7nXmDnsc',
  authDomain: 'secretsanta-f00c5.firebaseapp.com',
  messagingSenderId: '417223216458',
});

messaging = firebase.messaging();