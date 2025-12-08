/**
 * @file app/sevices/subscription.service.js
 * @description subscription Service
 * 251208 mastercat init
 */

import pushSubscriptionRepository from "../repositories/pushSubscription.repository.js";

async function subscribe(params) {
  const { userId, subscription, deviceInfo } = params;
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

    // upsert = update + insert
    //   ↳ update 할 데이터 안에 pk나 unique 처럼 중복되지 않는 값이 필요!
    const { endpoint, keys } = subscription;
    const { userAgent } = deviceInfo;

    const data = {
      userId: userId,
      endpoint: endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      device: userAgent,
    }

    return await pushSubscriptionRepository.upsert(null, data);
}

export default {
  subscribe,
}