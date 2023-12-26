import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const { currentUser, logout } = useContext(AuthContext)!;

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  return (
    <>
      <nav className='flex fixed justify-between items-center h-16 w-full top-0 px-12 py-10 bg-primary z-50'>
        <div>
          <Link to='./'><p className='text-3xl px-4 font-notable font-extrabold bg-clip-text text-transparent bg-gradient'>MiHistoria</p></Link>
        </div>
        <div className='hidden md:flex flex-grow justify-center items-center font-bold'>
          <Link className='hover-underline-animation m-14' to='./'>Home</Link>
          <Link className='hover-underline-animation m-14' to='./explore'>Explore</Link>
          <Link className='hover-underline-animation m-14' to={ currentUser ? './story/:id' : './register'}>Your Story</Link>
          { currentUser ? <Link className='hover-underline-animation m-14' to='./profile'>Profile</Link> : null}
        </div>
        <div className="hidden md:flex justify-center items-center h-10 w-24 ml-32 p-4 bg-gradient rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105">
          { currentUser ? <button onClick={handleLogout}>Logout</button> : <Link to='./login'>Login</Link>}
        </div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </nav>
      <div className={`fixed z-30 top-20 w-full bg-secondary md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <Link className='block p-4 hover:bg-tertiary hover:font-semibold' to='./'>Home</Link>
        <Link className='block p-4 hover:bg-tertiary hover:font-semibold' to='./explore'>Explore</Link>
        <Link className='block p-4 hover:bg-tertiary hover:font-semibold' to='./story/:id'>Your Story</Link>
        <Link className='block p-4 hover:bg-tertiary hover:font-semibold' to='./login'>Login</Link>
      </div>
    </>
  )
}

export default Navbar
