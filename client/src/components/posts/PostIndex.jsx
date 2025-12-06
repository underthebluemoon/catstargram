import "./PostIndex.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

import { postIndexThunk } from "../../store/thunks/postIndexThunk.js";
import { clearPostIndex } from '../../store/slices/postIndexSlice.js';

export default function PostIndex() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, page, isLasted } = useSelector(state => state.postIndex);

  useEffect(() => {
    dispatch(postIndexThunk(page + 1));

    return () => {
      dispatch(clearPostIndex());
    }
 
  }, []);

  function nextPage() {
    dispatch(postIndexThunk(page + 1));
  }

  function redirectPostShow(id) {
    navigate(`/posts/show/${id}`);
  }

  return (
    <>
      <div className="post-index-container">
        <div className="post-index-card-box">
          {
            list && list.map(item => {
              return <div className="post-index-card" 
                      style={{ backgroundImage: `url("${item.image}")` }}
                      key={item.id}
                      onClick={() => { redirectPostShow(item.id) }}
                     ></div>
            })
          }
        </div>
        {
          !isLasted &&
            <button type="button" className="btn-full-width bg-gray" onClick={() => nextPage()}>
              Show more posts from Kanna_Kamui
            </button>
        }
      </div>
    </>
  );
}
