import "./Header.css";

import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";

import UserInfo from "./UserInfo.jsx";
import { logoutThunk } from '../../store/thunks/authThunk.js';
import { clearAuth } from '../../store/slices/authSlice.js';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.auth)

  const onlyTitleList = ["/login", "/registration"];
  const onlyTitleFlg = onlyTitleList.some((path) => path === location.pathname);

  function redirectLogin() {
    navigate(`/login`);
  }
  function redirectRegistration() {
    navigate(`/registration`);
  }
  function redirectPosts() {
    navigate(`/posts`);
  }

  async function logout() {
    try {
      navigate('/posts');
      const result = await dispatch(logoutThunk());
      if(result.type.endsWith('/rejected')) {
        throw result.payload;
      }
      dispatch(clearAuth());
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="header-container">
        <div
          className={` ${(onlyTitleFlg && "header-top") || "header-top-grid"}`}
        >
          <h1 
            className={`${(onlyTitleFlg && "header-top-title-only") || ""}`}
            onClick={redirectPosts}
          >
            CatStargram
          </h1>
          {!onlyTitleFlg && (
            <div className="header-top-btn-box">
              {(isLoggedIn && (
                <button type="button" className="btn-small bg-dark" onClick={logout}>
                  Logout
                </button>
              )) || (
                <>
                  <button 
                    type="button" className="btn-small bg-gray"
                    onClick={redirectLogin}
                  >
                    Sign In
                  </button>
                  <button 
                    type="button" className="btn-small bg-light"
                    onClick={redirectRegistration}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        { isLoggedIn && <UserInfo /> }
      </div>
    </>
  );
}
