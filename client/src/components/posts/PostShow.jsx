import "./PostShow.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostComment from "./comments/PostComment.jsx";
import PostDelete from "./PostDelete.jsx";
import { useDispatch, useSelector } from "react-redux";
import { postShowThunk } from "../../store/thunks/postShowThunk.js";
import { clearPostShow } from "../../store/slices/postShowSlice.js";

export default function PostShow() {
  const { id } = useParams();  // 세그먼트 파라미터 바로 가져오기
  const dispatch = useDispatch();
  const { show } = useSelector(state => state.postShow);
  const [openDeleteFlg, setOpenDeleteFlg] = useState(false);
  
  useEffect(() => {
    dispatch(postShowThunk(id))

    return () => {
      dispatch(clearPostShow());
    }
  }, []);


  function openDeleteModal() {
    setOpenDeleteFlg(true);
  }
  function closeDeleteModal() {
    setOpenDeleteFlg(false);
  }

  return (
    <>
      {
        show && (
          <div className="post-show-container">
            <div className="post-show-post-box bottom-line">
              <img className="post-show-post-img" src={`${show.image}`}></img>
              <div className="post-show-post-info-items">
                <div className="icon-delete" onClick={openDeleteModal}></div>
                <div className="post-show-post-likes-items">
                  <p>1919</p>
                  <div className="icon-heart-fill"></div>
                </div>
              </div>
              <textarea
                className="post-show-post-constent"
                defaultValue={show.content}
              ></textarea>
            </div>
            <PostComment id={id} comment={show.postToComment} />
          </div>
        )
      }
      {
        openDeleteFlg && <PostDelete setCloseDeleteModal={closeDeleteModal} />
      }
    </>
  );
}
