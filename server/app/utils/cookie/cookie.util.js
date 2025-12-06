/**
 * @file app/utils/cookie/cookie.util.js
 * @description cookie utility
 * 251125 v1.0.0 mastercat init
 */

import dayjs from "dayjs";

// ---------------------
// ||     private     ||
// ---------------------
/**
 * 쿠키 설정
 * @param {Import("express").Response} res 
 * @param {string} cookieName 
 * @param {string} cookieValue 
 * @param {number} ttl - time to live 활성시간
 * @param {boolean} httpOnlyFlg - default = true : client JS에서 접근불가
 * @param {boolean} secureFlg - default = flase : http 환경 / true : https 환경
 * @param {string|null} path
 */
function setCookie(res, cookieName, cookieValue, ttl, httpOnlyFlg = true, secureFlg = false, path = null) {
  const options = {
    expires: dayjs().add(ttl, 'second').toDate(),
    httpOnly: httpOnlyFlg,
    secure: secureFlg,
    sameSite: 'none'
  }

  if(path) {
    options.path = path;
  }

  res.cookie(cookieName, cookieValue, options);
}

/**
 * 쿠키 제거
 * @param {import("express").Response} res 
 * @param {string} cookieName 
 * @param {boolean} httpOnlyFlg 
 * @param {boolean} secureFlg 
 * @param {string|null} path
 */
function clearCookie(res, cookieName, httpOnlyFlg = true, secureFlg = false, path = null) {
  const options ={
    httpOnly: httpOnlyFlg,
    secure: secureFlg,
    sameSite: 'none',
  }

  if(path) {
    options.path = path;
  }

  res.clearCookie(cookieName, options);
}

/**
 * 특정 쿠키 획득(쿠키 미존재 시 빈문자열 반환)
 * @param {import('express').Request} req 
 * @param {string} cookieName 
 * @returns {string}
 */
function getCookie(req, cookieName) {
  let cookieValue = '';

  if(req.cookies) {
    // cookieName이 없는 경우, undefined → cookieValue = ''
    cookieValue = req.cookies[cookieName];
  }

  return cookieValue;
}

// --------------------
// ||     public     ||
// --------------------
/**
 * 쿠키에 RefreshToken 설정
 * @param {import("express").Response} res 
 * @param {string} refreshToken 
 */
function setCookieRefreshToken(res, refreshToken) {
  setCookie(
    res,
    process.env.JWT_REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    parseInt(process.env.JWT_REFRESH_TOKEN_COOKIE_EXPIRY),
    true,
    true,
    process.env.JWT_REISS_URI
  )
}

/**
 * 쿠키에tj RefreshToken 획득
 * @param {import("express").Response} res 
 * @param {string} refreshToken 
 */
function getCookieRefreshToken(req) {

  return getCookie(req, process.env.JWT_REFRESH_TOKEN_COOKIE_NAME);
}

/**
 * 리프래시 토큰 쿠키 제거
 */
function clearCookieRefreshToken(res) {
  clearCookie(
    res,
    process.env.JWT_REFRESH_TOKEN_COOKIE_NAME,
    true,
    true,
    process.env.JWT_REISS_URI
  );
}

export default {
  setCookieRefreshToken,
  getCookieRefreshToken,
  clearCookieRefreshToken,
}