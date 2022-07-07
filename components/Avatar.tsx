import { useSession } from 'next-auth/react'
import Image from 'next/image';
import React from 'react'

type Props = {
  seed?: string;
  large?: boolean;
}

function Avatar({seed, large}: Props) {

  const {data: session} = useSession();

  return (
    <div className={`relative overflow-hidden h-10 w-10 rounded-full bg-gray-200 border-gray-100 p-1
        ${large && 'h-20 w-20'}
    `}>
      <Image
        layout='fill'
        objectFit='contain'
        src={`https://avatars.dicebear.com/api/open-peeps/${seed || session?.user?.name || 'placeholder'}.svg`}
      />
    </div>
  )
}

export default Avatar