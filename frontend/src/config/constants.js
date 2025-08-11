// API Base URL (バックエンドのURL)
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3500'

// Client Base URL (フロントエンドのURL)
export const CLIENT_BASE_URL = process.env.REACT_APP_CLIENT_BASE_URL || 'http://localhost:3000'

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