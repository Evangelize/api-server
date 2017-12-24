const config = require('../../../config/settings.json');
import firebase from 'firebase';

firebase.initializeApp(config.firebase);

export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
export const anonymousAuthenticate = () => firebase.auth().signInAnonymously();
export const googleAuthenticate = () => firebase.auth().signInWithPopup(googleProvider);
export const facebookAuthenticate = () => firebase.auth().signInWithPopup(facebookProvider);
export const currentUser = () => firebase.auth().currentUser;
export const fetchProvidersForEmail = (email) => firebase.auth().fetchProvidersForEmail(email);