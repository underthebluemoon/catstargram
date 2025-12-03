import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

export const postShowThunk = createAsyncThunk(
  'postShow/postShowThunk',  // Thunk 고유명
  async (id, { rejectWithValue }) => {
    try {
      const url = `/api/posts/${id}`;
      //                                    ↱ get 메소드일 때 데이터를 백엔드로 보내는 법
      //                                      1. 세그먼트 파마리터, 2. 쿼리스트링
      const response = await axiosInstance.get(url)
      //                                              ↳ page가 2인 경우 → { params } = { params: { page: 2 } }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }

  }
);