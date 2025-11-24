/**
 * @file app/models/index.js
 * @description Sequelize 인스턴스 생성 File
 * 251120 v1.0.0 mastercat init
 */

import '../../configs/env.config.js';
import { Sequelize } from 'sequelize';
import User from './User.js';
import Post from './Post.js';
import Like from './Like.js';
import Comment from './Comment.js';
import Push_subscription from './Push_subscription.js';
import Notification from './Notification.js';

const db = {}; // 생성할 db 인스턴스 저장용

// sequelize instance 생성 -> 여러 파일에서 재사용
//                     ↱ sequelize 객체 생성 메소드
const sequelize = new Sequelize(
  process.env.DB_MYSQL_DB_NAME        // DB명
  , process.env.DB_MYSQL_USER         // DB 접속 유저
  , process.env.DB_MYSQL_PASSWORD     // DB 접속 패스워드
  ,{
    host: process.env.DB_MYSQL_HOST                     // 사용 DB Host
    ,port: parseInt(process.env.DB_MYSQL_PORT)          // 사용 DB Port
    ,dialect: process.env.DB_MYSQL_DIALECT              // 사용 DB 드라이버
    ,timezone: process.env.DB_MYSQL_TIMEZONE            // 타임존
    ,logging: process.env.DB_MYSQL_LOG_FLG === 'true' && console.log  // DB Loggin on/off (로그가 필요한 경우만 true, 배포시 false로 조절)
    ,dialectOptions: {
      dateStrings: true  // 문자열로 날짜 받기
    }
    ,pool: { // 커넥션풀 설정
      max: parseInt(process.env.DB_MYSQL_CONNECTION_COUNT_MAX),   // 최대 커넥션 수
      min: parseInt(process.env.DB_MYSQL_CONNECTION_COUNT_MIN),   // 최소 커넥션 수
      acquire: parseInt(process.env.DB_MYSQL_ACQUIRE_LIMIT),      // 연결 최대 대기 시간 (ms)
      idle: parseInt(process.env.DB_MYSQL_IDLE_LIMIT)             // 유휴 커넥션 유지 시간 (ms)
    }
  }
);

db.sequelize = sequelize; // 생성한 sequelize 인스턴스 db에 저장

// 모델 초기화
//                     ↱ 모델에서 만든 초기화 함수에 sequelize를 넣어서 실행
//  ↱ Sequelize Model 클래스가 됨
db.User = User.init(sequelize);
db.Post = Post.init(sequelize);
db.Like = Like.init(sequelize);
db.Comment = Comment.init(sequelize);
db.Push_subscription = Push_subscription.init(sequelize);
db.Notification = Notification.init(sequelize);

// 모델 관계 설정
User.associate(db);
Post.associate(db);
Like.associate(db);
Comment.associate(db);
Push_subscription.associate(db);
Notification.associate(db);

export default db;