/**
 * @file app/controllers/subscriptions.controller.js
 * @description subscription 관련 컨트롤러
 * 251208 v1.0.0 mastercat init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import subscriptionsService from "../services/subscriptions.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

async function subscribe(req, res, next) {
  try {
    // subscription의 구조
    // {
    //   endpoint: 'https://fcm.googleapis.com/fcm/send/dFlTq11Ly-w:...',
    //   expirationTime: null,
    //   keys: {
    //     p256dh: 'BD9B5KMdQbwgG7...',
    //     // ↱ 유저 접근 키
    //     auth: 'OL56CZS...'
    //   }
    // }
    // deviceInfo의 구조
    // {
    //   userAgent: navigator.userAgent,   // 브라우저/디바이스 정보
    //   language: navigator.language      // 언어 정보
    // }
    const { subscription, deviceInfo } = req.body;
    const userId = req.user.id;

    await subscriptionsService.subscribe({userId, subscription, deviceInfo});
    
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS));
  } catch (error) {
    return next(error);
    
  }
};

export default {
  subscribe,

}