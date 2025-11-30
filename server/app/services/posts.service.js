/**
 * @file app/sevices/posts.service.js
 * @description post Service
 * 251128 mastercat init
 */

import { NOT_FOUND_ERROR, UNMATCHING_USER_ERROR } from "../../configs/responseCode.config.js";
import myError from "../errors/customs/my.error.js";
import db from "../models/index.js";
import postRepository from "../repositories/post.repository.js";

// 페이지 네이션
async function pagination(page) {
  
  const limit = 6;
  const offset = limit * (page - 1);
  { limit, offset }

  return await postRepository.pagination(null, { limit, offset });
}

// 상세 페이지
async function show(id) {
  return await postRepository.findByPk(null, id);
}

// 게시글 작성
async function create(data) {
  return await db.sequelize.transaction(async t => {
  
    return await postRepository.create(t, data)
  })
}

// 게시글 삭제
async function destroy(data) {
  return await db.sequelize.transaction(async t => {
    // console.log('서비스 - data:', data)
    
    // 게시글 조회
    const post = await postRepository.findByPk(null, data.postId)
    // console.log('서비스 - 게시글:', post.dataValues)
    if(!post) {
      throw myError('게시글을 찾을 수 없습니다.', NOT_FOUND_ERROR)
    }
    
    // 게시글 작성자 체크
    if(data.userId !== post.dataValues.userId) {
      throw myError('유저와 포스트 작성자 불일치', UNMATCHING_USER_ERROR)
    }
  
    // 삭제
    return await postRepository.destroy(t, data)
  })
}

export default {
  pagination,
  show,
  create,
  destroy,
}