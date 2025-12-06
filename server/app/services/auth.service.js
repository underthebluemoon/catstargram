/**
 * @file app/sevices/auth.service.js
 * @description auth Service
 * 251120 mastercat init
 */

import axios from 'axios';
import bcrypt from 'bcrypt';
import userRepository from "../repositories/user.repository.js";
import myError from '../errors/customs/my.error.js';
import { NOT_REGISTERED_ERROR, REISSUE_ERROR } from '../../configs/responseCode.config.js';
import jwtUtil from '../utils/jwt/jwt.util.js';
import db from '../models/index.js';
import socialKakaoUtil from '../utils/social/social.kakao.util.js';
import PROVIDER from '../middlewares/auth/configs/provider.enum.js';
import ROLE from '../middlewares/auth/configs/role.enum.js';

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

/**
 * 로그아웃 처리
 * @param {number} id - 유저id
 */
async function logout(id) {
  return await userRepository.logout(null, id);
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

/**
 * 
 * @param {*} code 
 */
async function socialKakao(code) {
  // 토큰 획득 요청에 필요한 헤더와 바디 생성
  const tokenRequest = socialKakaoUtil.getTokenRequest(code);

  // 1. 토큰 획득 요청
  const resultToken = await axios.post(
    process.env.SOCIAL_KAKAO_API_URL_TOKEN, 
    tokenRequest.searchParams, 
    { headers: tokenRequest.headers }
  )
  const { access_token } = resultToken.data;
  // console.log('Access Token:', access_token);

  // 2. 토큰으로 사용자 정보 획득 (카카오에서 주는)
  const userRequest = socialKakaoUtil.getUserRequest(access_token);
  const resultUser = await axios.post(
    process.env.SOCIAL_KAKAO_API_URL_USER_INFO, 
    userRequest.searchParams, 
    { headers: userRequest.headers }
  );
  const kakaoId = resultUser.data.id;
  const email = resultUser.data.kakao_account.email;
  const profile = resultUser.data.kakao_account.profile.thumbnail_image_url;
    //   ↳ 카카오 서버로 부터 다운로드 받아서 profile 폴더에 보관해야함
  const nick = resultUser.data.kakao_account.profile.nickname;
  // console.log('사용자 정보:', kakaoId, email, profile, nick)

  // 트랜잭션
  const refreshToken = db.sequelize.transaction(async t => {
    // 3. 사용자 정보로 가입한 회원인지 체크
    let user = await userRepository.findByEmail(t, email);

    if(!user) {
      // 3-1. 미가입 회원 -> 회원가입 처리
      const data = {
        email,
        profile,
        nick,
        password: bcrypt.hashSync(crypto.randomUUID(), 10),
        provider: PROVIDER.KAKAO,
        role : ROLE.NORMAL,
      };
      user = await userRepository.create(t, data);
    } else {
      // 3-2. provider 확인하고 카카오 아니면 변경
      if(user.provider !== PROVIDER.KAKAO) {
        user.provider = PROVIDER.KAKAO;
      }
    }
    
    // 3-3. 우리 리프레시 토큰 생성 (토큰 체크 및 정보 추출 불가)
    const refreshToken = jwtUtil.generateRefreshToken(user);
    
    // 리프레시 토큰 저장 및 리턴
    user.refreshToken = refreshToken;
    await userRepository.save(t, user);

    return refreshToken;
  });

  // 4. 카카오 로그아웃
  const logoutRequest = socialKakaoUtil.getLogoutRequest(kakaoId, access_token);
  await axios.post(
    process.env.SOCIAL_KAKAO_API_URL_LOGOUT,
    logoutRequest.searchParams,
    { headers: logoutRequest.headers }
  )

  // 5. 최종적으로 우리 리프레시 토큰 반환
  return refreshToken;
}

export default {
  login,
  logout,
  reissue,
  socialKakao,
}