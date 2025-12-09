import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance.js";

export default function usePushNotifications() {
  // 권한 플래그
  // NotificationPermission: "default" | "denied" | "granted"
  // 유저가 권한 거부를 한 경우, 코드상으로는 재설정 불가능
  // 크롬의 경우 `chrome://settings/content/notifications`로 접속하여 직접 허용 설정 필요
  const [isSubscribing, setIsSubscribing] = useState(false);
  //      ↱ 서비스 시작 전 모달 표시 방지 플래그
  const [isInit, setIsInit] = useState(false);
  //      ↱ 모달이 계속 표시되는 것을 방지하기 위한 체크 플래그
  const [isCheckedSubscribe, setIsCheckedSubscribe] = useState(false);

  useEffect(() => {
    // usePushNotifications 초기화
    async function init() {
      try {
        // 서비스 워커 준비
        const registration = await navigator.serviceWorker.ready;
        
        // 등록 중인 구독 정보 획득
        const subscribing = await registration.pushManager.getSubscription();
        if(subscribing) {
          setIsSubscribing(true);
        }
        
      } catch(error) {
        console.log(error);
      } finally {
        setIsInit(true);
      }
    }
    init();
  }, []);

  // 권한 요청
  async function requestPermission() {
    try {
      if('Notification' in window) {
        // Notification 지원하는 경우       ↱ 아무 처리도 안 한 기본 상태
        if(Notification?.permission === 'default') {
          // 허용이 아닌경우 처리               ↱ 브라우저 자체 권한 요청 팝업: 허용 → granted / 허용 안 함 -> denied
          const result = await Notification.requestPermission();
          
          if(result !== 'granted') {
            alert('알림 허용을 하지 않으면 서비스 이용에 제한이 있습니다.');
            return false;
          } else {
            return true;
          }
          //                                     ↱ 
        } else if(Notification?.permission === 'denied') {
            // 새로고침 시 모달이 반복해서 뜸 → 반 강제하기 위해 의도한 것 : 허용하는 방식을 안내
            alert('알림을 거부하신 이력이 있습니다.\n알림 허용을 하지 않으면 서비스 이용에 제한이 있습니다.');
            return false;
        } else {
          return true;
        }
      } else {
        // Notification 지원하지 않는 경우
        alert('알림을 지원하지 않는 브라우저입니다.');
        return false;
      }
    } catch(error) {
      console.error(error);
      throw error;
    }
  }

  // 구독 등록
  async function subscribeUser() {
    try {
      if(!isSubscribing) {
        const isGranted = await requestPermission();

        // 1. 권한 확인 → false의 경우 처리 종료
        if(!isGranted) {
          return;
        }
        // 2. 구독 등록 x 허용 o → 서비스 워커 준비
        const registration = await navigator.serviceWorker.ready;

        // 서비스 워커에 구독 정보 등록      ↱ push service에 등록 방식 설정
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,  // 유저가 사용하는 필요 변수만 구독
          applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY  // 백엔드에서 만든 key
        });
  
        // subscription의 구조
        // {
        //   endpoint: 'https://fcm.googleapis.com/fcm/send/dFlTq11Ly-w:...',
        //   expirationTime: null,
        //   keys: {
        //     p256dh: 'BD9B5KMdQbwgG7...',
        //     auth: 'OL56CZS...'
        //   }
        // }
  
        const deviceInfo = {
          userAgent: navigator.userAgent,   // 브라우저/디바이스 정보
          language: navigator.language      // 언어 정보
        };
        
        // Backend에 구독 정보 등록 요청
        await axiosInstance.post('/api/subscriptions', {subscription, deviceInfo});

        alert('구독 성공');
      }
    } catch(error) {
      console.error("구독 실패: ", error);
    } finally {
      setIsCheckedSubscribe(true);
    }
  }

  return {
    isInit,
    isSubscribing,
    isCheckedSubscribe,
    subscribeUser,
  }
}