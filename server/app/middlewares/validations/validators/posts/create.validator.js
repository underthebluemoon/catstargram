/**
 * @file app/middlewares/validations/validators/posts/create.validator.js
 * @description 게시글 작성 검사
 * 251129 v1.0.0 mastercat init
 */

import { content, image } from "../../fields/post.field.js";

export default [content, image];
