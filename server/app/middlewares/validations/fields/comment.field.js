/**
 * @file app/middlewares/validations/fields/comment.field.js
 * @description 댓글 유효성 검사 필드
 * 251203 v1.0.0 mastercat init
 */

import { body } from "express-validator";

// 게시글 PK 필드
export const postId = body('postId')
  .trim()
  .notEmpty()
  .withMessage('필수 항목 입니다.')
  .bail()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt();

// reply 필드
export const replyId = body('replyId')
  .trim()
  .notEmpty()
  .withMessage('필수 항목 입니다.')
  .bail()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt();

// 댓글 내용 필드
export const content = body('content')
  .trim()
  .notEmpty()
  .withMessage('내용은 필수 항목입니다.')
  .bail()
  .isLength({ min: 1, max: 1000 })
  .withMessage('2000자를 초과할 수 없습니다.');
