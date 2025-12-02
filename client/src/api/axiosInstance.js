import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { reissueThunk } from '../store/thunks/authThunk.js';

// store 저장용 변수
let store = null;

// store 주입용 함수 : Main.jsx -> axiosInstance.js
export function injectStoreInAios(_store) {
  store = _store;
}

// axios 인스턴스 생성         ↱ axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: '',  // 기본 URL (axios 호출 시 가장 앞에 자동으로 연결하여 동작) : 백엔드서버 프론트엔드서버 다를 시 설정 필요
  headers: {
    'Content-Type': 'application/json',
  },
  // 크로스 도메인    ↱ default : false
  // 서로 다른 도메인에 요청 보낼 때, credential 정보를 담아 보낼지 여부
  // credential 정보 : 1. 쿠키, 2. 헤더 Authorization 항목
  withCredentials: true,
});

// ===== 서버 요청할 때마다 액세스 토큰 만료 체크
//                                             ↱ request 객체의 옵션
axiosInstance.interceptors.request.use(async (config) => {
  // 재시도 막을 url
  const noRetry = /^\/api\/auth\/reissue$/;
  // store에서 state 가져옴
  let { accessToken } = store.getState().auth;
  
  try {
    //                       ↱ 무한루프 방지 : 요청 → 5분 미만 → 아래 로직 실행하면서 reissueThunk() 실행
    //                                                         = /api/auth/reissue에 요청 → 이것도 요청이니까 해당 조건 다시 체크
    //                                       → 또 조건(시간) 체크. 이미 5분 미만이었으니 조건 다시 부합 → 아래 로직 실행 → 무한 루프
    //                                       핵심: "재발급 요청도 하나의 axios 요청이라서 interceptor를 거친다!"
    // 1. 엑세스 토큰이 있고 `/api/auth/reissue` 가 아닌 경우
    if(accessToken && !noRetry.test(config.url)) {
      // 엑세스 토큰 만료 확인
      //              ↱ 디코딩해서 claim (payload 안의 정보) 가져옴
      const claims = jwtDecode(accessToken);
      const now = dayjs().unix();
      const expTime = dayjs.unix(claims.exp).add(-5, 'minute').unix();
      
      // 1-1. 엑세스 토큰의 만료시간이 5분 이하면
      if(now >= expTime) {
        // 리이슈 요청 후, 엑세스 토큰 새로 담기
        console.log('만료 5분 이내 토큰 재발급');
        const response = await store.dispatch(reissueThunk()).unwrap();
        accessToken = response.data.accessToken;
      }
  
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  } catch (error) {
    console.log('axios Interceptor : ', error)
    // thunk에서 에러 처리로 넘어감
    return Promise.reject(error);
  }
});

export default axiosInstance;


// ===== 서버에 요청 -> 1. 성공 / 2. 실패. 토큰 만료 -> 리이슈
// axiosInstance.interceptors.response.use(
//   // 성공일 때 처리
//   res => res, 
//   // 실패일 때 처리
//   async(error) => {
//     const originalRequest = error.config;
//     const noRetryList = [
//       '/api/auth/reissue',
//       '/api/auth/login'
//     ];

//     if(error.response?.status === 401 && !originalRequest._retry && !noRetryList.includes(originalRequest)) {
//       originalRequest._retry = true;  // 재시도의 경우 조건에 걸리지 않게 (무한 루프 방지)
//       try {
//         const response = await store.dispatch(reissueThunk()).unwrap();

//         if(response.data.accessToken) {
//           originalRequest.headers['Authorizaton'] = `Bearer ${response.data.accessToken}`;
//           return axiosInstance(originalRequest);
//         } else {
//           throw new Error('재발급실패');
//         }
//       } catch (error) {
//         return Promise.reject(error);
//       }
//     }
//     return Promise.reject(error)
//   }
// );