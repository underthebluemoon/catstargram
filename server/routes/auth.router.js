/**
 * @file routes/auth.router.js
 * @description 인증 관련 라우터
 * 251119 v1.0.0 mastercat init
 */

import express from 'express';
import authController from '../app/controllers/auth.controller.js';
import loginValidator from '../app/middlewares/validations/validators/auth/login.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import socialValidator from '../app/middlewares/validations/validators/auth/social.validator.js';

const authRouter = express.Router();

//          ↱ 로그인 : 인증 정보 생성 - post
//                         ↱ 유효성 체크    ↱ 에러 핸들러        ↱ 컨트롤러
authRouter.post('/login', loginValidator, validationHandler, authController.login);
  // 이미 액세스 토큰이 만료되어 인증 절차 불가능 : 재발급 때는 액세스 토큰으로 인증 체크 X
  // validatoion 체크도 불 필요
authRouter.post('/reissue', authController.reissue);
authRouter.get('/social/:provider', socialValidator, validationHandler, authController.social);
  // 유효성 체크 → 요청자(카카오 등)에게 응답 → 불필요
authRouter.get('/callback/:provider', authController.socialCallback);

export default authRouter;