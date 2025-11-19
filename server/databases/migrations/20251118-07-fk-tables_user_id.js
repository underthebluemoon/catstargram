/**
 * @file databases/migrations/20251118-07-fk-tables_user_id.js
 * @description Add user_id fk constraint
 * 251118 v1.0.0 mastercat
 */

import { DataTypes } from 'sequelize';


/** @type {import('sequelize-cli').Migration} */
export default {
  // up ↔ donw : 세트. 상반되는 반대 처리

  //     ↱ constraint (fk) 추가
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint(
      'posts',                      // constraint 생성할 테이블
      {
        fields: ['user_id'],        // constraint 부여할 컬럼
        type: 'foreign key',        // 적용할 constraint
        name: 'fk_posts_user_id',  // constraint 명
        references: {           // 참조 설정
          table: 'users',       // 참조할 테이블
          field: 'id',          // 참조 컬럼 지정
        },
        onDelete: 'CASCADE',  // 참조 컬럼이 삭제되면 post의 레코드 삭제(하드) 됨
      }
    );
    await queryInterface.addConstraint(
      'likes',                      // constraint 생성할 테이블
      {
        fields: ['user_id'],        // constraint 부여할 컬럼
        type: 'foreign key',        // 적용할 constraint
        name: 'fk_likes_user_id',  // constraint 명
        references: {           // 참조 설정
          table: 'users',       // 참조할 테이블
          field: 'id',          // 참조 컬럼 지정
        },
        onDelete: 'CASCADE',  // 참조 컬럼이 삭제되면 post의 레코드 삭제(하드) 됨
      }
    );
    await queryInterface.addConstraint(
      'comments',                      // constraint 생성할 테이블
      {
        fields: ['user_id'],        // constraint 부여할 컬럼
        type: 'foreign key',        // 적용할 constraint
        name: 'fk_comments_user_id',  // constraint 명
        references: {           // 참조 설정
          table: 'users',       // 참조할 테이블
          field: 'id',          // 참조 컬럼 지정
        },
        onDelete: 'CASCADE',  // 참조 컬럼이 삭제되면 post의 레코드 삭제(하드) 됨
      }
    );
    await queryInterface.addConstraint(
      'push_subscriptions',                      // constraint 생성할 테이블
      {
        fields: ['user_id'],        // constraint 부여할 컬럼
        type: 'foreign key',        // 적용할 constraint
        name: 'fk_push_subscriptions_user_id',  // constraint 명
        references: {           // 참조 설정
          table: 'users',       // 참조할 테이블
          field: 'id',          // 참조 컬럼 지정
        },
        onDelete: 'CASCADE',  // 참조 컬럼이 삭제되면 post의 레코드 삭제(하드) 됨
      }
    );
    await queryInterface.addConstraint(
      'notifications',                      // constraint 생성할 테이블
      {
        fields: ['user_id'],        // constraint 부여할 컬럼
        type: 'foreign key',        // 적용할 constraint
        name: 'fk_notifications_user_id',  // constraint 명
        references: {           // 참조 설정
          table: 'users',       // 참조할 테이블
          field: 'id',          // 참조 컬럼 지정
        },
        onDelete: 'CASCADE',  // 참조 컬럼이 삭제되면 post의 레코드 삭제(하드) 됨
      }
    );
  },
  
  //     ↱ constraint (fk) 삭제
  async down (queryInterface, Sequelize) {
    //                                      ↱ table    ↱ constraint 이름
    await queryInterface.removeConstraint('posts', 'fk_posts_user_id');
    await queryInterface.removeConstraint('likes', 'fk_likes_user_id');
    await queryInterface.removeConstraint('comments', 'fk_comments_user_id');
    await queryInterface.removeConstraint('push_subscriptions', 'fk_push_subscriptions_user_id');
    await queryInterface.removeConstraint('notifications', 'fk_notifications_user_id');
  }
};
