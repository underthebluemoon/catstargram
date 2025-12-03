import "./PostCreate.css";
import { useState } from "react";

export default function PostCreate() {

  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  async function handleCreate(e) {
    e.preventDefault();
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
        
        <button type="submit" className="btn-big bg-gray">
          Write
        </button>
      </form>
    </>
  );
}
