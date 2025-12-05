/**
 * Configuración e inicialización del SDK de Firebase Admin.
 * 
 * Este archivo:
 *  - Carga las credenciales necesarias para Firebase Admin desde variables de entorno.
 *  - Inicializa la app de Firebase Admin solo una vez (evita inicializaciones duplicadas).
 *  - Expone:
 *      - adminAuth → para gestionar autenticación (usuarios, custom claims, tokens)
 *      - adminDb   → para acceder a Firestore desde el servidor
 */

import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// ================================================
// 1. Cargar credenciales desde variables de entorno
// ================================================

// ID del proyecto de Firebase
const projectId = process.env.FIREBASE_PROJECT_ID;

// Correo del cliente que accede al servicio (Service Account)
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

// La clave privada viene con "\n" escapados, así que deben restaurarse
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// ================================================
// 2. Inicializar Firebase Admin (solo una vez)
// ================================================

// Si la app ya está inicializada, úsala.
// Si no, inicialízala con las credenciales.
export const adminApp = getApps().length 
    ? getApps()[0]! // Reutiliza la instancia existente
    : initializeApp({
        credential:
            // Si tenemos claves manuales, usamos cert()
            privateKey && clientEmail
                ? cert({ projectId, clientEmail, privateKey })
                // Si no, usamos el Application Default (ej. desde Google Cloud)
                : applicationDefault()
    });

// ================================================
// 3. Clientes listos para usarse en el backend
// ================================================

// Manejo de usuarios, cookies de sesión, tokens y roles
export const adminAuth = getAuth(adminApp);

// Acceso a Firestore (solo desde backend)
export const adminDb = getFirestore();
