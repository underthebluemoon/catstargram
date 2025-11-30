/**
 * @file app/middlewares/auth/auth.middleware.js
 * @description 인증 및 인가 처리 미들웨어
 * 251126 v1.0.0 mastercat init
 */

import { FORBIDDEN_ERROR } from "../../../configs/responseCode.config.js";
import myError from "../../errors/customs/my.error.js";
import jwtUtil from "../../utils/jwt/jwt.util.js";
import ROLE_PERMISSIONS from "./configs/role.permisions.js";

// ---------------------
// ||     Private     ||
// ---------------------
/**
 * 토큰 검증 및 Requset에 유저 정보 추가
 * @param {import("express"),Request} req 
 */
function authenticate(req) {
  // 토큰 획득
  const token = jwtUtil.getBearerToken(req);

  // 토큰 검증 및 페이로드 획득
  const claims = jwtUtil.getClaimswithVerifyToken(token);

  // Request 객체에 사용자 정보를 추가
  req.user = {
    id: parseInt(claims.sub),
    role: claims.role,
  }

}

/**
 * 인증 및 권한 체크
 * @param {import("express"),Request} req 
 */
function authorize(req) {
  // 요청에 맞는 권한 규칙 조회          ↱ GET, POST, PUT, ...
  const matchRole = ROLE_PERMISSIONS[req.method].find(item => {
    // console.log(
    //   // http://localhost:3000/api/auth/login?id=1
    //   req.originalUrl,  // 도메인 제외 전체 URL (/api/auth/login?id=1)
    //   req.baseUrl,      // 프리픽스로 묶은 path (/api/auth)
    //   req.path,         // baseUrl 제외 path (/login)
    //   `${req.baseUrl}${req.path}`,  // 실제 매칭할 경로
    // )
    
    // `/`로 끝나는 url의 경우 `/` 삭제
    const path = req.path.endsWith('/') ? req.path.slice(0, -1) : req.path;

    console.log(
      // http://localhost:3000/api/auth/login?id=1
      req.originalUrl,  // 도메인 제외 전체 URL (/api/auth/login?id=1)
      req.baseUrl,      // 프리픽스로 묶은 path (/api/auth)
      req.path,         // baseUrl 제외 path (/login)
      `${req.baseUrl}${path}`,  // 실제 매칭할 경로 (path 변수 사용!)
    )

    return item.path.test(`${req.baseUrl}${path}`);
  });

  // 일치하는 규칙이 있을 시, 인증 및 권한 체크를 실시
  console.log('matchRole:', matchRole);
  if(matchRole) {
    // 인증 체크 및 인증 정보를 Request 셋
    authenticate(req);

    // 권한 체크
    const userRole = req.user?.role;
    if(!userRole || !matchRole.roles.includes(userRole)) {
      throw myError('권한 부족', FORBIDDEN_ERROR);
    }
  }
}



// --------------------
// ||     Public     ||
// --------------------
export default function(req, res, next) {
  try{
    authorize(req);
    return next();

  } catch(error) {
    return next(error);
  }
}
