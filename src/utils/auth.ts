// utils/auth.ts
// ============================================================
// 双 Token 存储管理（生产级）
// 前后台完全隔离，互不影响
// ============================================================

const USER_ACCESS = 'user_access_token'
const USER_REFRESH = 'user_refresh_token'

const ADMIN_ACCESS = 'admin_access_token'
const ADMIN_REFRESH = 'admin_refresh_token'

/* ================= 普通用户 ================= */

// 保存普通用户 token
export function setUserToken(access: string, refresh: string) {
  localStorage.setItem(USER_ACCESS, access)
  localStorage.setItem(USER_REFRESH, refresh)
}

// 获取普通用户 access token
export function getUserAccessToken(): string | null {
  return localStorage.getItem(USER_ACCESS)
}

// 获取普通用户 refresh token
export function getUserRefreshToken(): string | null {
  return localStorage.getItem(USER_REFRESH)
}

// 清除普通用户 token
export function clearUserToken() {
  localStorage.removeItem(USER_ACCESS)
  localStorage.removeItem(USER_REFRESH)
}

/* ================= 管理员 ================= */

// 保存管理员 token
export function setAdminToken(access: string, refresh: string) {
  localStorage.setItem(ADMIN_ACCESS, access)
  localStorage.setItem(ADMIN_REFRESH, refresh)
}

// 获取管理员 access token
export function getAdminAccessToken(): string | null {
  return localStorage.getItem(ADMIN_ACCESS)
}

// 获取管理员 refresh token
export function getAdminRefreshToken(): string | null {
  return localStorage.getItem(ADMIN_REFRESH)
}

// 清除管理员 token
export function clearAdminToken() {
  localStorage.removeItem(ADMIN_ACCESS)
  localStorage.removeItem(ADMIN_REFRESH)
}
