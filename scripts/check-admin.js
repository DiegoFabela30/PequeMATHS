#!/usr/bin/env node
/**
 * Script CLI para verificar si un usuario tiene el rol de administrador en Firebase.
 * Se ejecuta desde la terminal así:
 * 
 *    node check-admin.js <UID>
 * 
 * Este script:
 * - Carga las variables de .env.local
 * - Construye un service account
 * - Inicializa Firebase Admin SDK
 * - Busca un usuario por UID
 * - Verifica si tiene el claim "admin: true"
 */

// Importación del Admin SDK para gestionar usuarios en Firebase
// eslint-disable-next-line @typescript-eslint/no-require-imports
const admin = require('firebase-admin');
// Librerías para leer el archivo .env.local manualmente
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// Construye la ruta del archivo .env.local (un nivel arriba)
const envPath = path.join(__dirname, '..', '.env.local');

// Verifica que .env.local exista
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local no encontrado');
  process.exit(1);
}

// Lee el archivo .env.local completamente
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};

// Convierte cada línea del archivo en una key-value pair
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key) {
      let value = valueParts.join('=').trim();

      // Quita comillas si existen
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Sustituye saltos de línea escapados \n por saltos reales
      value = value.replace(/\\n/g, '\n');

      env[key.trim()] = value;
    }
  }
});

// Construye manualmente un objeto "serviceAccount" desde las variables .env.local
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

// Valida que existan las variables mínimas necesarias
if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
  console.error('Error: Faltan variables de entorno en .env.local');
  console.error('Se necesitan: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL');
  process.exit(1);
}

try {
  // Inicializa Firebase Admin con el service account generado
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  // Obtiene el UID pasado por línea de comandos
  const uid = process.argv[2];

  if (!uid) {
    console.error('Usage: node check-admin.js <UID>');
    process.exit(1);
  }

  // Obtiene el usuario desde Firebase Authentication
  admin.auth().getUser(uid)
    .then(userRecord => {
      console.log('\n✅ Usuario encontrado:');
      console.log('   UID:', userRecord.uid);
      console.log('   Email:', userRecord.email);
      console.log('   Nombre:', userRecord.displayName || 'N/A');
      console.log('   Custom Claims:', userRecord.customClaims || 'Ninguno');
      
      // Determina si el usuario tiene rol admin
      if (userRecord.customClaims?.admin === true) {
        console.log('\n✅ El usuario ES administrador');
      } else {
        console.log('\n❌ El usuario NO es administrador');
      }
    })
    .catch(error => {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    })
    .finally(() => {
      // Asegura salida del proceso sin importar qué pase
      process.exit(0);
    });
} catch (error) {
  console.error('Error inicializando Firebase:', error.message);
  process.exit(1);
}
