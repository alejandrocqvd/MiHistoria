/**
 * Navbar Component
 * 
 * This component renders the application's navigation bar. Contains links to the explore, 
 * story, profile, and login/logout pages.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext';

// Navbar Component
export const Navbar = () => {
  // Boolean indicating if the mobile navbar is open or not
  const [isOpen, setIsOpen] = useState(false)

  // Import the current user and the logout function from AuthContext
  const { currentUser, logout } = useContext(AuthContext)!;

  // Retrieve the user item from session storage and parse it if it's a valid JSON string
  const storedUser = sessionStorage.getItem('user');
  const sessionUsername = storedUser && storedUser !== "null" ? JSON.parse(storedUser).user_info.username : null;

  // useNavigate will be used to navigate to homepage after logging out
  const navigate = useNavigate();

  // useLocation will be used to check if the user's current position is in the story page
  const location = useLocation();

  /**
   * Handles logout event
   * 
   * Is triggered when the user attempts to logout using the navbar button 'Logout'.
   * If successful, it closes the navbar (on mobile) and redirects the user to the homepage.
   */
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  }

  /**
   * Handles navbar link navigation and refresh (if necessary)
   * 
   * Is triggered when the user clicks any of the links in the navbar.
   * 
   * @param {string} path - Path in the application.
   */
  const navigateAndRefresh = (path: string) => {
    if (location.pathname.startsWith('/story')) {
      window.location.href = path;
    } else {
      navigate(path);
    }
  }

  return (
    <>
      <nav className='flex fixed justify-between items-center h-16 w-full top-0 px-12 py-10 bg-primary z-50'>
        <div>
          <Link to='./'><p className='text-3xl px-4 font-notable font-extrabold bg-clip-text text-transparent bg-gradient'>MiHistoria</p></Link>
        </div>
        <div className='hidden md:flex flex-grow justify-center items-center font-bold'>
          <Link className='hover-underline-animation m-14' to='/'>Home</Link>
          <Link className='hover-underline-animation m-14' to='/explore'>Explore</Link>
          <button className='hover-underline-animation m-14' 
                  onClick={() => navigateAndRefresh(currentUser ? `/story/${sessionUsername}/page/1` : "/login")}>
            Your Story
          </button>
          { currentUser ? <Link className='hover-underline-animation m-14' to='/profile'>Profile</Link> : null}
        </div>
        <div className="hidden md:flex justify-center items-center h-10 w-24 ml-32 p-4 bg-gradient rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105">
          { currentUser ? <button onClick={handleLogout}>Logout</button> : <Link to='./login'>Login</Link>}
        </div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </nav>
      <div className={`fixed z-30 top-20 w-full bg-secondary md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <Link className='block p-4 hover:bg-tertiary hover:font-semibold' to='/'>Home</Link>
        <Link className='block p-4 hover:bg-tertiary hover:font-semibold' to='/explore'>Explore</Link>
        <button className='block p-4 hover:bg-tertiary hover:font-semibold' 
                onClick={() => navigateAndRefresh(currentUser ? `/story/${sessionUsername}/page/1` : "/login")}>
          Your Story
        </button>
        { currentUser ? <Link className='block p-4 hover:bg-tertiary hover:font-semibold' to='./profile'>Profile</Link> : null}
        { 
          currentUser ? <button onClick={handleLogout} className='block p-4 hover:bg-tertiary hover:font-semibold'>Logout</button> : 
          <Link to='./login' className='block p-4 hover:bg-tertiary hover:font-semibold'>Login</Link>
        }
      </div>
    </>
  )
}

export default Navbar
