import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Textarea } from '@nextui-org/react';
import ErrorMessage from '../error-message';
import { MdCreate } from 'react-icons/md';
import { useCreateCommentMutation } from '../../app/services/commentsApi';
import { useParams } from 'react-router-dom';
import { useLazyGetPostByIdQuery } from '../../app/services/postsApi';

interface CommentCreateProps {
  parentCommentId?: string;
}

const CommentCreate: React.FC<CommentCreateProps> = ({ parentCommentId }) => {
  const { id } = useParams<{ id: string }>();
  const [createComment] = useCreateCommentMutation();
  const { handleSubmit, formState: { errors }, control, setValue } = useForm();
	const [triggerGetPostById] = useLazyGetPostByIdQuery()

  const handleCommentCreateSubmit = handleSubmit(async (data) => {
    try {
      if (id) {
        await createComment({ 
          content: data.comment, 
          postId: id, 
          parentCommentId 
        }).unwrap();
				await triggerGetPostById(id).unwrap()
        setValue("comment", '');
      }
    } catch (error) {
      console.log("error", error);
    }
  });

  const error = errors?.comment?.message as string;

  return (
    <form className='max-w-[600px] mx-auto w-full' onSubmit={handleCommentCreateSubmit}>
      <Controller
        name='comment'
        control={control}
        defaultValue=''
        rules={{ required: "Required field" }}
        render={({ field }) => (
          <Textarea
            {...field}
            fullWidth
            placeholder='Express your feelings!'
            labelPlacement='outside'
            className='w-full mt-5'
          />
        )}
      />
      {errors && <ErrorMessage error={error} />}
      <Button color='primary' type='submit' className='flex justify-center mt-4' startContent={<MdCreate />}>
        Send Comment
      </Button>
    </form>
  );
};

export default CommentCreate;
