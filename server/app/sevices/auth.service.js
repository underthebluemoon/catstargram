/**
 * @file app/sevices/auth.service.js
 * @description auth Service
 * 251120 mastercat
 */

import bcrypt from 'bcrypt';
import userRepository from "../repositories/user.repository.js";

//                    ↱ 유저가 보내는 데이터
async function login(body) {
  const { email, password } = body;

  // email로 유저 정보 획득
  const result = await userRepository.findByEmail(null, email);

  // 유저 정보 존재 여부 체크
  if(!result) {
    throw new Error('유저 없음');
  }

  // 비밀번호 체크
  //                      ↱ 유저가 준 값
  //                                ↱ 데이터베이스에 있는 암호화 값
  if(!bcrypt.compareSync(password, result.password)) {
    throw new Error('비밀번호 틀림');
  }

  return result;
}

export default {
  login,
}