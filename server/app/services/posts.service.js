/**
 * @file app/sevices/posts.service.js
 * @description post Service
 * 251128 mastercat init
 */

import db from "../models/index.js";
import postRepository from "../repositories/post.repository.js";

async function pagination(page) {
  
  const limit = 6;
  const offset = limit * (page - 1);
  { limit, offset }

  return await postRepository.pagination(null, { limit, offset });
}

async function show(id) {
  return await postRepository.findByPk(null, id);
}

async function create(data) {
  return await db.sequelize.transaction(async t => {
  
    return await postRepository.create(t, data)
  })
}

export default {
  pagination,
  show,
  create,
}