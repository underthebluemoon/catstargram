/**
 * @file databases/config/sequelize-cli.config.js
 * @description sequelize-cli 설정 파일
 * 251117 v1.0.0 mastercat 최초 작성
 */

import '../../configs/env.config.js';

export default {
  // 각 환경에서 사용할 sequelize-cli 에서 가져올 env 설정
  // development, test, production 구조 필수
  //   -> env 로직이 있기 때문에 추가 설정 필요 없음
  development: {
    username: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    database: process.env.DB_MYSQL_DB_NAME,
    host: process.env.DB_MYSQL_HOST,
    port: process.env.DB_MYSQL_PORT,
    dialect: process.env.DB_MYSQL_DIALECT,
    timezone: process.env.DB_MYSQL_TIMEZONE
  },
  test: {
    username: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    database: process.env.DB_MYSQL_DB_NAME,
    host: process.env.DB_MYSQL_HOST,
    port: process.env.DB_MYSQL_PORT,
    dialect: process.env.DB_MYSQL_DIALECT,
    timezone: process.env.DB_MYSQL_TIMEZONE
  },
  production: {
    username: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    database: process.env.DB_MYSQL_DB_NAME,
    host: process.env.DB_MYSQL_HOST,
    port: process.env.DB_MYSQL_PORT,
    dialect: process.env.DB_MYSQL_DIALECT,
    timezone: process.env.DB_MYSQL_TIMEZONE
  }
};