/**
 * @file app/sevices/auth.service.js
 * @description auth Service
 * 251120 mastercat init
 */

import bcrypt from 'bcrypt';
import userRepository from "../repositories/user.repository.js";
import myError from '../errors/customs/my.error.js';
import { NOT_REGISTERED_ERROR } from '../../configs/responseCode.config.js';
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

export default {
  login,
}