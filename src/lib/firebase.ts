import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

/**
 * Netlify 화면에 값을 붙여넣다 보면 따옴표, 끝의 쉼표, 공백, "apiKey:" 같은 이름이
 * 함께 들어가는 경우가 많아 이를 걷어냅니다. 예: `"AIza...",` → `AIza...`
 */
function clean(value: string | undefined): string | undefined {
  if (!value) return undefined
  const v = value
    .trim()
    .replace(/^[A-Za-z_]+\s*:\s*/, '')
    .replace(/[,;]+$/, '')
    .trim()
    .replace(/^["'`]+|["'`]+$/g, '')
    .trim()
  return v || undefined
}

const firebaseConfig = {
  apiKey: clean(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: clean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: clean(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: clean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: clean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: clean(import.meta.env.VITE_FIREBASE_APP_ID),
}

/**
 * 필수 환경변수 4개가 모두 채워져 있으면 실제 Firebase를 사용하고,
 * 하나라도 비어 있으면 "Firebase 미설정 모드"(샘플 데이터, 읽기 전용)로 동작합니다.
 */
/** 사이트에 실제로 들어간 API 키 (오류 안내에서 Firebase 콘솔 값과 비교하도록 보여줍니다) */
export const configuredApiKey = firebaseConfig.apiKey ?? ''

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId,
)

export const app: FirebaseApp | null = isFirebaseConfigured ? initializeApp(firebaseConfig) : null
export const auth: Auth | null = app ? getAuth(app) : null
export const db: Firestore | null = app ? getFirestore(app) : null
