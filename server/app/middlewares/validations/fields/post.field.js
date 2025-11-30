/**
 * @file app/middlewares/validations/fields/post.field.js
 * @description 게시글 유효성 검사 필드
 * 251128 v1.0.0 mastercat
 */

import { body, param } from "express-validator";

// 페이지 필드
export const page = body('page')
  .trim()
  .optional()                      // 선택사항
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt();                        // 숫자형 반환

// 게시글 PK 필드
export const id = param('id')
  .trim()
  .notEmpty()
  .withMessage('필수 항목 입니다.')
  .bail()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt();

export const content = body('content')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
  .bail()
  .isLength({ min: 1, max: 2000 })
  .withMessage('2000자를 초과할 수 없습니다.');

export const image = body('image')
  .optional()
  .trim()
  .isLength({ max: 100 })
  .withMessage('파일 명이 너무 길어요.');