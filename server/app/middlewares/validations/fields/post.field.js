/**
 * @file app/middlewares/validations/fields/post.field.js
 * @description 게시글 유효성 검사 필드
 * 251128 v1.0.0 mastercat
 */

import { body, param, query } from "express-validator";

// 페이지 필드
//                   ↱ query parameter
export const page = query('page')
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

// 게시글 내용 필드
export const content = body('content')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
  .bail()
  .isLength({ min: 1, max: 2000 })
  .withMessage('2000자를 초과할 수 없습니다.');

// 게시글 이미지 필드
// export const image = body('image')
//   .optional()
//   .trim()
//   .isLength({ max: 100 })
//   .withMessage('파일 명이 너무 길어요.');
export const image = body('image')
  .trim()
  .notEmpty()
  .withMessage('이미지는 필수 항목입니다.')
  .bail()
  // boolean 반환 필요
  .custom(val => {
    // 앱의 게시글 이미지에 접근하는 '도메인 + path'가 맞는지 확인 
    if(!val.startsWith(`${process.env.APP_URL}${process.env.ACCESS_FILE_POST_IMAGE_PATH}`)) {
      return false;
    }

    return true;
  })
  .withMessage('허용하지 않는 이미지 경로입니다.')
  .bail()
  .custom(val => {
    // 실제 이미지 파일이 있는지 검증 처리
    //     ↱ 배열로 담김
    const splitPath = val.split('/');
    const fullPath = path.join(pathUtil.getPostsImagePath(), splitPath[splitPath.length - 1]);

    if(!fs.existsSync(fullPath)) {
      return false;
    }

    return true;
  })
  .withMessage('존재하지 않는 이미지 경로입니다.');