/**
 * @file app/middlewares/loggers/wiston.logger.js
 * @description winston Logger
 * 251124 v1.0.0 mastercat init
 */

import winston from 'winston';
import dayjs from 'dayjs';

// ---------------------
// ||     private     ||
// ---------------------
// 커스텀 포멧 작성
const customFormat = winston.format.printf(({message, level}) => {
  // 출력예) [2025-11-24 10:12:15] level message
  const now = dayjs().locale(process.env.APP_TZ).format('YYYY-MM-DD HH:mm:ss');
  return `[${now}] ${level} - ${message}`;
})
// ---------------------
// ||     public     ||
// ---------------------
// 범용 로거 인스턴스
//                             ↱
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,        // 로그 레벨 제한
  format: winston.format.combine(
    customFormat,
  ),
    // 로그를 출력하는 관리 설정 (방식-파일/콘솔 등 설정)
  transports: [  
    new winston.transports.File({
      filename: `${process.env.LOG_BASE_PATH}/${dayjs().locale(process.env.APP_TZ).format('YYYYMMDD')}_${process.env.LOG_FILE_NAME}`,
      // level: 'error',                  // 파일 작성 로그 레벨 제한
    }),
    // //                      ↱ Console(): 콘솔에 전부 출력 됨. product 환경에서도 나오니 주의
    // new winston.transports.Console(),
  ]
});

