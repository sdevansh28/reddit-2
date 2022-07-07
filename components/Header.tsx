import Image from 'next/image'
import React from 'react'
import {
  BellIcon,
  ChatIcon,
  GlobeIcon,
  PlusIcon,
  SparklesIcon,
  SpeakerphoneIcon,
  VideoCameraIcon,
} from '@heroicons/react/outline'

import {
  ChevronDownIcon, 
  HomeIcon, 
  MenuIcon,
  SearchIcon,
} from '@heroicons/react/solid' 
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/Link'

function Header() {

  const {data: session} = useSession();

  return (
    <div className='flex h-12 px-4 py-1 sticky top-0 z-50 bg-white shadow-sm'>
      <div className="relative h-10 w-20 cursor-pointer" >
        <Link href='/'>
          <Image src="https://i.imgur.com/xG0SDG9.png" objectFit='contain' layout='fill' />
        </Link>
      </div>
      <div className="flex items-center mx-7 space-x-2 xl:min-w-[300px]">
        <HomeIcon className='h-5 w-5' />
        <p className='flex-1 hidden lg:inline'>Home</p>
        <ChevronDownIcon className='h-5 w-5' />
      </div>

      {/* Search box */}
      <form className='flex flex-1 items-center space-x-2 
                                      border border-gray-200 bg-gray-100 px-2 py-1'>
        <SearchIcon className='h-6 w-6 text-gray-400'/>
        <input className='flex-1 bg-transparent outline-none' type="text" name="search" placeholder="Search Reddit" />
      </form>

      <div className='mx-5 items-center text-gray-500 hidden lg:inline-flex'>
      <BellIcon className='icon' />
      <ChatIcon className='icon' />
      <GlobeIcon className='icon' />
      <hr className='h-10 border-[0.5px] bg-gray-100' />
      <PlusIcon className='icon' />
      <SparklesIcon className='icon' />
      <SpeakerphoneIcon className='icon' />
      <VideoCameraIcon className='icon' />
      </div>

      <div className='ml-5 lg:hidden'>
        <MenuIcon className='icon'/>
      </div>

  {/* signin-singout button */
      session ? (
        
      <div  onClick={()=> signOut()}
        className='items-center cursor-pointer hidden 
                                                lg:flex space-x-2 border hover:bg-gray-100 p-2'>
        <div className='relative h-5 w-5'>
          <Image layout='fill' objectFit='contain' src="https://i.imgur.com/KQsTmDp.png" />
        </div>

        <div className='flex-1 text-xs'>
          <p className='truncate'>{session?.user?.name}</p>
          <p className='text-gray-400' >1 Karma</p>
        </div>

        <ChevronDownIcon className='h-5 w-5 flex-shrink-0 text-gray-400' />
        
      </div>

    ) : (

      <div  onClick={()=> signIn()}
        className='items-center cursor-pointer hidden 
                                                lg:flex space-x-2 border hover:bg-gray-100 p-2'>
        <div className='relative h-5 w-5'>
          <Image layout='fill' objectFit='contain' src="https://i.imgur.com/KQsTmDp.png" />
        </div>

        <p className='text-gray-400'>Sign In</p>
      </div>
    )
  }
  </div>
  )
}

export default Header