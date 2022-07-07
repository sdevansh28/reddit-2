import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Feed from '../components/Feed'
import Header from '../components/Header'
import PostBox from '../components/Postbox'


const Home: NextPage = () => {
  return (
    <div className='my-7 max-w-5xl mx-auto'>
      <Head>
        <title>Reddit 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PostBox />

      <div className='flex'>
        <Feed />
      </div>

    </div>
  )
}

export default Home
