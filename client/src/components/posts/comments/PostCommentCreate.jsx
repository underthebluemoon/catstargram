import { useState } from "react";
import "./PostCommentCreate.css";
import { useDispatch } from "react-redux";
import { postShowThunk } from "../../../store/thunks/postShowThunk.js";
import { commentCreateThunk } from "../../../store/thunks/commentCreateThunk.js";

export default function PostCommentCreate({ postId, replyId = 0 }) {
  const dispatch = useDispatch();
  const [ content, setcontent ] = useState('');

  async function handleCommentStore(e) {
    e.preventDefault();

  }
  async function storeComment() {
    await dispatch(commentCreateThunk({ postId, replyId, content })).unwrap();
    await dispatch(postShowThunk(postId));
  }
  
  return (
    <>
      <form className="post-comment-create-box" onSubmit={handleCommentStore}>
        <input
          type="text"
          className="post-comment-create-input-add"
          onChange={(e) => { setcontent(e.target.value)}}
          placeholder={`add comments...`}
        />
        <div
          className="post-comment-create-btn-add"
          style={{ backgroundImage: `url("/icons/btn-add.png")` }}
          onClick={storeComment}
        ></div>
      </form>
    </>
  );
}
