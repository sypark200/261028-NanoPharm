import type { Category } from '../types'

export interface CategoryInfo {
  label: string
  path: string
  description: string
  /** 이 종류의 글을 member도 쓸 수 있는지 (false면 admin만) */
  memberCanWrite: boolean
}

export const CATEGORIES: Record<Category, CategoryInfo> = {
  research: {
    label: '연구',
    path: '/research',
    description: '연구실의 연구 결과와 진행 상황을 공유합니다.',
    memberCanWrite: false,
  },
  lecture: {
    label: '수업자료',
    path: '/lectures',
    description: '강의 자료와 과제 안내를 과목별로 모았습니다.',
    memberCanWrite: false,
  },
  discussion: {
    label: '토론',
    path: '/discussions',
    description: '논문, 실험, 연구 아이디어에 대해 자유롭게 이야기합니다.',
    memberCanWrite: true,
  },
}

export const CATEGORY_ORDER: Category[] = ['research', 'lecture', 'discussion']

export function postPath(category: Category, id: string) {
  return `${CATEGORIES[category].path}/${id}`
}

export function isCategory(value: unknown): value is Category {
  return value === 'research' || value === 'lecture' || value === 'discussion'
}
