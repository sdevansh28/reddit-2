import { ArrowDownIcon, ArrowUpIcon, BookmarkIcon, ChatAltIcon, DotsHorizontalIcon, GiftIcon, ShareIcon } from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import TimeAgo from 'react-timeago'
import Link from 'next/link'
import { Jelly } from '@uiball/loaders'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_VOTES_BY_POST_ID } from '../graphql/queries'
import { ADD_VOTE, DELETE_VOTE} from '../graphql/mutations'
import toast from 'react-hot-toast'

type Props = {post: Post}

function Post({post} : Props) {
  if(!post) return (<div><Jelly size={50} color='#ff4501' /></div>)

  const {data: session} = useSession();

  const [vote,setVote] = useState<boolean>();
  const [voteCount,setVoteCount] = useState<number>(0);

  const {data,loading} = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {id: post?.id}
  })

  const [addVote] = useMutation(ADD_VOTE,{
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID, 'getVotesUsingPost_id']
  });

  const [deleteVote] = useMutation(DELETE_VOTE,{
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID, 'getVotesUsingPost_id']
  })

  const upVote = async (isUpvote: boolean) => {
    if(!session){
      toast("! You'll need to sign in to vote.");
      return;
    }

    if(vote && isUpvote) return;
    if(vote === false && !isUpvote) return;

    const variables = {
      post_id: post.id,
      username: session?.user?.name,
      upvote: isUpvote
    }

    if(vote===undefined){
      await addVote({
        variables: variables
      })
    }
    else{
      await deleteVote({
        variables: {id: data?.getVotesUsingPost_id[0].id}
      })

      await addVote({
        variables: variables
      })
    }

  }

  useEffect(() => {
    const votes: Vote[] = data?.getVotesUsingPost_id

    const vote = votes?.find(vote => vote.username === session?.user?.name)?.upvote
    setVote(vote);
    let voteCnt=0;
    voteCnt += votes?.filter(vote => vote.upvote===true).length;
    voteCnt -= votes?.filter(vote => vote.upvote===false).length;
    setVoteCount(voteCnt);
    console.log(vote)

  },[data])

  return (
    
      <div className="flex cursor-pointer rounded-md border border-gray-300 bg-white
            shadow-sm hover:border hover:border-gray-600">
      {/* votes */}
        <div className='flex flex-col items-center justify-start space-y-1 
        rounded-l-md bg-gray-50 p-4 text-gray-400 '>
          <ArrowUpIcon onClick={()=>upVote(true)} className={`voteButtons hover:text-red-400 ${vote && 'text-red-400'} `} />
          <p className='text-xs font-bold text-black'>{voteCount}</p>
          <ArrowDownIcon onClick={()=>upVote(false)} className={`voteButtons hover:text-blue-400 ${vote===false && 'text-blue-400'}`} />
        </div>

      <Link href={`/post/${post.id}`}>
        <div className='p-3 pb-1'>
          {/* header */}
          <div className='flex items-center space-x-2'>
            <Avatar seed={post.subreddit[0]?.topic} />
            <p className='text-xs text-gray-400'>
              <Link href={`/subreddit/${post.subreddit[0]?.topic}`}>
                <span className='font-bold text-black hover:text-blue-400
                hover:underline'>r/{post.subreddit[0]?.topic} </span> 
              </Link>
              • Posted by u/{post.username} <TimeAgo date={post.created_at} />
            </p>
          </div>

          {/* body */}
          <div className='py-4'>
            <h2 className='text-xl font-semibold'>{post.title}</h2>
            <p className='mt-2 text-sm font-light'>{post.body}</p>
          </div>

          {/* image */}
          <img className='w-full' src={post.image} alt=''/>

          {/* footer */}
          <div className='flex space-x-4 text-gray-400'>
            <div className='postButtons'>
              <ChatAltIcon className='h-6 w-6' />
              <p className=''>{post.commentList.length} Comments</p>
            </div>
            <div className='postButtons'>
              <GiftIcon className='h-6 w-6' />
              <p className='hidden sm:inline'>Award</p>
            </div>
            <div className='postButtons'>
              <ShareIcon className='h-6 w-6' />
              <p className='hidden sm:inline'>Share</p>
            </div>
            <div className='postButtons'>
              <BookmarkIcon className='h-6 w-6' />
              <p className='hidden sm:inline'>Save</p>
            </div>
            <div className='postButtons'>
              <DotsHorizontalIcon className='h-6 w-6' />
            </div>
          </div>

        </div>

      </Link>
    </div>
  )
}

export default Post