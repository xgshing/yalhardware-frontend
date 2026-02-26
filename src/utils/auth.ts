/**
 * 认证令牌管理工具函数
 * 提供 Token 的存储、获取和清除功能
 */
// src/utils/auth.ts
const ACCESS_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'

export function setToken(access: string, refresh: string) {
  // 存储访问令牌到localStorage， 键名：“access_token”
  localStorage.setItem(ACCESS_KEY, access)
  // 存储刷新令牌，键名"refresh_token"
  localStorage.setItem(REFRESH_KEY, refresh)
}

export function getAccessToken() {
  // 从 localStorage 获取访问令牌
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function clearToken() {
  // 移除访问令牌
  localStorage.removeItem(ACCESS_KEY)
  // 移除刷新令牌
  localStorage.removeItem(REFRESH_KEY)
}
