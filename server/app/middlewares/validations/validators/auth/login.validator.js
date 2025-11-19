/**
 * @file app/middlewares/validations/validators/auth/login.validator.js
 * @description 로그인용 유효성 체크
 * 251119 v1.0.0 mastercat init
 */

// ===== 개별 export -> import =====
// import { email, password } from "../../fields/user.field.js";
// export default [ email, password ];

// ===== 객체 export -> import =====
import userField from "../../fields/user.field.js";
export default [ userField.email, userField.password ];
