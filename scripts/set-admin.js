/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * SCRIPT: set-admin.js
 * ----------------------------------------------------------
 * Este script asigna el rol de administrador a un usuario 
 * en Firebase Authentication usando Firebase Admin SDK.
 *
 *    <UID> = UID del usuario al que deseas asignar admin.
 */

// Importación de dependencias (require porque es un script Node)
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

/* ----------------------------------------------------------
   1. CARGAR VARIABLES DESDE .env.local
   ----------------------------------------------------------
   Firebase Admin requiere credenciales. Estas se obtienen del
   archivo .env.local que contiene FIREBASE_PROJECT_ID,
   FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, etc.
----------------------------------------------------------- */

const envPath = path.join(__dirname, "..", ".env.local");

// Verifica que exista el archivo .env.local
if (!fs.existsSync(envPath)) {
  console.error("❌ Error: .env.local no encontrado");
  process.exit(1);
}

// Lee el contenido del archivo .env.local
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};

// Procesa cada línea para obtener las variables
envContent.split("\n").forEach((line) => {
  if (line && !line.startsWith("#")) {
    const [key, ...valueParts] = line.split("=");
    if (key) {
      let value = valueParts.join("=").trim();

      // Elimina comillas si existen
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      // Convierte saltos de línea escapados (\n) en saltos reales
      value = value.replace(/\\n/g, "\n");

      env[key.trim()] = value;
    }
  }
});

/* ----------------------------------------------------------
   2. CREAR OBJETO DE SERVICE ACCOUNT PARA FIREBASE ADMIN
----------------------------------------------------------- */
const serviceAccount = {
  type: "service_account",
  project_id: env.FIREBASE_PROJECT_ID,
  private_key_id: env.FIREBASE_PRIVATE_KEY_ID,
  private_key: env.FIREBASE_PRIVATE_KEY,
  client_email: env.FIREBASE_CLIENT_EMAIL,
  client_id: env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
};

// Verifica que existan las variables mínimas necesarias
if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
  console.error("❌ Error: Faltan variables en .env.local");
  console.error("Necesarias: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL");
  process.exit(1);
}

/* ----------------------------------------------------------
   3. OBTENER UID DESDE ARGUMENTOS
----------------------------------------------------------- */

const uid = process.argv[2];

if (!uid) {
  console.error("Uso: node scripts/set-admin.js <UID>");
  process.exit(1);
}

/* ----------------------------------------------------------
   4. INICIALIZAR FIREBASE ADMIN Y ASIGNAR ADMIN CLAIM
----------------------------------------------------------- */

try {
  // Inicialización de Firebase Admin
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  // Asignar custom claims (admin: true)
  admin
    .auth()
    .setCustomUserClaims(uid, { admin: true })
    .then(() => {
      console.log("✅ Admin claim asignado exitosamente a:", uid);
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Error al asignar admin claim:", err.message);
      process.exit(1);
    });
} catch (error) {
  console.error("❌ Error inicializando Firebase:", error.message);
  process.exit(1);
}
