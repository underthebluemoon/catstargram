/**
 * @file app/sevices/comments.service.js
 * @description comment Service
 * 251203 mastercat init
 */

import commentRepository from "../repositories/comment.repository.js"

/**
 * 코멘트 작성 처리
 * @param {{postId: string, userId: string, content: string}} data 
 */
async function store(data) {
  return await commentRepository.create(null, data);
}

export default {
  store,
}