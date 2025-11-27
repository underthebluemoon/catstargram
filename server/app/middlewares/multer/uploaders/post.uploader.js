/**
 * @file app/middlewares/multer/uploaders/post.uploader.js
 * @description 게시글 이미지 업로더
 * 251127 mastercat init
 */

import multer from 'multer';
import fs from 'fs';
import dayjs from 'dayjs';
import myError from '../../../errors/customs/my.error.js'
import { BAD_FILE_ERROR } from '../../../../configs/responseCode.config.js';

/**
 * 게시글 이미지 업로더 처리 미들웨어
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction*} next 
 */
export default function(req, res, next) {
  // multer 객체 인스턴스
  //              ↱ 미들웨어 생성기 반환
  const upload = multer({
    // storage : 파일을 저장할 위치를 상세하게 제어하는 프로퍼티
    //               ↱ 저장 방식 설정 - destination(): 하드디스크 저장 / memoryStorage(): 메모리에 임시 저장
    storage: multer.diskStorage({
      // ↱ 파일 저장 경로 설정
      //                                              file = {
      //                                                fieldname: 'image',      // input name
      //                                                originalname: 'cat.jpg', // 원본 파일명
      //                                                mimetype: 'image/jpeg',  // MIME 타입
      //                                                size: 123456,            // 파일 크기
      //                                                ... };
      //           ↱ multer가 전달 (Express의 req)      ↱  
      //                ↱ 업로드 된 파일 (multer가 파싱한 파일 정보)
      destination(req, file, callback) {
        // 저장 디렉토리 설정
        if(!fs.existsSync(process.env.FILE_POST_IMAGE_PATH)) {
          // 해당 디렉토리 없으면 생성 처리
          fs.mkdirSync(
            process.env.FILE_POST_IMAGE_PATH,
            {
              recursive: true, // 중간 디렉토리(/var/www/image)까지 모두 생성 
              mode: 0o755,  // 권한 설정 rwxr-xr-x
                  //  ↳ 0o755:
                  // Owner (7): rwx (읽기/쓰기/실행)
                  // Group (5): r-x (읽기/실행)
                  // Other (5): r-x (읽기/실행)
            }
          )
        }
        //  ↱ multer 자체 함수 : multer에게 작업 결과를 알려줌.
        //        ↱ 에러 없음 → null → 다음 로직 진행 → 아래 upload 진행 → next()
        //          에러 발생 시, 에러 보냄 → 아래 upload 진행 → 에러 핸들러
        //              ↱ 저장 경로
        callback(null, process.env.FILE_POST_IMAGE_PATH);
      },
      // 파일명 설정
      filename(req, file, callback) {
        // 저장할 파일명 생성
        const uniqueFileName = `${dayjs().format('YYYYMMDD')}_${crypto.randomUUID()}`
        //                          ↱ '파일명.확장자'
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
      fileSize: parseInt(process.env.FILE_POST_IMAGE_SIZE),
    },
  }).single('image');

  // upload 실행
  // 예외 처리 필요 : 에러 핸들러에 캐칭되지 않는 것 고려
  upload(req, res, err => {
    if(err instanceof multer.MulterError || err) {
      next(myError(err.message, BAD_FILE_ERROR));
    }
    next()
  })
}