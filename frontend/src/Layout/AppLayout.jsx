import { useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import GlobalAudioPlayer from '../features/player/GlobalAudioPlayer'
import { useSelector } from 'react-redux'
import { selectAuthChecked } from '../features/auth/authSlice'
import LoadingScreen from '../components/LoadingScreen'

const AppLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const checked = useSelector(selectAuthChecked)

  if (!checked) {
    return <LoadingScreen />
  }

  return (
    <>
      <Header />
      {/* ハンバーガーボタン */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="p-2 text-white bg-black fixed top-2 left-2 z-50"
      >
        {/* 3本線アイコン */}
        <div className="space-y-1">
          <span className="block w-6 h-0.5 bg-white" />
          <span className="block w-6 h-0.5 bg-white" />
          <span className="block w-6 h-0.5 bg-white" />
        </div>
      </button>

      {/* サイドバー */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="pt-[195px] pl-[15px]">
        <Outlet/>
        <GlobalAudioPlayer /> {/* ←これが必要 */}
      </main>
    </>
  )
}

export default AppLayout