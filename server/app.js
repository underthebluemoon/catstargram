/**
 * @file app.js
 * @description Entry Point
 * 251117 v1.0.0 mastercat
 */

import express from 'express';
import './configs/env.config.js';
import authRouter from './routes/auth.router.js';
import errorHandler from './app/errors/errorHandler.js';

import swaggerUi from 'swagger-ui-express';
import SwaggerParser from 'swagger-parser';
import path from 'path';
import filesRouter from './routes/files.router.js';

const app = express();
app.use(express.json());  // JSON 요청 파싱 처리

// ------------------------------------------
// ||     정적 파일 제공 등록
// ------------------------------------------
// const postImagePath = path.join(path.resolve(), );
app.use(process.env.ACCESS_FILE_POST_IMAGE_PATH, express.static(process.env.FILE_POST_IMAGE_PATH));
app.use(process.env.ACCESS_FILE_USER_PROFILE_PATH, express.static(process.env.FILE_USER_PROFILE_PATH));

// ------------------------------------------
// ||     Swagger 정의
// ------------------------------------------
// swagger yaml file bundling
//                  ↱ 비동기 : 문서 읽기         ↱ path.join() : 인자들을 하나로 합쳐서 경로를 만듦
//                                                       ↱ path.resolve() : 절대경로 합침
const SwaggerDoc = await SwaggerParser.bundle(path.join(path.resolve(), 'swagger/swagger.yaml'));
// swagger ui 등록
//                    ↱ swaggerUi.serve : swagger bundling middlware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SwaggerDoc));


// ------------------------------------------
// ||     라우터 정의
// ------------------------------------------
app.use('/api/auth', authRouter);
app.use('/api/files', filesRouter);

// 에러 핸들러 등록
app.use(errorHandler);
// ------------------------------------------
// ||     해당 Port로 express 실행
// ------------------------------------------
//                           ↱ env는 문자열
app.listen(parseInt(process.env.APP_PORT));