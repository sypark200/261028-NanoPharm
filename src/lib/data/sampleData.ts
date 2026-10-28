import type { AppUser, Comment, Post } from '../../types'

/**
 * Firebase 미설정 모드에서 보여주는 샘플 데이터입니다.
 * 실제 Firebase를 연결하면 이 내용은 사용되지 않습니다.
 */

const day = (n: number) => new Date(Date.UTC(2026, 8, 1 + n, 1, 0, 0))

export const sampleUsers: AppUser[] = [
  { uid: 'prof', displayName: '홍길동 교수', email: 'professor@example.ac.kr', photoURL: null, role: 'admin', createdAt: day(0) },
  { uid: 'stu1', displayName: '김연구', email: 'student1@example.ac.kr', photoURL: null, role: 'member', createdAt: day(2) },
  { uid: 'stu2', displayName: '이제형', email: 'student2@example.ac.kr', photoURL: null, role: 'member', createdAt: day(3) },
  { uid: 'stu3', displayName: '박신입', email: 'newbie@example.ac.kr', photoURL: null, role: 'pending', createdAt: day(40) },
]

const base: Post[] = [
  {
    id: 'r1',
    category: 'research',
    title: 'LNP 조성에 따른 간 외 조직 전달 효율 비교',
    body: `## 요약\n\n이온화 지질의 **pKa**와 PEG-지질 비율을 바꿔 가며 간 외 조직(비장, 폐)으로의 mRNA 전달 효율을 비교했습니다.\n\n## 주요 결과\n\n1. PEG-지질 1.5 mol%에서 비장 발현이 가장 높았습니다.\n2. 입자 크기는 80–100 nm 범위에서 유지되었습니다.\n3. 봉입률은 모든 조성에서 90% 이상이었습니다.\n\n| 조성 | 크기 (nm) | PDI | 봉입률 |\n|---|---|---|---|\n| A | 84 | 0.11 | 94% |\n| B | 97 | 0.14 | 91% |\n\n> 다음 단계로 동물 모델에서 체내 분포를 확인할 예정입니다.`,
    tags: ['LNP', 'mRNA'],
    links: [{ label: '실험 데이터 (Google Drive)', url: 'https://drive.google.com/' }],
    authorUid: 'prof',
    authorName: '홍길동 교수',
    createdAt: day(30),
    updatedAt: day(31),
    commentCount: 2,
  },
  {
    id: 'r2',
    category: 'research',
    title: 'PLGA 마이크로스피어의 초기 방출 억제 전략',
    body: `PLGA 마이크로스피어에서 나타나는 **초기 과다 방출(burst release)**을 줄이기 위해 이중 유화법 조건을 정리했습니다.\n\n- 내수상 부피 감소\n- 고분자 농도 증가\n- 경화 단계 온도 조절\n\n자세한 조건은 첨부 문서를 참고하세요.`,
    tags: ['PLGA', '서방형'],
    links: [{ label: '조건 정리표 (OneDrive)', url: 'https://onedrive.live.com/' }],
    authorUid: 'prof',
    authorName: '홍길동 교수',
    createdAt: day(20),
    updatedAt: day(20),
    commentCount: 0,
  },
  {
    id: 'r3',
    category: 'research',
    title: '2026년 상반기 연구 성과 정리',
    body: '논문 게재, 학회 발표, 특허 출원 현황을 정리했습니다.\n\n- 논문 3편 게재\n- 국내 학회 발표 4건\n- 특허 출원 1건',
    tags: ['성과'],
    links: [],
    authorUid: 'prof',
    authorName: '홍길동 교수',
    createdAt: day(5),
    updatedAt: day(5),
    commentCount: 0,
  },
  {
    id: 'l1',
    category: 'lecture',
    title: '[약제학] 3주차 — 용해와 용출',
    body: '## 학습 목표\n\n- Noyes–Whitney 식을 이해한다\n- 용출 시험법의 종류를 비교한다\n\n강의 슬라이드는 아래 링크에서 받을 수 있습니다.',
    tags: ['약제학'],
    links: [
      { label: '강의 슬라이드 (PDF)', url: 'https://drive.google.com/' },
      { label: '과제 안내', url: 'https://drive.google.com/' },
    ],
    authorUid: 'prof',
    authorName: '홍길동 교수',
    createdAt: day(28),
    updatedAt: day(28),
    commentCount: 1,
  },
  {
    id: 'l2',
    category: 'lecture',
    title: '[약제학] 2주차 — 제형 설계의 기초',
    body: '제형 설계 시 고려해야 할 약물의 물리화학적 성질을 다룹니다.',
    tags: ['약제학'],
    links: [{ label: '강의 슬라이드', url: 'https://drive.google.com/' }],
    authorUid: 'prof',
    authorName: '홍길동 교수',
    createdAt: day(21),
    updatedAt: day(21),
    commentCount: 0,
  },
  {
    id: 'l3',
    category: 'lecture',
    title: '[물리약학] 계면활성제와 미셀',
    body: '임계 미셀 농도(CMC)와 HLB 값의 의미를 정리합니다.\n\nHLB 계산 예제는 슬라이드 12쪽에 있습니다.',
    tags: ['물리약학'],
    links: [{ label: '강의 슬라이드', url: 'https://onedrive.live.com/' }],
    authorUid: 'prof',
    authorName: '홍길동 교수',
    createdAt: day(25),
    updatedAt: day(25),
    commentCount: 0,
  },
  {
    id: 'l4',
    category: 'lecture',
    title: '[생물약제학] 약물동태학 기초 — 1구획 모델',
    body: '1구획 모델에서 정맥주사 후 혈중농도 곡선을 해석합니다.',
    tags: ['생물약제학'],
    links: [{ label: '강의 노트', url: 'https://drive.google.com/' }],
    authorUid: 'prof',
    authorName: '홍길동 교수',
    createdAt: day(18),
    updatedAt: day(18),
    commentCount: 0,
  },
  {
    id: 'l5',
    category: 'lecture',
    title: '[대학원 세미나] 발표 순서와 평가 기준',
    body: '이번 학기 세미나 발표 순서와 평가 기준을 안내합니다.',
    tags: ['대학원 세미나'],
    links: [],
    authorUid: 'prof',
    authorName: '홍길동 교수',
    createdAt: day(3),
    updatedAt: day(3),
    commentCount: 0,
  },
  {
    id: 'd1',
    category: 'discussion',
    title: '이번 주 저널클럽 논문: 이온화 지질 설계 리뷰',
    body: '이번 주에는 이온화 지질 구조와 엔도솜 탈출에 관한 리뷰 논문을 읽습니다.\n\n궁금한 점이나 토론 주제를 댓글로 남겨 주세요.',
    tags: ['저널클럽'],
    links: [{ label: '논문 링크', url: 'https://doi.org/' }],
    authorUid: 'stu1',
    authorName: '김연구',
    createdAt: day(35),
    updatedAt: day(35),
    commentCount: 3,
  },
]

// "더 보기" 버튼을 확인할 수 있도록 토론 글을 넉넉히 만듭니다
const extraDiscussions: Post[] = Array.from({ length: 22 }, (_, i) => ({
  id: `d${i + 2}`,
  category: 'discussion' as const,
  title: `실험 노트 공유 #${22 - i}`,
  body: `샘플 토론 글입니다. (${22 - i}번째)\n\n- 실험 조건\n- 관찰 결과\n- 다음 계획`,
  tags: i % 3 === 0 ? ['실험'] : ['질문'],
  links: [],
  authorUid: i % 2 === 0 ? 'stu1' : 'stu2',
  authorName: i % 2 === 0 ? '김연구' : '이제형',
  createdAt: day(34 - i),
  updatedAt: day(34 - i),
  commentCount: 0,
}))

export const samplePosts: Post[] = [...base, ...extraDiscussions]

export const sampleComments: Record<string, Comment[]> = {
  r1: [
    { id: 'c1', body: 'PEG 비율 1.5%일 때 혈중 반감기도 함께 확인해 보면 좋겠습니다.', authorUid: 'stu2', authorName: '이제형', createdAt: day(31) },
    { id: 'c2', body: '좋은 지적입니다. 다음 실험에 추가하겠습니다.', authorUid: 'prof', authorName: '홍길동 교수', createdAt: day(32) },
  ],
  l1: [
    { id: 'c3', body: '과제 제출 기한이 언제인가요?', authorUid: 'stu1', authorName: '김연구', createdAt: day(29) },
  ],
  d1: [
    { id: 'c4', body: 'Figure 3의 엔도솜 탈출 효율 측정 방법이 궁금합니다.', authorUid: 'stu2', authorName: '이제형', createdAt: day(35) },
    { id: 'c5', body: 'Galectin-8 리포터를 쓴 것 같아요. 방법 섹션에 나옵니다.', authorUid: 'stu1', authorName: '김연구', createdAt: day(36) },
    { id: 'c6', body: '발표 때 이 부분을 같이 짚어 봅시다.', authorUid: 'prof', authorName: '홍길동 교수', createdAt: day(36) },
  ],
}
