// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
// import { debug } from "console";
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const clientConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID
};

const serverConfig = {
    cookieName: process.env.AUTH_COOKIE_NAME!,
    cookieSignatureKeys: [process.env.AUTH_COOKIE_SIGNATURE_KEY_CURRENT!, process.env.AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS!],
    cookieSerializeOptions: {
        path: '/',
        httpOnly: true,
        secure: process.env.USE_SECURE_COOKIES === 'true',
        sameSite: 'lax' as const,
        maxAge: 12 * 60 * 60 * 24 // twelve days
    },
    serviceAccount: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!
    },
    debug: process.env.APP_DEBUG === 'true'
};

// Initialize Firebase
const app = initializeApp(clientConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db, serverConfig, clientConfig };
