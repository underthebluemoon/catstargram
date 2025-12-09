/**
 * @file app/sevices/comments.service.js
 * @description comment Service
 * 251203 mastercat init
 */

import webpush from '../../configs/webpush.config.js';
import db from '../models/index.js';

import commentRepository from "../repositories/comment.repository.js"
import postRepository from "../repositories/post.repository.js";
import pushSubscriptionRepository from '../repositories/pushSubscription.repository.js';
import userRepository from '../repositories/user.repository.js';

/**
 * 코멘트 작성 처리
 * @param {{postId: string, userId: string, content: string}} data 
 */
async function store(data) {
  // 이전 코드
  // return await commentRepository.create(null, data);
  
  // 코멘트 작성                                    ↱ transaction 묶지 않음
  const comment = await commentRepository.create(null, data);

  // 게시글 정보 조회
  const post = await postRepository.findByPk(null, data.postId);

  // 타인 게시글일 경우만, 푸시 보내기
  if (post.userId !== data.userId) {
    // 트랜잭션 추가
    await db.sequelize.transaction(async t => {
      // 1. 댓글 작성자 정보 획득
      const user = await userRepository.findByPk(t, data.userId);
      
      // 2. 푸시 데이터 작성
      const payload = JSON.stringify({
        title: '새로운 댓글 알림',                         // 푸시 제목
        message: `${user.nick}님이 새 댓글들 작성했어요!`,  // 푸시 내용
        data: {       // 푸시 화면에는 출력하지 않지만 전달할 필요가 있는 data (내용 생성 가능, 지정x)
          targetUrl: `${process.env.APP_URL}${process.env.WEB_PUSH_FRONT_URL_POST_SHOW}/${data.postId}`
        }
      });

      // 3. 게시글 작성자의 푸시 정보 획득
      //     ↱ 여러 개 들어감
      const pushSubscriptions = await pushSubscriptionRepository.findByUserId(t, post.userId);
      
      // 4. 해당 푸시 발송 (여러 개 endpoint로 병렬 처리)
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
      const pushList = pushSubscriptions.map(async pushSubscription => {
        // 4-1. subscriptions구조
        const subscription = {
          endpoint: pushSubscription.endpoint,
          expirationTime: null,
          keys: {
            p256dh: pushSubscription.p256dh,
            auth: pushSubscription.auth
          }
        }

        // 5. expired(401에러) 푸시의 엔드포인트는 제거
        try {
          await webpush.sendNotification(subscription, payload);
        } catch (error) {
          // expired 푸시 정보는 제거
          if(error.statusCode === 410) {
            await pushSubscriptionRepository.hardDestroy(t, pushSubscription.id);
          }
        }
      });

      // 6. 병렬 처리 완료 확인   ↱ 안에 들어 있는 처리들의 완료 확인
      await Promise.allSettled(pushList);
    });
  }

  return comment;

}

export default {
  store,
}