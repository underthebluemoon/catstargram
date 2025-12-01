/**
 * @file app/repositories/post.repository.js
 * @description Post Repository
 * 251128 v1.0.0 mastercat init
 */

import db from '../models/index.js';
const { sequelize, Post, Comment } = db;

// 페이지 네이션
async function pagination(t = null, data) {
  // SELECT * FROM posts LIMIT 6 OFFSET 6*?

  // return await Post.findAll(
  //   {
  //     order: [
  //       ['createdAt', 'DESC'],
  //       ['updatedAt', 'DESC'],
  //       ['id', 'ASC'],
  //     ],
  //     limit: data.limit,
  //     offset: data.offset,
  //   },
  //   {
  //     transaction: t,
  //   }
  // );

  // count + 검색한 레코드
  return await Post.findAndCountAll(
    {
      order: [
        ['createdAt', 'DESC'],
        ['updatedAt', 'DESC'],
        ['id', 'ASC'],
      ],
      limit: data.limit,
      offset: data.offset,
      transaction: t,
    },
  );
}

/**
 * 게시글 ID로 조회(최상위 댓글 포함)
 * @param {import("sequelize").Transaction|null} t 
 * @param {import("../services/posts.service.type.js").Id} id 
 * @returns {Promise<import("../models/Post.js").Post>}
 */
async function findByPkWithComments(t = null, id) {
  return await Post.findByPk(
    id,
    {
      include: [
        {
          model: Comment,
          as: 'comments',
          where: {
            replyId: 0
          },
          required: false, // Left Join 설정
        }
      ],
      transaction: t
    }
  );
}

/**
 * 게시글 ID로 조회(최상위 댓글 포함)
 * @param {import("sequelize").Transaction|null} t 
 * @param {import("../services/posts.service.type.js").Id} id 
 * @returns {Promise<import("../models/Post.js").Post>}
 */
async function findByPk(t = null, id) {
  return await Post.findByPk(
    id,
    {
      transaction: t
    }
  );
}

// 게시글 작성
async function create(t=null, data) {
  return await Post.create(
    {
      userId: data.userId,
      content: data.content,
      image: data.image,
    },
    {
      transaction: t,
    }
  )
}

// // 게시글 삭제
// async function destroy(t=null, data) {
//   return await Post.destroy(
//     {
//       where: {
//         userId: data.userId,
//         id: data.postId
//       }
//     },
//     {
//       transaction: t,
//     }
//   )
// }

/**
 * 게시글 삭제
 * @param {import("sequelize").Transaction|null} t 
 * @param {import("../services/posts.service.type.js").Id} id 
 * @returns {Promise<number>}
 */
async function destroy(t = null, id) {
  return await Post.destroy(
    {
      where: { id : id },
      transaction: t
    }
  );
}

export default {
  pagination,
  findByPkWithComments,
  findByPk,
  create,
  destroy,
}