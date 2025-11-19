/**
 * @file databases/migrations/20251118-06-alter.notifications-is_read.js
 * @description notifications-is_read change
 * 251118 v1.0.0 mastercat
 */

import { DataTypes } from 'sequelize';

// 테이블명
const tableName = 'notifications';

// 키명 (변경할 컬럼명)
const key = 'is_read';

// 컬럼 정의
  // up ↔ donw : 세트. 상반되는 반대 처리

// 변경용
const upAttributes = {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: false,
  comment: '읽음 여부'
};

// undo용
const downAttribute = {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
    comment: '읽음 여부',
}

// 옵션
const options = {
};

// ↱ export한 return type : migration
/** @type {import('sequelize-cli').Migration} */
export default {
  // up ↔ donw : 세트. 상반되는 반대 처리

  //     ↱ migrate 시 변경될 내용 (upAttributes)
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn(tableName, key, upAttributes);
  },
  
  //     ↱ undo 시 되돌릴 내용 (downAttributes) 롤백 시 호출되는 메소드
  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn(tableName, key, downAttribute);
  }
};
