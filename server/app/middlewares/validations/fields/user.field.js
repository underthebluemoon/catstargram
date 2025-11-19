/**
 * @file app/middlewares/validations/fields/user.field.js
 * @description 유저 정보 유효성 검사 필드
 * 251119 v1.0.0 mastercat
 */

import { body } from "express-validator";

// ===== 개별 export =====

// export const email = body('email')
//   .notEmpty()
//   .withMessage('이메일은 필수 항목입니다.')
//   .bail()
//   .isEmail()
//   .withMessage('유효한 이메일을 입력해주세요.')
// ;

// export const password = body('password')
//   .notEmpty()
//   .withMessage('비밀번호는 필수 항목입니다.')
//   .bail()
//   .matches(/^[a-zA-Z0-9!@#$]{8,20}$/)
//   .withMessage('영어 대/소문자·숫자·!·@·#·$, 8~20자 입력 가능합니다.')
// ;


// ===== 객체 export =====

const email = body('email')
  .trim()
  .notEmpty()
  .withMessage('이메일은 필수 항목입니다.')
  .bail()
  .isEmail()
  .withMessage('유효한 이메일을 입력해주세요.')
;

const password = body('password')
  .trim()
  .notEmpty()
  .withMessage('비밀번호는 필수 항목입니다.')
  .bail()
  .matches(/^[a-zA-Z0-9!@#$]{8,20}$/)
  .withMessage('영어 대/소문자·숫자·!·@·#·$, 8~20자 입력 가능합니다.')
;

export default {
  email,
  password,
};