import { data } from '../lib/data'

/** 미설정 모드에서 쓰기 기능이 꺼져 있음을 알려주는 작은 안내 */
export function ReadOnlyNotice({ what = '저장' }: { what?: string }) {
  if (!data.readOnly) return null
  return <p className="text-xs text-amber-700">Firebase 미설정 모드에서는 {what}할 수 없습니다.</p>
}
