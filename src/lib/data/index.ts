import { auth, configuredApiKey, db, isFirebaseConfigured } from '../firebase'
import { createFirebaseRepo } from './firebaseRepo'
import { createSampleRepo } from './sampleRepo'
import type { DataRepo } from './types'

export * from './types'
export { isFirebaseConfigured }

/**
 * 환경변수가 채워져 있으면 Firebase 구현을, 아니면 샘플 데이터 구현을 사용합니다.
 * 앱의 모든 화면은 이 객체를 통해서만 데이터를 읽고 씁니다.
 */
export const data: DataRepo =
  isFirebaseConfigured && auth && db ? createFirebaseRepo(auth, db) : createSampleRepo()

/** 화면에 보여줄 한국어 오류 문구 */
export function errorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code ?? ''
  const raw = err instanceof Error ? err.message : String(err)
  if (code === 'permission-denied') return '권한이 없습니다. 승인된 회원인지 확인하거나, Firestore 보안 규칙이 게시되었는지 확인해 주세요.'
  if (code === 'unavailable') return '서버에 연결할 수 없습니다. 인터넷 연결을 확인해 주세요.'
  if (code === 'failed-precondition' && raw.includes('index')) return `Firestore 색인(index)이 필요합니다. 아래 링크를 눌러 색인을 만든 뒤 몇 분 후 다시 시도해 주세요.\n${raw}`
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return '로그인 창이 닫혔습니다. 다시 시도해 주세요.'
  if (code === 'auth/api-key-not-valid' || code.startsWith('auth/api-key-not-valid') || code === 'auth/invalid-api-key')
    return (
      'Firebase API 키가 올바르지 않습니다. Netlify 환경변수 VITE_FIREBASE_API_KEY 값이 Firebase 콘솔의 apiKey와 똑같은지(AIza로 시작, 39글자) 확인한 뒤 다시 배포해 주세요. (README 9단계)\n' +
      `지금 사이트에 들어간 값: ${JSON.stringify(configuredApiKey)} (${configuredApiKey.length}글자)`
    )
  if (code === 'auth/unauthorized-domain') return '이 주소는 Firebase 로그인 승인 도메인에 등록되어 있지 않습니다. README의 6단계를 확인해 주세요.'
  if (code === 'auth/configuration-not-found' || code === 'auth/operation-not-allowed') return 'Firebase에서 Google 로그인이 켜져 있지 않습니다. README의 5단계를 확인해 주세요.'
  return raw || '알 수 없는 오류가 발생했습니다.'
}
