# catsatrgram
| 항목            | 내용                                                       |
| ------------- | -------------------------------------------------------- |
| **프로젝트명**     | meerketgram                                                |
| **설명**        | 사용자들이 게시글과 댓글로 소통하는 커뮤니티형 웹앱                             |
| **핵심 기능**     | 회원가입/로그인(JWT), 소셜 로그인, 권한(Role) 기반 접근, 사진 업로드, PWA 푸시 알림 |
| **사용 기술**     | Vite + React 19 (프론트) / Express 7 (백엔드) / MySQL 8.4 (DB) |
| **추가 기능(선택)** | 모바일 카메라 업로드, 지문 인증(WebAuthn)                             |

<br>

# 프로젝트 구조
```
meerkatgram/
├── client/             # Vite + React (PWA)
│   ├── src/                # React 실행 관련 로직
│   │   ├── assets/             # 비공개 정적 파일
│   │   ├── config/             # 설정 파일 (환경 변수, API 엔드포인트, Firebase/Web Push 설정 등)
│   │   ├── components/         # 컴포넌트
│   │   ├── routes/             # React 라우터
│   │   ├── store/              # 리덕스 관련
│   │   │   ├── slices/            # 리덕스 슬라이스 관련
│   │   │   └── store.js
│   │   ├── utils/              # 유틸
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── sw.js               # service-worker 파일
│   ├── index.html
│   └── vite.config.js
│
├── server/             # Express
│   ├── app/                # Express 실행 관련 로직
│   │   ├── controllers/        # 컨트롤러 레이어 (유효성 검사 & Request·Response 시 데이터 가공 처리 & 비지니스 로직으로의 연결)
│   │   ├── middlewares/        # 미들웨어 (JWT 인증, 권한 체크, 에러 핸들링, 로깅 등)
│   │   ├── models/             # 모델 (Sequelize 등 모델)
│   │   ├── repositories/       # DB 접근 레이어
│   │   ├── services/           # 비즈니스 로직 레이어
│   │   └── utils/              # 유틸
│   ├── configs/                # 전역 설정 파일 (DB, JWT, OAuth, Push 등)
│   ├── database/           # 데이터베이스 관련
│   │   ├── migrations/         # 마이그레이션 (DB 스키마 작성 파일 등)
│   │   └── seeders/            # 시더 (DB 더미 데이터 생성 파일 등)
│   ├── routes/             # API 엔드포인트 정의
│   ├── storage/            # 정적 파일을 서빙 디렉토리 (업로드 파일, PWA build 결과물 저장소), 주의: 운영환경은 경로 다름 
│   ├── app.js              # API 엔트리 포인트
│   └── .env                # 환경 변수 설정 파일
└── READEME.md
```
<br>

# 설치 라이브러리
### client
````
npm create vite@latest .
npm i dayjs react-router-dom @reduxjs/toolkit react-redux axios jwt-decode
npm install -D vite-plugin-pwa
````

### server
```
npm init
npm i express express-validator morgan winston dotenv sequelize sequelize-cli mysql2 cookie-parser jsonwebtoken cors multer swagger-ui-express yaml dayjs bcrypt web-push swagger-ui-express swagger-parser
npm install -D nodemon 
```
---
- express : 프레임워크
- express-validator : express에서 사용하는 유효성 검사 라이브러리
- dotenv : 환경 설정 파일을 적용하는 라이브러리 (.env)
- mysql2 : node.js 환경에서 mysql을 사용할 수 있게 해주는 라이브러리 (mysql❌ mysql2⭕)
- sequelize : node.js 환경에서 사용하는 ORM
- sequelize-cli : sequelize를 cli로 사용할 수 있게 해주는 라이브러리
- nodemon : 개발 단계에 서버 자동 새로고침을 도와주는 라이브러리
---
- dayjs : 날짜 연산 및 포팻 라이브러리
- bcrypt : node.js 환경에서 사용하는 단방향 암호화 라이브러리
---
- winston : node.js 환경에서 사용하는 로깅 라이브러리
- cookie-parser : cookie 를 파싱해주는 라이브러리
- jsonwebtoken : JWT 생성 및 검증, payload 획득 등 라이브러리
---
- web-push : 웹 푸시 기능 구현을 위한 라이브러리
- cors : cors 세팅을 도와주는 라이브러리
- multer : 파일을 업로드 할 수 있도록 도와주는 라이브러리
---
- swagger-ui-express : api 명세서 작성 라이브러리
- swagger-parser : yaml 번들링 라이브러리
---
- 보류
    - morgan : node.js 환경에서 사용하는 http 로깅 라이브러리 enginx로 대체할 수도 있음
    - faker-js : 랜덤한 데이터를 생성하는 라이브러리
---

# DB 테이블 설계안
### users (회원 정보)
| 컬럼명           | 타입                              | 설명          |
| ------------- | ------------------------------- | ----------- |
| id            | BIGINT PK AUTO_INCREMENT        | 사용자 ID      |
| email         | VARCHAR(100) UNIQUE             | 이메일(로그인용)   |
| password      | VARCHAR(255)                    | 비밀번호(해시 저장) |
| nick          | VARCHAR(20) UNIQUE                    | 닉네임         |
| provider      | VARCHAR(10)                     | 로그인 제공자(local, google, kakao 등)     |
| role          | VARCHAR(10)                     | 권한(user, admin 등)          |
| profile | VARCHAR(100)                    | 프로필 이미지 경로  |
| refresh_token | VARCHAR(255)                    | 프로필 이미지 경로  |
| created_at    | DATETIME                        | 가입일         |
| updated_at    | DATETIME                        | 수정일         |
| deleted_at    | DATETIME                        | 삭제일         |

### posts (게시글)
| 컬럼명        | 타입                   | 설명         |
| ---------- | -------------------- | ---------- |
| id         | BIGINT PK AUTO_INCREMENT         | 게시글 ID     |
| user_id    | BIGINT FK(users.id)  | 작성자 ID     |
| title      | VARCHAR(200)         | 제목         |
| content    | VARCHAR(1000)                 | 본문         |
| image  | VARCHAR(100)         | 업로드 이미지 경로 |
| created_at    | DATETIME                        | 가입일         |
| updated_at    | DATETIME                        | 수정일         |
| deleted_at    | DATETIME                        | 삭제일         |

### comments (댓글)
| 컬럼명        | 타입                  | 설명         |
| ---------- | ------------------- | ---------- |
| id         | BIGINT PK AUTO_INCREMENT        | 댓글 ID      |
| post_id    | BIGINT FK(posts.id) | 댓글이 달린 게시글 |
| user_id    | BIGINT FK(users.id) | 작성자        |
| content    | VARCHAR(1000)                | 댓글 내용      |
| created_at    | DATETIME                        | 가입일         |
| updated_at    | DATETIME                        | 수정일         |
| deleted_at    | DATETIME                        | 삭제일         |

### likes (좋아요)
| 컬럼명        | 타입                  | 설명         |
| ---------- | ------------------- | ---------- |
| id         | BIGINT PK AUTO_INCREMENT        | 좋아요 ID     |
| post_id    | BIGINT FK(posts.id) | 좋아요 대상 게시글 |
| user_id    | BIGINT FK(users.id) | 누른 사용자     |
| created_at    | DATETIME                        | 가입일         |
| updated_at    | DATETIME                        | 수정일         |
| deleted_at    | DATETIME                        | 삭제일         |

### notifications (PWA 푸시용)
| 컬럼명        | 타입                   | 설명     |
| ---------- | -------------------- | ------ |
| id         | BIGINT PK AUTO_INCREMENT         | 알림 ID  |
| user_id    | BIGINT FK(users.id)  | 알림 대상자 |
| title      | VARCHAR(200)         | 알림 제목  |
| message    | VARCHAR(2000)                 | 알림 내용  |
| is_read    | TINYINT(1) DEFAULT 0 | 읽음 여부  |
| created_at    | DATETIME                        | 가입일         |
| updated_at    | DATETIME                        | 수정일         |
| deleted_at    | DATETIME                        | 삭제일         |

### push_subscriptions (댓글 푸시 정보)
| 컬럼명        | 타입                  | 설명                |
| ---------- | ------------------- | ----------------- |
| id         | BIGINT PK AUTO_INCREMENT        | 구독 ID             |
| user_id    | BIGINT FK(users.id) | 유저                |
| endpoint   | VARCHAR(255)                | Push API endpoint |
| p256dh     | VARCHAR(255)                | 공개키               |
| auth       | VARCHAR(255)                | 인증키               |
| created_at    | DATETIME                        | 가입일         |
| updated_at    | DATETIME                        | 수정일         |
| deleted_at    | DATETIME                        | 삭제일         |
