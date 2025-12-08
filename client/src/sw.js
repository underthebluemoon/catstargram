      //  ↱ 정적 파일, 이미지 등 캐싱
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
      //  ↱ 네트워크 우선 요청 → timeout 캐싱 출력
      //                ↱ 우선 캐싱 → 백그라운드에서 네트워크 요청
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

const PREFIX = import.meta.env.VITE_APP_NAME;


// -----------------------------------------
// ||     정적 파일 캐싱
// -----------------------------------------

precacheAndRoute(self.__WB_MANIFEST);

// -----------------------------------------
// ||     HTML 오프라인 대응
// -----------------------------------------
registerRoute(
  ({request}) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: `${PREFIX}-html-cache`,
      //                   ↱ 실무에서는 주로 1초
    networkTimeoutSeconds: 3,
  })
);

// -----------------------------------------
// ||     이미지 캐싱 (manifest 제외)
// -----------------------------------------
registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: `${PREFIX}-image-cache`,
    networkTimeoutSeconds: 3,
  })
);

// -----------------------------------------
// ||     API 요청 캐싱 (최소 동작 보장, GET만 추천 - 나머지 제외)
// -----------------------------------------
registerRoute(
  //          ↱ 요청 url    ↱ domain
  ({request, url}) => url.origin === import.meta.env.VITE_SEVER_URL && request.method === 'GET',
  new StaleWhileRevalidate({
    cacheName: `${PREFIX}-api-cache`,
    networkTimeoutSeconds: 3,
  })
);