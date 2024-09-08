import React, { useEffect, useState } from 'react';
import { useLikePostMutation, useDeletePostLikeMutation, useLikeCommentMutation, useDeleteCommentLikeMutation } from '../../app/services/likesApi';
import { useCreateCommentMutation, useDeleteCommentMutation, useGetCommentsQuery } from '../../app/services/commentsApi';
import { useDeletePostMutation, useLazyGetAllPostsQuery, useLazyGetPostByIdQuery } from '../../app/services/postsApi';
import { Link, useNavigate } from 'react-router-dom';
import { Card as NextCard, CardBody, CardFooter, CardHeader, Spinner } from '@nextui-org/react';
import User from '../user';
import { formatToClientDate } from '../../utils/format-to-client-date';
import { useSelector } from 'react-redux';
import { selectCurrent } from '../../features/user/userSlice';
import Typography from '../typography';
import MetaInfo from '../meta-info';
import { FaComment, FaRegComment, FaRegHeart } from 'react-icons/fa';
import ErrorMessage from '../error-message';
import { hasErrorField } from '../../utils/has-error-field';
import { BsReply } from 'react-icons/bs';
import CommentCreate from '../comment-create'; // Import the CommentCreate component
import { MdDelete } from 'react-icons/md';
import { FcDislike } from 'react-icons/fc';

type CardProps = {
	avatarUrl: string;
	name: string;
	authorId: string;
	content: string;
	commentId?: string;
	likesCount?: number;
	commentsCount?: number;
	createdAt?: Date;
	id?: string;
	cardFor: "comment" | "post" | "current-post";
	likedByUser?: boolean;
};

const Card: React.FC<CardProps> = ({
	avatarUrl = "",
	name = "",
	authorId = "",
	content = " ",
	commentId = "",
	likesCount = 0,
	commentsCount = 0,
	createdAt,
	id = "",
	cardFor = "post",
	likedByUser = false
}) => {
	const [likePost] = useLikePostMutation();
	const [deletePostLike] = useDeletePostLikeMutation();
	const [likeComment] = useLikeCommentMutation();
	const [deleteCommentLike] = useDeleteCommentLikeMutation();

	const { data: comments, isLoading } = useGetCommentsQuery({ postId: id })

	const [createComment] = useCreateCommentMutation();
	const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation();
	const [deletePost, deletePostStatus] = useDeletePostMutation();
	const [triggerGetAllPosts] = useLazyGetAllPostsQuery();
	const [triggerGetPostById] = useLazyGetPostByIdQuery();
	const [error, setError] = useState("");
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [likedCommentIds, setLikedCommentIds] = useState<string[]>([]);
	

	const navigate = useNavigate();
	const current = useSelector(selectCurrent);

	useEffect(() => {
		if (comments) {
			const likedComments = comments.filter(comment => comment.likedByUser).map(comment => comment.id);
			setLikedCommentIds(likedComments);
		}
	}, [comments])

	if (isLoading) {
		return <Spinner />
	}

	const refetchPosts = async () => {
		switch (cardFor) {
			case "post":
				await triggerGetAllPosts().unwrap();
				break;
			case "current-post":
				await triggerGetPostById(id).unwrap();
				break;
			case "comment":
				await triggerGetPostById(id).unwrap();
				break;
			default:
				throw new Error("Invalid cardFor value");
		}
	};

	const handleDelete = async () => {
		switch (cardFor) {
			case "post":
				await deletePost(id).unwrap();
				await refetchPosts();
				break;
			case "current-post":
				await deletePost(id).unwrap();
				navigate('/');
				break;
			case "comment":
				await deleteComment(commentId).unwrap();
				await refetchPosts();
				break;
			default:
				throw new Error("Invalid cardFor value");
		}
	};

	const handleClick = async () => {
		try {
			if (cardFor === "post" || cardFor === "current-post") {
				likedByUser
				? await deletePostLike(id).unwrap()
				: await likePost({ postId: id }).unwrap();
				await refetchPosts();
			}  else if (cardFor === "comment") {
				if (commentId) {
					if (likedCommentIds.includes(commentId)) {
						await deleteCommentLike({ commentId }).unwrap();
						setLikedCommentIds((prevIds) => prevIds.filter(id => id !== commentId)); 
					} else {
						await likeComment({ commentId }).unwrap();
						setLikedCommentIds((prevIds) => [...prevIds, commentId]); 
					}
				}
				await refetchPosts(); 
			}
		} catch (error) {
			if (hasErrorField(error)) {
				setError(error.data.error);
			} else {
				setError(error as string);
			}
		}
	};

	const getIconForLikes = () => {
		if (cardFor === "comment") {
			return likedCommentIds.includes(commentId || '') ? FcDislike : FaRegHeart;
		}
		return likedByUser ? FcDislike : FaRegHeart;
	};

	const getLikeCount = () => {
		if (cardFor === "comment" && commentId) {
			return likedCommentIds.includes(commentId) ? likesCount + 1 : likesCount;
		}
		return likesCount;
	};

	return (
		<NextCard className='max-w-[600px] mx-auto mb-5'>
			<CardHeader className='flex justify-between items-center bg-transparent'>
				<Link to={`/users/${authorId}`}>
					<User
						name={name}
						description={createdAt && formatToClientDate(createdAt)}
						avatarUrl={avatarUrl}
						className='text-small font-semibold leading-none text-default-600'
					/>
				</Link>
				{authorId === current?.id && (
					<div className='cursor-pointer' onClick={handleDelete}>
						{deletePostStatus.isLoading || deleteCommentStatus.isLoading ? (
							<Spinner />
						) : (
							<MdDelete size={24} />
						)}
					</div>
				)}
			</CardHeader>
			<CardBody className={'px-3 py-2 mb-5'}>
				<Link to={`/posts/${id}`}>
					<Typography>{content}</Typography>
				</Link>
				{/* {cardFor === "post" && <CommentList comments={comments || []} />} */}
				{cardFor === "comment" && showReplyForm && (
					<CommentCreate parentCommentId={id} />
				)}
			</CardBody>
			<CardFooter className='flex justify-between items-center'>
				<div className='flex gap-5 items-center'>
					<div onClick={handleClick}>
						<MetaInfo
							count={getLikeCount()}
							Icon={getIconForLikes()}
						/>
					</div>
					{cardFor !== "comment" && (
						<Link to={`/posts/${id}`}>
							<MetaInfo
								count={commentsCount}
								Icon={commentsCount > 0 ? FaComment : FaRegComment}
							/>
						</Link>
					)}
					{cardFor === "comment" && (
						<div
							onClick={() => setShowReplyForm(!showReplyForm)} 
							className='cursor-pointer'
						>
							<BsReply color='grey' size={26} />
						</div>
					)}
				</div>
				<ErrorMessage error={error} />
			</CardFooter>
		</NextCard>
	);
};

export default Card;
