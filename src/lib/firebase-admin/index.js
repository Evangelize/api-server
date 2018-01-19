import settings from '../../../config';
import * as admin from 'firebase-admin';

const serviceAccount = require(settings.firebase.serviceAccount);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: settings.firebase.databaseURL,
});

export const getUser = async (uid) => {
  const result = await admin.auth().getUser(uid);
  return result;
};
