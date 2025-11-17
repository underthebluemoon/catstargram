/**
 * @file configs/env.config.js
 * @description 환경에 따른 env 설정 파일
 * 251117 v1.0.0 mastercat 최초 생성
 * 251117 v1.0.0 mastercat 무슨 작업
 */

//      ↱ fs : Node.js 기본 파일 시스템 모듈. 파일/폴더를 읽고, 쓰고, 확인하는 기능 제공
import fs from 'fs';
import dotenv from 'dotenv';

const envFiles = [
  '.env.production',
  '.env.test',
  '.env',
];

// `encFiles` 루프 : 해당 파일이 있으면 파일 경로 저장
// 예1) `.env.test`, `env`가 있을 경우 -> `.env`를 셋팅
// 예2) `.env.test`만 있을 경우 -> `.env.test`를 셋팅
// 예3) `.env.production`, `env.test`, `env`가 있을 경우 -> `.env`를 셋팅
let filePath = '';
for(const file of envFiles) {
  //  ↱ fs.existsSunc() : 파일이 존재하는지 확인하는 동기 함수. 존재 -> true / 없음 -> false
  if(fs.existsSync(file)) {
    //  ↱ 존재하는 파일 경로 저장
    filePath = file;
  }
}

// 셋팅 된 filepath로 dotenv 설정
dotenv.config({
  path: filePath,
  debug: filePath === '.env' ? true : false
})
console.log(`Loaded env: ${filePath}`);
