import { useMutation, useQuery } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Avatar from '../../components/Avatar'
import Post from '../../components/Post'
import { ADD_COMMENT } from '../../graphql/mutations'
import { GET_POST_BY_POST_ID } from '../../graphql/queries'
import TimeAgo from 'react-timeago'
import { Jelly } from '@uiball/loaders'

type FormData = {
  comment: string
}

function PostPage() {

  const { 
    register,
    setValue, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {

    const notification = toast.loading('posting your comment...')

    await addComment({
      variables: {
        post_id: router.query.postId,
        username: session?.user?.name,
        text: data.comment
      }
    })

    setValue('comment','');

    toast.success('comment succesfully created', {id: notification})

  }

  const router = useRouter()

  const [addComment] = useMutation(ADD_COMMENT, 
    {refetchQueries: [GET_POST_BY_POST_ID,'getPost']})

  const {data} = useQuery(GET_POST_BY_POST_ID, {variables:{id: router.query.postId}})

  const post: Post = data?.getPost;

  const {data: session} = useSession();
  
  return !post ? 
  (
    <div>
      <Jelly size={50} color='#ff4501' />
    </div>
  )
  :

  (
    <div className='my-7 max-w-5xl mx-auto'>
      <Post post={post} />
        <div className='-mt-1 bg-white p-5 pl-16
        rounded-b-md border border-t-0 border-gray-300'>
          <p className='text-sm'>
            Comment as <span className='text-red-500'>{session?.user?.name}</span>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-2'>
            <textarea className='h-24 rounded-md border border-gray-200 p-2 pl-4
            outline-none disabled:bg-gray-50' 
            placeholder={session ? 'What are your thoughts?' : 'Please sign in to comment'}
            {...register('comment')}
            />

            <button type='submit' 
            className='rounded-full bg-red-500 p-3 font-semibold text-white
            disabled:bg-gray-200'>
              Comment
            </button>

          </form>
        </div>

        <div className='-my-5 rounded-b-md border border-t-0 border-gray-300
        bg-white py-5 px-10'>
          <hr className='py-2' />

          {post?.commentList.map(comment =>(
            <div key={comment.id}>
              <div className='relative flex items-center space-x-2 space-y-5'>
                <Avatar seed={comment.username} />
              </div>

              <div className='flex flex-col'>
                <p className='py-2 text-xs test-gray-400'>
                  {comment.username}
                  <span> </span>
                  <TimeAgo date={comment.created_at} />
                </p>
                <p>{comment.text}</p>
              </div>

            </div>
          ))}

        </div>

    </div>
  )
}

export default PostPage