/**
 * @file databases/migrations/20251118-01-create-posts.js
 * @description posts migration file
 * 251118 v1.0.0 mastercat
 */

import { DataTypes } from 'sequelize';

// 테이블명
const tableName = 'posts';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '게시글 PK',
  },
  userId: {
    field: 'user_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '유저 PK',
  },
  content: {
    field: 'content',
    type: DataTypes.STRING(2000),
    allowNull: false,
    comment: '게시글 내용',
  },
  image: {
    field: 'image',
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: null,
    comment: '게시글 이미지',
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    allowNull: false,  // 프로그램단에서 자동으로 값이 적용
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    allowNull: false,
  },
  deletedAt: {
    field: 'deleted_at',
    type: DataTypes.DATE,
    allowNull: true,
  },
};

// 옵션
const options = {
  charset: 'utf8mb4',             // 테이블 문자셋 설정 : 이모지 지원
  collate: 'utf8mb4_0900_ai_ci',  // 정렬 방식 설정 : 악센트, 대/소문자 미구별 (기본 설정)
  engine: 'InnoDB',               // 사용 엔진 설정
};

// ↱ export한 return type : migration
/** @type {import('sequelize-cli').Migration} */
export default {
  // up ↔ donw : 세트. 상반되는 반대 처리

  //     ↱ up() : 스키마 생성과 관련. migration 실행 시 호출되는 메소드
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, attributes, options);
  },
  
  //     ↱ down() : 스키마 제거, 수정 관련. migration 롤백 시 호출되는 메소드
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  }
};
