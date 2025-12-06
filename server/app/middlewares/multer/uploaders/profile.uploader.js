/**
 * @file app/middlewares/multer/uploaders/profile.uploader.js
 * @description 프로필 이미지 업로더
 * 251127 mastercat init
 */

import multer from 'multer';
import fs from 'fs';
import dayjs from 'dayjs';
import myError from '../../../errors/customs/my.error.js'
import { BAD_FILE_ERROR } from '../../../../configs/responseCode.config.js';

/**
 * 프로필 이미지 업로더 처리 미들웨어
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction*} next 
 */
export default function(req, res, next) {
  // multer 객체 인스턴스
  const upload = multer({
    // storage : 파일을 저장할 위치를 상세하게 제어하는 프로퍼티
    storage: multer.diskStorage({
      // ↱ 파일 저장 경로 설정
      destination(req, file, callback) {
        // 저장 디렉토리 설정
        if(!fs.existsSync(process.env.FILE_USER_PROFILE_PATH)) {
          fs.mkdirSync(
            process.env.FILE_USER_PROFILE_PATH,
            {
              recursive: true, // 중간 디렉토리(/var/www/image)까지 모두 생성 
              mode: 0o755,  // 권한 설정 rwxr-xr-x
            }
          )
        }

        callback(null, process.env.FILE_USER_PROFILE_PATH);
      },
      // 파일명 설정
      filename(req, file, callback) {
        // 저장할 파일명 생성
        const uniqueFileName = `${dayjs().format('YYYYMMDD')}_${crypto.randomUUID()}`
        const fileNameParts = file.originalname.split('.');
        const ext = fileNameParts[fileNameParts.length - 1].toLowerCase();

        callback(null, `${uniqueFileName}.${ext}`)
      }
    }),
    // fileFilter : 파일 필터링 처리를 제어하는 프로퍼티 (validator로 불가능)
    fileFilter(req, file, callback) {
      //       ↱ 미디어 타입 / 예: image/png
      if(!file.mimetype.startsWith('image/')) {
        return callback(myError('이미지 파일 아님', BAD_FILE_ERROR));
      }
      //              ↱ 통과 여부
      callback(null, true);
    },
    // limit 파일 사이즈, 개수 등 제한
    limit: {
      fileSize: parseInt(process.env.FILE_USER_PROFILE_SIZE),
    },
  }).single('profile');

  // upload 실행
  // 예외 처리 필요 : 에러 핸들러에 캐칭되지 않는 것 고려
  upload(req, res, err => {
    if(err instanceof multer.MulterError || err) {
      next(myError(err.message, BAD_FILE_ERROR));
    }
    next()
  })
}