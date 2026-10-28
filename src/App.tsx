import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { RequireRole } from './components/RequireRole'
import { ScrollToTop } from './components/ScrollToTop'
import { AuthProvider } from './hooks/useAuth'
import { CATEGORIES, CATEGORY_ORDER } from './lib/categories'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { MembersPage } from './pages/MembersPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PendingPage } from './pages/PendingPage'
import { PostDetailPage } from './pages/PostDetailPage'
import { PostEditorPage } from './pages/PostEditorPage'
import { PostListPage } from './pages/PostListPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            {/* 누구나 볼 수 있는 화면 */}
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="pending" element={<PendingPage />} />

            {/* 승인된 회원(member, admin)만 볼 수 있는 화면 */}
            {CATEGORY_ORDER.map((c) => (
              <Route key={c} path={CATEGORIES[c].path.slice(1)}>
                <Route index element={<RequireRole><PostListPage key={c} category={c} /></RequireRole>} />
                <Route path=":id" element={<RequireRole><PostDetailPage category={c} /></RequireRole>} />
              </Route>
            ))}
            <Route path="posts/new" element={<RequireRole><PostEditorPage /></RequireRole>} />
            <Route path="posts/:id/edit" element={<RequireRole><PostEditorPage /></RequireRole>} />

            {/* 관리자(교수)만 볼 수 있는 화면 */}
            <Route path="admin/members" element={<RequireRole adminOnly><MembersPage /></RequireRole>} />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
