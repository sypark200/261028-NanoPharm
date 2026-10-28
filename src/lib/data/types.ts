import type { AppUser, Author, Category, Comment, Post, PostInput, Role } from '../../types'

/** 한 번에 불러오는 개수 (Firestore 읽기 횟수 절약) */
export const PAGE_SIZE = 20

/** "더 보기"에 쓰는 위치 표시. 구현마다 내용이 달라 바깥에서는 그대로 전달만 합니다. */
export type PageCursor = unknown

export interface Page<T> {
  items: T[]
  /** 다음 페이지가 없으면 null */
  nextCursor: PageCursor | null
}

export interface ListPostsOptions {
  category: Category
  tag?: string | null
  cursor?: PageCursor | null
}

export interface AuthUserInfo {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
}

/**
 * 데이터 접근 인터페이스.
 * Firebase 구현(firebaseRepo)과 샘플 데이터 구현(sampleRepo)이 이 모양을 똑같이 따릅니다.
 * 페이지 컴포넌트는 이 함수들만 사용하고 Firestore를 직접 호출하지 않습니다.
 */
export interface DataRepo {
  /** true면 저장·수정·삭제가 불가능한 읽기 전용 모드 */
  readonly readOnly: boolean

  // 인증
  onAuthChange(callback: (user: AuthUserInfo | null) => void): () => void
  signInWithGoogle(): Promise<void>
  signOut(): Promise<void>
  /** 회원 문서를 읽고, 없으면 pending으로 새로 만듭니다 */
  ensureUserProfile(user: AuthUserInfo): Promise<AppUser>

  // 게시글
  listPosts(options: ListPostsOptions): Promise<Page<Post>>
  getPost(id: string): Promise<Post | null>
  createPost(input: PostInput, author: Author): Promise<string>
  updatePost(id: string, input: PostInput): Promise<void>
  deletePost(id: string): Promise<void>

  // 댓글
  listComments(postId: string, cursor?: PageCursor | null): Promise<Page<Comment>>
  addComment(postId: string, body: string, author: Author): Promise<void>
  updateComment(postId: string, commentId: string, body: string): Promise<void>
  deleteComment(postId: string, commentId: string): Promise<void>

  // 회원 관리 (admin)
  listUsersByRole(role: Role): Promise<AppUser[]>
  setUserRole(uid: string, role: Role): Promise<void>
}

export class ReadOnlyError extends Error {
  constructor() {
    super('Firebase 미설정 모드에서는 저장·수정·삭제를 할 수 없습니다.')
    this.name = 'ReadOnlyError'
  }
}
