import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // 개발 서버 Proxy 정의
  // 개발 중의 도메인 - localhost → cors 등록 ×
  server: {
    proxy: {
      //          ↱ 백엔드로 요청하는 것 대상
      // 경로가 `/api`로 시작하는 요청을 대상으로 Proxy 설정
      '/api': {
        target: 'http://localhost:3000',  // Request 대상 서버 주소
        changeOrigin: true,               // Request Header Host 필드의 값을 대상 서버 호스트로 변경
        secure: false,                    // SSL 인증서 검증 무시 - localhost(http)
        ws: true,                         // WebSoket 프로토콜 사용 - 실시간 데이터 전달을 위해 연결 유지
      }
    }
  }
})
