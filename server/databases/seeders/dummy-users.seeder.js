/**
 * @file databases/seeders/dummy-users.seeder.js
 * @description create users dummy data
 * 251118 v1.0.0 mastercat init
 */

//      ↱ bcrypt: 단방향 암호화 라이브러리. (복호화 불가)
import bcrypt from 'bcrypt';

// 테이블명
const tableName = 'users';

/** @type {import('sequelize-cli').Migration} */
export default {
  // up ↔ down
  
  //     ↱ 실행용 (ex.생성)
  async up (queryInterface, Sequelize) {
    // 레코드 정보
    const records = [
      {
        email: 'admin@admin.com',
        //                      ↱ hash(): bcrypt에서 제공하는 비밀번호 암호화 메소드
        //                        hashSync(): await 없이 동기처리 가능 (하지만 작업 중 멈춰있기 때문에 bcrypt.hash()권장)
        //                            ↱ 사용할 문자
        //                                    ↱ salt: 암호화에 첨가하는 문자 갯수
        password: await bcrypt.hash('qwer1234', 10),
        nick: 'mastercat',
        provider: 'NONE',
        role: 'SUPER',
        profile: '',
        //  ↱ model 이용 전이므로 createdAt, updatedAt, deletedAt 수기 작성 필요
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'admin2@admin.com',
        password: await bcrypt.hash('qwer1234', 10),
        nick: 'mastercat2',
        provider: 'KAKAO',
        role: 'NORMAL',
        profile: '',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // 데이터 생성 : queryInterface.bulkInsert(tableName, records, options)
    //                    ↱ bulkInsert: 여러 개의 레코드 한 번에 추가
    //                                                   ↱ options : {} | 안 적어도 됨
    await queryInterface.bulkInsert(tableName, records, {})

  },

  //     ↱ 롤백용 (ex.삭제)
  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkInsert(tableName, records, options)
    //                                          ↱ null : 테이블 비움
    await queryInterface.bulkDelete(tableName, null, {});
  }
};
