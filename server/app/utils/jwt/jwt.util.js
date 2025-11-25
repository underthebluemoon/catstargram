/**
 * @file app/utils/jwt/jwt.util.js
 * @description jwt utility
 * 251125 mastercat init
 */

import jwt from 'jsonwebtoken';

// ---------------------
// ||     private     ||
// ---------------------
/**
 * 
 * @param {{*}} payload 
 * @param {number} ttl - time to limit 유효시간 설정용
 * @returns {string} JWT
 */
function generateToken(payload, ttl) {
  // 옵션 설정
  const options = {
    algorithm: process.env.JWT_ALGORITHM,
    noTimestamp: false,  // payload.iat 설정 (iat = issued_at: 토큰 발급 시간)
    expiresIn: ttl,  // payload.exp 설정 (토큰 만료 시간, 밀리초)
    issuer: process.env.JWT_ISSUER,  // payload.iss 설정 (토큰 발급자)
  }
  return jwt.sign(payload, process.env.JWT_SECRET, options)
}

// --------------------
// ||     public     ||
// --------------------
/**
 * 엑세스 토큰 생성
 * @param {import('../../models/index.js').User} user - user model
 * @returns {string} JWT
 */
function generateAccessToken(user) {
  // 페이로드 설정 -> payload : 서버가 JWT 토큰 안에 담고 싶은 데이터
  const payload = {
    sub: user.id,    // payload.sub set (value: user pk)
    role: user.role  // payload.role set (value: user role)
  }

  // 엑세스 토큰 생성
  return generateToken(payload, parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRY))
}

/**
 * 리프레쉬 토큰 생성
 * @param {import('../../models/index.js').User} user - user model
 * @returns {string} JWT
 */
function generateRefreshToken(user) {
  // 페이로드 설정
  const payload = {
    sub: user.id,    // payload.sub set (value: user pk)
  }

  // 리프레쉬 토큰 생성
  return generateToken(payload, parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY))
}

export default {
  generateAccessToken,
  generateRefreshToken,
}
