import './PostComment.css';

import PostCommentCreate from './PostCommentCreate.jsx';
import PostCommentItem from './PostCommentItem.jsx';

export default function PostComment({ id, comment }) {

  
  return (
    <>
      <div className="post-comment-container">
        <p className='post-comment-title'>Comments</p>

        {/* prop으로 postId를 전달하여 어떤 게시물에 대한 댓글인지 식별 */}
        <PostCommentCreate postId={id} />
        <div className="post-comment-item-container">
          {
            // 'comments' 배열의 각 댓글 객체를 PostCommentItem 컴포넌트로 변환
            ( (comment && comment.length > 0) && (comment.map(comment => {
              return (
                <PostCommentItem comment={comment} key={comment.id} />
              )
            })))
          }
        </div>
      </div>
    </>
  )
}