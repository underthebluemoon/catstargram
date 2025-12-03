import "./PostCreate.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { postImageUploadThunk } from "../../store/thunks/postCreateThunk.js";
import { postStoreThunk } from "../../store/thunks/postCreateThunk.js";

export default function PostCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  async function handleCreate(e) {
    e.preventDefault();

    try {
      // 파일 업로드 처리
      const resultUpload = await dispatch(postImageUploadThunk(file)).unwrap();
        // 파일 업로드 url 획득
      const image = resultUpload.data.path

      // 게시글 작성
      const resultStore = await dispatch(postStoreThunk({ content, image })).unwrap();

      // 작성한 게시글 상세로 이동
      return navigate(`/posts/show/${resultStore.data.id}`, {replace: true});
    } catch (error) {
      console.log('게시글 생성 오류: ', error);
      return alert('게시글 생성 실패');
    }
  }

  // 파일 변경 시 처리 함수
  function changeFiles(e) {
    // 선택 파일 정보 획득 (1개의 파일만 올리는 걸 전제. multiple 속성으로 여러개 업로드 가능)
    // 변수 섀도잉(variable shadowing)
    const file = e.target.files[0];

    // 미리보기
    const fileReader = new FileReader();
      //        ↱
    fileReader.readAsDataURL(file);
      //        ↱ 'load' 완료 되었을 때, 이벤트 발생 : fileReader의 result를 preview로 설정
    fileReader.addEventListener('load', () => { setPreview(fileReader.result) });
    
    setFile(file);
  }

  return (
    <>
      <form className="post-create-container" onSubmit={handleCreate}>
        <textarea
          className="post-create-textarea"
          onChange={e => { setContent(e.target.value) }}
          placeholder="내용 작성"
        ></textarea>
        <input type="file" accept="image/*" onChange={changeFiles} />
        {
          preview && (
            <div
              className="post-create-image"
              style={{ backgroundImage: `url("${preview}")` }}
            ></div>
          )
        }
        
        <button type="submit" className="btn-big bg-gray">Write</button>
      </form>
    </>
  );
}
