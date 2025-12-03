/**
 * @file app/middlewares/validations/validators/posts/store.validator.js
 * @description 댓글 작성 검사
 * 251203 v1.0.0 mastercat init
 */

import { content, postId, replyId } from "../../fields/comment.field.js";

export default [postId, replyId, content];