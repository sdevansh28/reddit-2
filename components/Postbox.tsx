import { LinkIcon, PhotographIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar';
import { useForm } from "react-hook-form";
import { useMutation, gql } from '@apollo/client'
import client from '../apollo-client';
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations';
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries';
import toast from 'react-hot-toast';

type FormData = {
  postTitle: string
  postBody: string
  postImage: string
  subreddit: string
}

type Props = {
  subreddit?:string
}

function PostBox({subreddit}:Props) {

  const {data: session} = useSession();
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [
      GET_ALL_POSTS,
      'getPostList'
    ]
  })
  const [addSubreddit] = useMutation(ADD_SUBREDDIT) 

  const { 
    register,
    setValue, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm<FormData>();

  const onSubmit = handleSubmit( async (formData) => {

    const notification = toast.loading('Creating a post...');

    try {
      
      const {data: {getSubredditListByTopic}} = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: { topic: subreddit || formData.subreddit},
      })

      const subredditExists = getSubredditListByTopic.length>0;

      if(!subredditExists){
        console.log('creating new subreddit');

        const {data: {insertSubreddit: newSubreddit}} =  await addSubreddit ({
          variables: { topic: formData.subreddit}
        })

        console.log('creating post...');
        const image = formData.postImage || '';
        
        const {data: {insertPost: newPost}} = await addPost ({
          variables: {
            body : formData.postBody,
            image: image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name
          }
        })

        console.log('new post added :', newPost)

      }
      else{

        console.log('using existing subreddt(s)...');
        console.log(getSubredditListByTopic);
            
        const image = formData.postImage || '';
      
        const {data: {insertPost: newPost}} = await addPost ({
          variables: {
            body : formData.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name
          }
        })
      }
      
      toast.success('new post created', {id: notification});
      setValue('postBody','');
      setValue('postImage','');
      setValue('postTitle','');
      setValue('subreddit','');

    } catch (error) {
      toast.error('whoops something went wrong', {id: notification})
    }

  })

  const [ImageBox, setImageBox] = useState(false);

  return (
    <form onSubmit={onSubmit} className='p-2 sticky top-16 z-50 border rounded-md border-gray-200 bg-white'>
      <div className='flex items-center space-x-3'>

        <Avatar />

        <input 
          {...register('postTitle', {required: true})}
          className='flex-1 pb-2 pt-1.5 pl-5 bg-gray-100 rounded-md outline-none border hover:border-blue-400'
          disabled={!session}
          type="text"
          placeholder={session ? 'Create a post' : 'Sign in to post' }
        />

        <PhotographIcon onClick={()=>setImageBox(!ImageBox)} 
          className={`h-6 text-gray-300 cursor-pointer ${ImageBox && 'text-blue-400'}`} 
        />
        <LinkIcon className='h-6 text-gray-300 cursor-pointer' />

      </div>

      { !!watch('postTitle') && (
        <div className='flex items-center px-2'>
          <p className='min-w-[90px]'>Body</p>
          <input
            {...register('postBody')}
            className='flex-1 m-2 p-2 outline-none bg-blue-50'
            disabled={!session}
            type="text"
            placeholder='Text (optional)'
          />
        </div>
      )}

      { !subreddit && !!watch('postTitle') && (
        <div className='flex items-center px-2'>
          <p className='min-w-[90px]'>Subreddit</p>
          <input
            {...register('subreddit', {required: true})}
            className='flex-1 m-2 p-2 outline-none bg-blue-50'
            disabled={!session}
            type="text"
            placeholder='i.e. reactjs'
          />
        </div>
      )}

      { !!watch('postTitle') && ImageBox && (
        <div className='flex items-center px-2'>
          <p className='min-w-[90px]'>Image URL</p>
          <input
            {...register('postImage')}
            className='flex-1 m-2 p-2 outline-none bg-blue-50'
            disabled={!session}
            type="URL"
            placeholder='optional...'
          />
        </div>
      )}

      {Object.keys(errors).length > 0 && 
        <div className='text-red-500 space-y-2 p-2'>
          {errors.postTitle?.type === 'required' &&
            <p>- A post title is required.</p>  
          }
          {errors.subreddit?.type === 'required' &&
            <p>- A subreddit is required.</p>  
          }
        </div>
      }

      { !!watch('postTitle') && (
        <button type='submit' 
        className='w-full m-1 px-2 py-1 border rounded-full bg-blue-400 text-white'>
          Create Post
        </button>
      )}

    </form>
  )
}

export default PostBox