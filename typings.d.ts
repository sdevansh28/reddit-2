type Comment = {
  created_at: string
  id: number
  post_id: number
  text: string
  username: string
  votes: number
}

type Subreddit = {
  created_at: string
  id: number
  topic: string
  members: number
}

type Post = {
  body: string
  commentList: [Comment]
  created_at: string
  id: number
  image: string
  subreddit: [Subreddit]
  subreddit_id: number
  title: string
  username: string
  voteList: [Vote]
}

type Vote = {
  created_at: string
  id: number
  upvote: boolean
  downvote: boolean
  post_id: number
  username: string
}