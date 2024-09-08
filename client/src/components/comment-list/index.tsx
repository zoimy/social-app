// import React, { useState } from 'react';
// import { useCreateCommentMutation, useGetCommentsQuery } from '../../app/services/commentsApi';
// import Typography from '../typography';
// import CommentCreate from '../comment-create'; // Make sure this component accepts parentCommentId

// interface CommentListProps {
//   postId: string;
//   parentCommentId?: string; // Optional for top-level comments
// }

// const CommentList: React.FC<CommentListProps> = ({ postId, parentCommentId}) => {
//   const [newComment, setNewComment] = useState<string>('');
//   const [createComment] = useCreateCommentMutation();
//   const { data: comments = [], isLoading } = useGetCommentsQuery({ postId, parentCommentId });

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (newComment.trim()) {
//       try {
//         await createComment({ content: newComment, postId, parentCommentId }).unwrap();
//         setNewComment('');
//       } catch (error) {
//         console.error('Failed to create comment', error);
//       }
//     }
//   };

//   if (isLoading) return <p>Loading...</p>;

//   return (
//     <div className='ml-4'> {/* Add some margin to indent nested comments */}
//       {comments.map(comment => (
//         <div key={comment.id} className="mb-4">
//           <Typography>{comment.content}</Typography>
//           {/* Recursive rendering for nested comments */}
//           <CommentList postId={postId} parentCommentId={comment.id} />
//         </div>
//       ))}
//       <form onSubmit={handleSubmit} className="mt-2">
//         <textarea
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Add a comment..."
//           className="w-full p-2 border rounded"
//         />
//         <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Comment</button>
//       </form>
//     </div>
//   );
// };

// export default CommentList;
