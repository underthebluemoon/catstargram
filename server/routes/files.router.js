/**
 * @file routes/files.router.js
 * @description 파일 업로드 관련 라우터
 * 251127 v1.0.0 mastercat
 */

import express from 'express';
import multerMiddleware from '../app/middlewares/multer/multer.middleware.js';
import filesController from '../app/controllers/files.controller.js';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';

const filesRouter = express.Router();

filesRouter.post('/posts', authMiddleware, multerMiddleware.postUploader, filesController.storePost);
filesRouter.post('/profiles', authMiddleware, multerMiddleware.profileUploader, filesController.storeProfile);

export default filesRouter;