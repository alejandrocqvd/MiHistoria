import storyBg from '../../assets/login-bg.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'

const Profile = () => {
  return (
    <>
      <div className='flex flex-col justify-items-center mt-32 w-9/12'>
        <div className='flex flex-col md:flex-row justify-center items-center mb-12'>
          <img src={storyBg} className='h-28 w-auto rounded-xl' />
          <h1 className='text-5xl font-bold m-8'>Username</h1>
          <FontAwesomeIcon icon={faLock} className='h-8 mt-2' />
        </div>
      </div>

      <div className='flex flex-col justify-center items-center mb-12 w-9/12 md:w-4/12'>

        <div className='flex flex-row justify-between items-center bg-secondary rounded-xl py-2 px-4 w-full mb-2'>
          <h1 className='text-2xl font-semibold'>Name:</h1>
          <h1 className='text-2xl'>First Name Last Name</h1>
        </div>
        <div className='flex flex-row justify-between items-center bg-secondary rounded-xl py-2 px-4 w-full mb-2'>
          <h1 className='text-2xl font-semibold'>Age:</h1>
          <h1 className='text-2xl'>Age Years Old</h1>
        </div>
        <div className='flex flex-row justify-between items-center bg-secondary rounded-xl py-2 px-4 w-full mb-2'>
          <h1 className='text-2xl font-semibold'>Email:</h1>
          <h1 className='text-2xl'>email@example.com</h1>
        </div>
        <div className='flex flex-row justify-between items-center bg-secondary rounded-xl py-2 px-4 w-full mb-6'>
          <h1 className='text-2xl font-semibold'>Account Type:</h1>
          <h1 className='text-2xl'>Private</h1>
        </div>

        <div className='flex flex-row justify-center items-center w-full'>
          <button className='w-40 shadow-md text-center rounded-xl bg-gradient font-bold px-4 py-2'>Edit Account</button>
        </div>

      </div>

      <div className='flex flex-col justify-items-center w-9/12 md:w-4/12 mb-12'>
        <h1 className='text-5xl font-bold mb-8 text-center'>Your Story</h1>
        <a href='./story/:id/page/1' className='flex flex-row justify-center items-center w-full h-24 p-8 bg-secondary shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out'>
          <div className='flex flex-row justify-between items-center overflow-hidden w-full'>
            <img src={storyBg} className='h-20 flex-shrink-0 rounded-xl' />
            <h1 className='text-3xl text-center font-bold overflow-hidden text-ellipsis line-clamp-1'>Title</h1>
          </div>
        </a>
      </div>
    </>
  )
}

export default Profile
