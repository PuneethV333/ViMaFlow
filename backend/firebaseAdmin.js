const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); 

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Firebase Admin initialized successfully');
}

module.exports = admin;