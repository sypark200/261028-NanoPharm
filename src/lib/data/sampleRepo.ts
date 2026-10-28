import { PAGE_SIZE, ReadOnlyError, type DataRepo, type Page } from './types'
import { sampleComments, samplePosts, sampleUsers } from './sampleData'

/** 샘플 데이터 모드에서 쓰는 가상의 보기 전용 사용자 (모든 화면을 둘러볼 수 있도록 admin 권한) */
export const SAMPLE_VIEWER = {
  uid: 'sample-viewer',
  displayName: '미리보기 사용자',
  email: '',
  photoURL: null,
}

function paginate<T>(all: T[], cursor: unknown): Page<T> {
  const start = typeof cursor === 'number' ? cursor : 0
  const end = start + PAGE_SIZE
  return { items: all.slice(start, end), nextCursor: end < all.length ? end : null }
}

// 실제 네트워크처럼 로딩 화면이 잠깐 보이도록 약간 지연
const delay = () => new Promise((r) => setTimeout(r, 200))

const readOnly = async (): Promise<never> => {
  throw new ReadOnlyError()
}

export function createSampleRepo(): DataRepo {
  return {
    readOnly: true,

    onAuthChange(callback) {
      callback(SAMPLE_VIEWER)
      return () => {}
    },
    signInWithGoogle: readOnly,
    signOut: readOnly,
    async ensureUserProfile(user) {
      return { ...user, role: 'admin', createdAt: null }
    },

    async listPosts({ category, tag, cursor }) {
      await delay()
      const filtered = samplePosts
        .filter((p) => p.category === category && (!tag || p.tags.includes(tag)))
        .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
      return paginate(filtered, cursor)
    },
    async getPost(id) {
      await delay()
      return samplePosts.find((p) => p.id === id) ?? null
    },
    createPost: readOnly,
    updatePost: readOnly,
    deletePost: readOnly,

    async listComments(postId, cursor) {
      await delay()
      return paginate(sampleComments[postId] ?? [], cursor)
    },
    addComment: readOnly,
    updateComment: readOnly,
    deleteComment: readOnly,

    async listUsersByRole(role) {
      await delay()
      return sampleUsers.filter((u) => u.role === role)
    },
    setUserRole: readOnly,
  }
}
