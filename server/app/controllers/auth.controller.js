/**
 * @file app/controllers/auth.controller.js
 * @description 인증 관련 컨트롤러
 * 251119 v1.0.0 mastercat
 */

import { REISSUE_ERROR, SUCCESS } from "../../configs/responseCode.config.js";
import myError from "../errors/customs/my.error.js";
import PROVIDER from "../middlewares/auth/configs/provider.enum.js";
import authService from "../services/auth.service.js";
import cookieUtil from "../utils/cookie/cookie.util.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";
import socialKakaoUtil from "../utils/social/social.kakao.util.js";

// ----------------------
// ||      public      ||
// ----------------------

/**
 * 로그인 컨트롤러 처리
 *          ↱ expree의 Request/Response/Next
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 */
async function login(req, res, next) {
  try {
    const body = req.body;  // 파라미터 획득
  
    // 로그인 서비스 호출
    const { accessToken, refreshToken, user } = await authService.login(body);

    // Cookie에 RefreshToken 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);
    
    //                                                                   ↱ data (refresh 누락)
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {accessToken, user}));
  } catch(error) {
    next(error);
  }
}

/**
 * 토큰 재발급 컨트롤러
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 */
async function reissue(req, res, next) {
  try {
    const token = cookieUtil.getCookieRefreshToken(req);

    // 토큰 존재 여부 확인
    if(!token) {
      throw myError('리프레시 토큰 없음', REISSUE_ERROR);
    }

    // 토큰 재발급 처리
    const { accessToken, refreshToken, user } = await authService.reissue(token);

    // 쿠키에 리프레시 토큰 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, { accessToken, user }))
  } catch(error) {
    return next(error)
  }

}

/**
 * 소셜 로그인 컨트롤러
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 */
async function social(req, res, next) {
  // client에서 받은 요청을 server에서 kakao로 보냄 → 응답 불필요
  try {
    const provider = req.params.provider.toUpperCase();
    
    let url = '';
    switch(provider) {
      case PROVIDER.KAKAO:
        url = socialKakaoUtil.getAuthrizeURL();
        break;
    }

    return res.redirect(url);
  } catch (error) {
    next(error);
  }
}

/**
 * 소셜 로그인 콜백 컨트롤러
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 */
async function socialCallback(req, res, next) {
  try {
    const provider = req.params.provider.toUpperCase();
    let refreshToken = null;
    let code = null;

    switch(provider) {
      case PROVIDER.KAKAO:
        code = req.query?.code;
        refreshToken = await authService.socialKakao(code);
        break;
    }

    // Cookie에 RefreshToken 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);

    // 클라이언트 - 카카오 로그인 요청 → 서버에서 카카오로 로그인 요청 → 카카오에서 클라이언트로 응답 :
    // 클라이언트와 백엔드 연결은 이미 끊어짐 → redirect로 react 재구성 필요
    return res.redirect(process.env.SOCIAL_CLIENT_CALLBACK_URL);

  } catch (error) {
    next(error)
  }
}

// ----------------------
// ||      export      ||
// ----------------------
export default {
  login,
  reissue,
  social,
  socialCallback,
}