import { useSelector } from "react-redux";
import "./UserInfo.css";
import { useNavigate } from 'react-router-dom';

export default function UserInfo() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  function redirectPosts() {
    navigate('./posts');
  }
  function redirectPostCreate() {
    navigate('./posts/create');
  }
  function redirectUserInfo() {
    navigate(`/users/${user?.id}`);
  }

  return (
    <>
      <div className="user-info-container bottom-line">
        <div
          className="profile profile-medium"
          style={{ backgroundImage: `url("${user?.profile}")` }}
        ></div>
        <div className="user-info-controll-box">
          <div className="user-info-stat-items">
            <p className="user-info-stat-name">{user?.nick}</p>
            <p className="user-info-stat-etc">posts 1911</p>
          </div>
          <div className="user-info-btn-items">
            <div
              className="user-info-btn"
              style={{ backgroundImage: `url("/icons/btn-post-index.png")` }}
              onClick={redirectPosts}

            ></div>
            <div
              className="user-info-btn"
              style={{ backgroundImage: `url("/icons/btn-add.png")` }}
              onClick={redirectPostCreate}
            ></div>
            <div
              className="user-info-btn"
              style={{ backgroundImage: `url("/icons/btn-user-index.png")` }}
              onClick={redirectUserInfo}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
