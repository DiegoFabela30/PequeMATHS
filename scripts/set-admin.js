/**
 * Script para asignar admin claim a un usuario.
 * Usage: node scripts/set-admin.js <UID>
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Cargar variables desde .env.local
const envPath = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local no encontrado');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};

envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key) {
      let value = valueParts.join('=').trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      // Replace escaped newlines
      value = value.replace(/\\n/g, '\n');
      env[key.trim()] = value;
    }
  }
});

const serviceAccount = {
  type: 'service_account',
  project_id: env.FIREBASE_PROJECT_ID,
  private_key_id: env.FIREBASE_PRIVATE_KEY_ID,
  private_key: env.FIREBASE_PRIVATE_KEY,
  client_email: env.FIREBASE_CLIENT_EMAIL,
  client_id: env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
};

if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
  console.error('Error: Faltan variables de entorno en .env.local');
  console.error('Se necesitan: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL');
  process.exit(1);
}

const uid = process.argv[2];

if (!uid) {
  console.error('Usage: node scripts/set-admin.js <UID>');
  process.exit(1);
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  admin.auth().setCustomUserClaims(uid, { admin: true })
    .then(() => {
      console.log('✅ Admin claim asignado a:', uid);
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
} catch (error) {
  console.error('Error inicializando Firebase:', error.message);
  process.exit(1);
}
