/**
 * @file app/utils/social/social.kakao.util
 * @description 카카오 소셜 로그인 유틸리티 
 * 251204 v1.0.0 mastercat init
 */

/**
 * 카카오 인가 코드 발급 URL 생성
 * @returns {string} URL
 */
function getAuthrizeURL() {
  const params = {
    client_id: process.env.SOCIAL_KAKAO_REST_API_KEY,
    redirect_uri: `${process.env.APP_URL}${process.env.SOCIAL_KAKAO_CALLBACK_URL}`,
    response_type: 'code',
    // prompt: 'login',
    // TODO : 나중에 다시 살릴 것 (테스트 용이성을 위해 잠시 지워둠)
  };
  const queryParams = new URLSearchParams(params).toString();

  return `${process.env.SOCIAL_KAKAO_API_URL_AUTHORIZE}?${queryParams}`;
};

function getTokenRequest(code) {
  const headers = {
    //      ↱ 하이픈 때문에 '-' 따옴표 필요
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  };
  const params = {
    grant_type: 'authorization_code',
    client_id: process.env.SOCIAL_KAKAO_REST_API_KEY,
    redirect_uri: `${process.env.APP_URL}${process.env.SOCIAL_KAKAO_CALLBACK_URL}`,
    code: code,
  };
  //      ↱ x-www-form-urlencoded;charset=utf-8 요청 데이터 타입
  const searchParams = new URLSearchParams(params);

  return { headers, searchParams };
}

function getUserRequest(token) {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  };
  const params = {
    secure_resource: true
  };

  const searchParams = new URLSearchParams(params);

  return { headers, searchParams };
}

function getLogoutRequest(id, token) {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  };
  const params = {
    target_id_type: 'user_id',
    target_id: id
  };

  const searchParams = new URLSearchParams(params);
  
  return { headers, searchParams };

}


export default {
  getAuthrizeURL,
  getTokenRequest,
  getUserRequest,
  getLogoutRequest,
}
