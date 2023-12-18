import { useState } from 'react'
import storyBg from '../../assets/login-bg.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons'

const EditProfile = () => {
  const [passwordHidden1, setPasswordHidden1] = useState<boolean>(true)
  const [passwordHidden2, setPasswordHidden2] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(true)

  return (
    <>
      <div className='flex flex-col justify-items-center mt-32 w-9/12'>
        <h1 className='text-5xl font-bold text-center mb-12'>Edit Profile</h1>
        <div className='flex flex-col md:flex-row justify-center items-center mb-12'>
          <img src={storyBg} className='h-28 w-auto rounded-xl' />
          <h1 className='text-4xl font-semibold m-8'>Username</h1>
        </div>
      </div>

      <form className='w-9/12 md:w-4/12'>

        <div className='flex flex-row w-full pb-4'>
          <div className='flex-col justify-start items-center w-full'>
            <h1 className='mb-2 mx-2 font-semibold text-xl'>First Name</h1>
            <input className='w-full py-2 px-4 rounded-2xl mr-2 bg-secondary' type='text' placeholder='First Name'></input>
          </div>   
          <div className='flex flex-col justify-start items-start w-full'>
            <h1 className='mb-2 mx-5 font-semibold text-xl'>Last Name</h1>
            <input className='w-full py-2 px-4 rounded-2xl ml-2 bg-secondary' type='text' placeholder='Last Name'></input>
          </div>       
        </div>

        <h1 className='mb-2 mx-2 font-semibold text-xl'>Email</h1>
        <div className='pb-4 relative'>
            <input className='w-full py-2 px-4 pl-3 pr-10 rounded-2xl bg-secondary' type='email' placeholder='Email' required></input>
            <FontAwesomeIcon className='absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm' icon={faEnvelope} />
        </div>

        <h1 className='mb-2 mx-2 font-semibold text-xl'>Date of Birth</h1>
        <div className='w-full pb-4'>
          <input className='w-full py-2 px-4 rounded-2xl bg-secondary' type='date' placeholder='Date of Birth'></input>
        </div>

        <h1 className='mb-2 mx-2 font-semibold text-xl'>Password</h1>
        <div className='pb-4 relative'>
          <input className='w-full py-2 px-4 pl-3 pr-10 rounded-2xl bg-secondary' type={passwordHidden1 ? 'password' : 'text'} placeholder='Password' required></input>
          <button className='absolute inset-y-0 right-0 px-5 pb-4 flex items-center text-sm' type='button' onClick={() => setPasswordHidden1(passwordHidden1 => !passwordHidden1)}>
            {passwordHidden1 ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
          </button>           
        </div>

        <h1 className='mb-2 mx-2 font-semibold text-xl'>Confirm Password</h1>
        <div className='pb-4 relative'>
          <input className='w-full py-2 px-4 pl-3 pr-10 rounded-2xl bg-secondary' type={passwordHidden2 ? 'password' : 'text'} placeholder='Confirm Password' required></input>
          <button className='absolute inset-y-0 right-0 px-5 pb-4 flex items-center text-sm' type='button' onClick={() => setPasswordHidden2(passwordHidden2 => !passwordHidden2)}>
            {passwordHidden2 ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
          </button>            
        </div>

        <div className='flex flex-row justify-between items-center my-4'>
          <h1 className='mb-2 mx-2 font-semibold text-xl'>Private Account</h1>
          <div className="switch-container">
            <label className="switch">
              <input type="checkbox"></input>
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className='text-center pb-4'>
            {error && <p className='text-error'>Username is already taken.</p>}
        </div>

        <div className='flex justify-center items-center pt-4 pb-4 mb-10'>
          <button className='flex justify-center items-center h-10 w-40 bg-gradient rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105'>Save Profile</button>
          <button className='w-40 shadow-md ml-4 text-center rounded-xl bg-error font-bold px-4 py-2 hover:bg-[#9A0E2A]'>Delete Account</button>
        </div>

      </form>
    </>
  )
}

export default EditProfile
