/**
 * @file app/middlewares/auth/configs/role.permisions.js
 * @description 요청 별 접근 권한 설정
 * 251126 v1.0.0 mastercat init
 */

import ROLE from "./role.enum.js";
const { ADMIN, NORMAL, SUPER } = ROLE;

// 인증 및 인가가 필요한 요청만 정의
const ROLE_PERMISSIONS = {
  GET: [
    {
      // /api/posts/:id
      path: /^\/api\/posts\/[0-9]+$/, roles: [NORMAL, SUPER],
    },
    {
      // /api/comments/:id/:id
      path: /^\/api\/comments\/[0-9]+\/[0-9]+$/, roles: [NORMAL, SUPER],
    },
  ],
  POST: [
    {
      // /api/auth/logout
      path: /^\/api\/auth\/logout$/, roles: [NORMAL, SUPER]
    },
    {
      // /api/auth/reissue
      path: /^\/api\/auth\/reissue$/, roles: [NORMAL, SUPER],
    },
    {
      // /api/posts
      path: /^\/api\/posts$/, roles: [NORMAL, SUPER],
    },
    {
      // /api/comments
      path: /^\/api\/comments$/, roles: [NORMAL, SUPER],
    },
    {
      // /api/file/posts
      path: /^\/api\/files\/posts$/, roles: [NORMAL, SUPER],
    },
    // {
    //   // /api/file/profiles -> 회원가입에 프로필파일은 권한 불필요
    //   path: /^\/api\/files\/profiles$/, roles: [NORMAL, SUPER],
    // },
    {
      path: /^\/api\/subscriptions$/, roles: [NORMAL, SUPER],
    },
  ],
  PUT: [
    {
      // /api/users
      path: /^\/api\/users$/, roles: [NORMAL, SUPER],
    },
  ],
  DELETE: [
    {
      // /api/posts
      path: /^\/api\/posts\/[0-9]+$/, roles: [NORMAL, SUPER],
    },
  ],
}

Object.freeze(ROLE_PERMISSIONS);

export default ROLE_PERMISSIONS;