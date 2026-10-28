/** 회원 권한: admin(교수), member(승인된 대학원생), pending(승인 대기) */
export type Role = 'admin' | 'member' | 'pending'

/** 게시글 종류: research(연구), lecture(수업자료), discussion(토론) */
export type Category = 'research' | 'lecture' | 'discussion'

/** users/{uid} 문서 */
export interface AppUser {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
  role: Role
  createdAt: Date | null
}

/** 게시글에 첨부하는 외부 링크 (Google Drive, OneDrive 등의 공유 링크) */
export interface PostLink {
  label: string
  url: string
}

/** posts/{postId} 문서 */
export interface Post {
  id: string
  category: Category
  title: string
  /** 마크다운 문자열 */
  body: string
  tags: string[]
  links: PostLink[]
  authorUid: string
  authorName: string
  createdAt: Date | null
  updatedAt: Date | null
  commentCount: number
}

/** 글 작성·수정 화면에서 입력받는 값 */
export interface PostInput {
  category: Category
  title: string
  body: string
  tags: string[]
  links: PostLink[]
}

/** posts/{postId}/comments/{commentId} 문서 */
export interface Comment {
  id: string
  body: string
  authorUid: string
  authorName: string
  createdAt: Date | null
}

/** 글·댓글 작성자 정보 */
export interface Author {
  uid: string
  name: string
}
