/**
 * @file app/controllers/posts.controller.js
 * @description 게시글 관련 컨트롤러
 * 251128 v1.0.0 mastercat
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";
import postsService from "../services/posts.service.js";


/**
 * 게시글 리스트 조회 컨트롤러
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 */
async function index(req, res, next) {
  try {
    //                ↱ 문자열 → 숫자로 변환
    const page = req.query?.page ? parseInt(req.query.page) : 1;

    const { count, rows } = await postsService.pagination(page);

    const responseData = {
      page: page,
      limit: 6,
      count: count,
      posts: rows,
    }

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, responseData));
  } catch(error) {
    return next(error);
  }
}

/**
 * 게시글 상세 조회 컨트롤러
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 */
async function show(req, res, next) {
  try {
    const result = await postsService.show(req.params.id);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch(error) {
    return next (error)
  }
}

/**
 * 게시글 작성 컨트롤러
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 */
async function store(req, res, next) {
  // console.log(req.user.id);
  // console.log(req.body.content);
  // console.log(req.body.image);

  try {
    const data = {
      userId: req.user.id,
      content: req.body.content,
      image: req.body.image,
    }
    const result = await postsService.store(data)

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch(error) {
    return next(error)
  }
}

/**
 * 게시글 삭제 컨트롤러
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 */
async function destroy(req, res, next) {
  try {
    // console.log('컨트롤러 - 포스트 아이디', req.params.id);
    const data = {
      userId: req.user.id,
      postId: req.params.id,
    }
    const result = await postsService.destroy(data)

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch(error) {
    return next(error);
  }
}

export default {
  index,
  show,
  store,
  destroy,
}