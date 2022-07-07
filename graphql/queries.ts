import { gql} from '@apollo/client';

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic: String!)   {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;

export const GET_ALL_POSTS= gql`
  query MyQuery{
    getPostList {
      body
      commentList {
        text
        username
        created_at
        id
        votes
        post_id
      }
      id
      image
      subreddit_id
      title
      username
      created_at
      subreddit {
        created_at
        id
        members
        topic
      }
      voteList {
        username
        upvote
        post_id
        id
        downvote
        created_at
      }
    }
  }
`;

export const GET_ALL_POSTS_BY_TOPIC= gql`
  query MyQuery($topic: String!){
    getPostListByTopic(topic: $topic) {
      body
      commentList {
        text
        username
        created_at
        id
        votes
        post_id
      }
      id
      image
      subreddit_id
      title
      username
      created_at
      subreddit {
        created_at
        id
        members
        topic
      }
      voteList {
        username
        upvote
        post_id
        id
        downvote
        created_at
      }
    }
  }
`;

export const GET_POST_BY_POST_ID= gql`
  query MyQuery($id: ID!){
    getPost(id: $id) {
      body
      commentList {
        text
        username
        created_at
        id
        votes
        post_id
      }
      id
      image
      subreddit_id
      title
      username
      created_at
      subreddit {
        created_at
        id
        members
        topic
      }
      voteList {
        username
        upvote
        post_id
        id
        downvote
        created_at
      }
    }
  }
`;

export const GET_ALL_VOTES_BY_POST_ID= gql`
  query MyQuery($id: ID!){
    getVotesUsingPost_id(id: $id) {
    id
    created_at
    downvote
    post_id
    upvote
    username
  }
  }
`;