/**
 * @file app/repositories/post.repository.js
 * @description Post Repository
 * 251128 v1.0.0 mastercat init
 */

import db from '../models/index.js';
const { sequelize, Post, Comment } = db;

async function pagination(t = null, data) {
  // SELECT * FROM posts LIMIT 6 OFFSET 6*?
  return await Post.findAll(
    {
      order: [
        ['createdAt', 'DESC'],
        ['updatedAt', 'DESC'],
        ['id', 'ASC'],
      ],
      limit: data.limit,
      offset: data.offset,
    },
    {
      transaction: t,
    }
  );
}

async function findByPk(t= null, id) {
  return await Post.findByPk(
    id,
    {
      include: [
        {
          model: Comment,
          as: 'postToComment',
          where: {
            replyId: 0
          },
          required: false,  // LEFT JOIN 설정 (comment가 없는 post도 가져와야함)
        }
      ],
      transaction: t,
    },
  )
}

export default {
  pagination,
  findByPk,
}