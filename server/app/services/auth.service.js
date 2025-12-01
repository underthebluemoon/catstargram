/**
 * @file app/sevices/auth.service.js
 * @description auth Service
 * 251120 mastercat init
 */

import bcrypt from 'bcrypt';
import userRepository from "../repositories/user.repository.js";
import myError from '../errors/customs/my.error.js';
import { NOT_REGISTERED_ERROR, REISSUE_ERROR } from '../../configs/responseCode.config.js';
import jwtUtil from '../utils/jwt/jwt.util.js';
import db from '../models/index.js';

//                    ↱ 유저가 보내는 데이터
async function login(body) {
  // 트랜잭션 처리 : 하나의 처리를 트랜잭션으로 묶음
  // return await db.sequelize.transaction(async t => {
  //   서비스 로직
  // });
  //                                   ↱ parameter
  return await db.sequelize.transaction(async t => {
    const { email, password } = body;
  
    // email로 유저 정보 획득
    const user = await userRepository.findByEmail(t, email);
  
    // 유저 정보 존재 여부 체크
    if(!user) {
      throw myError('유저 정보 없음', NOT_REGISTERED_ERROR);
    }
  
    // 비밀번호 체크
    //                      ↱ 유저가 준 값
    //                                ↱ 데이터베이스에 있는 암호화 값
    if(!bcrypt.compareSync(password, user.password)) {
      throw myError('비밀번호 틀림', NOT_REGISTERED_ERROR);
    }
  
    // JWT 생성
    // accessToken : 인증용
    const accessToken = jwtUtil.generateAccessToken(user)
    // refreshToken : 토큰 재발급용
    const refreshToken = jwtUtil.generateRefreshToken(user);
  
    // refreshToken 저장
    user.refreshToken = refreshToken;
    await userRepository.save(t, user);
  
    return {
      accessToken,
      refreshToken,
      user,
    };
  });
}

// reissue
/**
 * 토큰 재발급 처리
 * @param {string} token 
 * @returns 
 */
async function reissue(token) {
  // 토큰 검증 및 유저 id 획득
  //     ↱ payload 반환
  const claims = jwtUtil.getClaimswithVerifyToken(token)
  const userId = claims.sub;

  return await db.sequelize.transaction(async t => {
    // 유저 정보 획득
    const user = await userRepository.findByPk(t, userId);

    // 토큰 일치 검증
    if(token !== user.refreshToken) {
      throw myError('리프레시 토큰 불일치', REISSUE_ERROR);
    }

    // JWT 생성 - 액세스 토큰, 리프레시 토큰
    const accessToken = jwtUtil.generateAccessToken(user);
    const refreshToken = jwtUtil.generateRefreshToken(user);

    // 리프레시 토큰 DB 에 저장 - 기존 user 모델에 새로 발급한 리프레시 토큰으로 교체
    user.refreshToken = refreshToken;
    await userRepository.save(t, user);

    return {
      accessToken,
      refreshToken,
      user,
    };
  })
}

export default {
  login,
  reissue,
}