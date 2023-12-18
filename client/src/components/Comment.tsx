import { useState } from "react"
import storyBg from '../assets/login-bg.png'

interface commentData {
    comment_id: string;
    text: string;
    timestamp: string;
    author: {
        username: string;
        first_name: string;
        last_name: string;
    }
}

interface CommentProps {
    commentData: commentData;
}

const Comment: React.FC<CommentProps> = ({ commentData }) => {
  const [liked, setLiked] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState<number>(0)
  const [userLiked, setUserLiked] = useState<boolean>(false)

  const handleLike = () => {
    setLiked(!liked)
  }

  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  const formattedDate = formatTimestamp(commentData.timestamp)

  return (
    <div className='flex flex-col justify-items-center bg-secondary rounded-xl p-4 mb-2'>
        <div className='flex flex-row justify-between items-center'>
        <div className='flex flex-row justify-start items-center mb-2'>
            <img src={storyBg} className='h-8 rounded-xl w-8' />
            <a href={'./story/:id'} className='text-lg ml-4 font-semibold'>{commentData.author.first_name + ' ' + commentData.author.last_name}</a>
        </div>
        <div className='flex flex-row justify-end items-center'>
            <button className='hover-underline-animation mr-4 font-semibold'>Edit</button>
            <button className='hover-underline-animation font mr-4 font-semibold'>Delete</button>
            <p>{formattedDate}</p>
        </div>
        </div>
        <p className='px-2'>{commentData.text}</p>
    </div>
  )
}

export default Comment
