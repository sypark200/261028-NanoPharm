import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type Auth,
} from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type Firestore,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import type { AppUser, Comment, Post, PostLink, Role } from '../../types'
import { isCategory } from '../categories'
import { PAGE_SIZE, type DataRepo, type Page } from './types'

function toDate(value: unknown): Date | null {
  return value instanceof Timestamp ? value.toDate() : null
}

function toPost(snap: QueryDocumentSnapshot<DocumentData> | { id: string; data(): DocumentData }): Post {
  const d = snap.data()
  return {
    id: snap.id,
    category: isCategory(d.category) ? d.category : 'discussion',
    title: String(d.title ?? ''),
    body: String(d.body ?? ''),
    tags: Array.isArray(d.tags) ? d.tags.map(String) : [],
    links: Array.isArray(d.links)
      ? d.links.map((l: PostLink) => ({ label: String(l?.label ?? ''), url: String(l?.url ?? '') }))
      : [],
    authorUid: String(d.authorUid ?? ''),
    authorName: String(d.authorName ?? ''),
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
    commentCount: typeof d.commentCount === 'number' ? d.commentCount : 0,
  }
}

function toComment(snap: QueryDocumentSnapshot<DocumentData>): Comment {
  const d = snap.data()
  return {
    id: snap.id,
    body: String(d.body ?? ''),
    authorUid: String(d.authorUid ?? ''),
    authorName: String(d.authorName ?? ''),
    createdAt: toDate(d.createdAt),
  }
}

function toUser(uid: string, d: DocumentData): AppUser {
  const role: Role = d.role === 'admin' || d.role === 'member' ? d.role : 'pending'
  return {
    uid,
    displayName: String(d.displayName ?? ''),
    email: String(d.email ?? ''),
    photoURL: typeof d.photoURL === 'string' ? d.photoURL : null,
    role,
    createdAt: toDate(d.createdAt),
  }
}

function page<T>(docs: QueryDocumentSnapshot<DocumentData>[], map: (d: QueryDocumentSnapshot<DocumentData>) => T): Page<T> {
  return {
    items: docs.map(map),
    nextCursor: docs.length === PAGE_SIZE ? docs[docs.length - 1] : null,
  }
}

export function createFirebaseRepo(auth: Auth, db: Firestore): DataRepo {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  return {
    readOnly: false,

    onAuthChange(callback) {
      return onAuthStateChanged(auth, (u) => {
        callback(
          u
            ? {
                uid: u.uid,
                displayName: u.displayName ?? u.email ?? '이름 없음',
                email: u.email ?? '',
                photoURL: u.photoURL,
              }
            : null,
        )
      })
    },

    async signInWithGoogle() {
      try {
        await signInWithPopup(auth, provider)
      } catch (err) {
        const code = (err as { code?: string }).code
        // 팝업이 차단된 브라우저(일부 모바일 등)에서는 페이지 이동 방식으로 다시 시도
        if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
          await signInWithRedirect(auth, provider)
          return
        }
        throw err
      }
    },

    async signOut() {
      await firebaseSignOut(auth)
    },

    async ensureUserProfile(user) {
      const ref = doc(db, 'users', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) return toUser(user.uid, snap.data())
      await setDoc(ref, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'pending',
        createdAt: serverTimestamp(),
      })
      return { ...user, role: 'pending', createdAt: new Date() }
    },

    async listPosts({ category, tag, cursor }) {
      const constraints: QueryConstraint[] = [where('category', '==', category)]
      if (tag) constraints.push(where('tags', 'array-contains', tag))
      constraints.push(orderBy('createdAt', 'desc'))
      if (cursor) constraints.push(startAfter(cursor as QueryDocumentSnapshot))
      constraints.push(limit(PAGE_SIZE))
      const snap = await getDocs(query(collection(db, 'posts'), ...constraints))
      return page(snap.docs, toPost)
    },

    async getPost(id) {
      const snap = await getDoc(doc(db, 'posts', id))
      return snap.exists() ? toPost(snap) : null
    },

    async createPost(input, author) {
      const ref = doc(collection(db, 'posts'))
      await setDoc(ref, {
        ...input,
        authorUid: author.uid,
        authorName: author.name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        commentCount: 0,
      })
      return ref.id
    },

    async updatePost(id, input) {
      await updateDoc(doc(db, 'posts', id), { ...input, updatedAt: serverTimestamp() })
    },

    async deletePost(id) {
      // 댓글과 글을 함께 지웁니다. 보안 규칙상 글 작성자는 "글 삭제와 같은 묶음" 안에서만
      // 남의 댓글을 지울 수 있으므로, 마지막 묶음에 글 삭제를 넣습니다. (묶음당 최대 500건)
      const postRef = doc(db, 'posts', id)
      const comments = (await getDocs(collection(postRef, 'comments'))).docs
      const CHUNK = 450
      let i = 0
      do {
        const batch = writeBatch(db)
        comments.slice(i, i + CHUNK).forEach((c) => batch.delete(c.ref))
        i += CHUNK
        if (i >= comments.length) batch.delete(postRef)
        await batch.commit()
      } while (i < comments.length)
    },

    async listComments(postId, cursor) {
      const constraints: QueryConstraint[] = [orderBy('createdAt', 'asc')]
      if (cursor) constraints.push(startAfter(cursor as QueryDocumentSnapshot))
      constraints.push(limit(PAGE_SIZE))
      const snap = await getDocs(query(collection(db, 'posts', postId, 'comments'), ...constraints))
      return page(snap.docs, toComment)
    },

    async addComment(postId, body, author) {
      // 댓글 생성과 commentCount +1을 한 번에 처리 (보안 규칙이 둘이 함께 일어나는지 검사합니다)
      const postRef = doc(db, 'posts', postId)
      const commentRef = doc(collection(postRef, 'comments'))
      const batch = writeBatch(db)
      batch.set(commentRef, {
        body,
        authorUid: author.uid,
        authorName: author.name,
        createdAt: serverTimestamp(),
      })
      batch.update(postRef, { commentCount: increment(1) })
      await batch.commit()
    },

    async updateComment(postId, commentId, body) {
      await updateDoc(doc(db, 'posts', postId, 'comments', commentId), { body })
    },

    async deleteComment(postId, commentId) {
      const postRef = doc(db, 'posts', postId)
      const batch = writeBatch(db)
      batch.delete(doc(postRef, 'comments', commentId))
      batch.update(postRef, { commentCount: increment(-1) })
      await batch.commit()
    },

    async listUsersByRole(role) {
      const snap = await getDocs(query(collection(db, 'users'), where('role', '==', role)))
      return snap.docs
        .map((d) => toUser(d.id, d.data()))
        .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
    },

    async setUserRole(uid, role) {
      await updateDoc(doc(db, 'users', uid), { role })
    },
  }
}
