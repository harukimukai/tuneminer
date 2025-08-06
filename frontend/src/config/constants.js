// API Base URL (バックエンドのURL)
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3500'

// Client Base URL (フロントエンドのURL)
export const CLIENT_BASE_URL = process.env.REACT_APP_CLIENT_BASE_URL || 'http://localhost:3000'

// 開発環境での設定確認用ログ
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 Environment Configuration:')
  console.log('   API_BASE_URL:', API_BASE_URL)
  console.log('   CLIENT_BASE_URL:', CLIENT_BASE_URL)
  console.log('   NODE_ENV:', process.env.NODE_ENV)
}

// よく使う API エンドポイント
export const API_ENDPOINTS = {
  SONGS: `${API_BASE_URL}/songs`,
  USERS: `${API_BASE_URL}/users`,
  PLAYLISTS: `${API_BASE_URL}/playlists`,
  UPLOAD: `${API_BASE_URL}/upload`,
  AUTH: `${API_BASE_URL}/auth`
}

// 共有用URL生成ヘルパー
export const generateShareUrl = (path) => `${CLIENT_BASE_URL}${path}`

// 画像URL生成ヘルパー
export const generateImageUrl = (filename) => `${API_BASE_URL}/${filename}`