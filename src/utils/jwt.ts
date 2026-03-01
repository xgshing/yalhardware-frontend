// utils/jwt.ts
/**
 * JWT 工具函数（生产可用版）
 */

export interface JwtPayload {
  exp?: number
  iat?: number
  [key: string]: any
}

function base64UrlDecode(str: string): string {
  // Base64URL 转 Base64
  str = str.replace(/-/g, '+').replace(/_/g, '/')

  // 补 padding
  const pad = str.length % 4
  if (pad) {
    str += '='.repeat(4 - pad)
  }

  return atob(str)
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')

    if (parts.length !== 3) return null

    const base64 = parts[1]
    if (!base64) return null

    const payload = base64UrlDecode(base64)
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJwt(token)
  if (!payload?.exp) return true

  const now = Date.now() / 1000
  return payload.exp < now
}

export function isTokenExpiringSoon(
  token: string,
  thresholdSeconds = 60
): boolean {
  const payload = parseJwt(token)
  if (!payload?.exp) return true

  const now = Date.now() / 1000
  return payload.exp - now < thresholdSeconds
}
