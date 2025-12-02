import { useState } from 'react';
import './Login.css'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { loginThunk } from '../../store/thunks/authThunk.js';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ email, setEmail ] = useState('');
  const [ emailErr, setEmailErr ] = useState('');
  const [ password, setPassword ] = useState('');

  async function handleLogin(e) {
    // 기존 이벤트 취소
    e.preventDefault();

    try {
      // 로그인 요청
      //                                               payload 부분만 가져옴 ↰
      await dispatch(loginThunk({email, password})).unwrap();
      //                           ↱ history : 유저의 방문 이력남김
      //                             default : false -> 항상 남김
      return navigate('/posts', { replace: true })
    } catch(error) {
      // console.log(error);
      const code = error.responese?.data?.code;
      alert(`로그인 실패했습니다. ${code}`);
      // 에러 코드 확인해서 해당하는 메세지로 출력하는 로직 추구할 것 
    }
  }

  // validatio 예시
  // function validationAndSetEmail(e) {
  //   const val = e.target.value;

  //   if(/^[0-9]+$/.test(val)) {
  //     setEmail(e.target.value);
  //     setEmailErr(null);
  //   } else {
  //     setEmailErr('이메일 형식 오류');
  //   }
  // }


  return (
    <>
    {email} / {password}
      <form className="login-container" onSubmit={handleLogin}>
        {emailErr}
        <input 
          type="text" className='input-big-border' placeholder='email'
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          type="password" className='input-big-border' placeholder='password' 
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="btn-big bg-gray">Log in</button>
        <div className="text-on-line">or</div>
        <button type="button" className="btn-big bg-img-kakao"></button>
        <button type="button" className="btn-big bg-light">Sign up</button>
      </form>
    </>
  )
}
