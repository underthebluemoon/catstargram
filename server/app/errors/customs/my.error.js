/**
 * @file app/errors/customs/my.error.js
 * @description 커스텀 에러 객체 생성
 * 251124 v1.0.0 mastercat init
 */

import { SYSTEM_ERROR } from "../../../configs/responseCode.config.js";

/**
 * 공통 에러 객체 생성
 * @param {string} msg - 에러메세지
 * @param {import('../../../configs/responseCode.config.type.js').ResponseCodeConfig} codeInfo - 응답 코드 정보
 * @returns error
 */
export default function myError(msg='', codeInfo = SYSTEM_ERROR) {
  //           ↱ 에러 객체 생성
  const err = new Error(msg);
  // ↱ 에러 객체 안에 프로퍼티'codeInfo: codeInfo' 생성
  err.codeInfo = codeInfo;
  return err;
}