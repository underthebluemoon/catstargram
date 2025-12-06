/**
 * @file routes/users.router.js
 * @description user 관련 라우터
 * 251206 v1.0.0 mastercat init
 */

import express from 'express';
import storeValidator from '../app/middlewares/validations/validators/users/store.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import usersController from '../app/controllers/users.controller.js';

const usersRouter = express.Router();

usersRouter.post('/', storeValidator, validationHandler, usersController.store);

export default usersRouter;