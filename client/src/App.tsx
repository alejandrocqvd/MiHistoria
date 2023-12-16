import './App.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/login/Register'
import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import EditProfile from './pages/profile/EditProfile'
import Story from './pages/story/Story'
import EditStory from './pages/story/EditStory'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Help from './pages/Help'
import Legal from './pages/Legal'
import Explore from './pages/Explore'

const Layout = () => {
  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        path: '/',
        element: <Home/>,
      },
      {
        path: '/profile',
        element: <Profile/>,
      },
      {
        path: '/profile/edit',
        element: <EditProfile/>,
      },
      {
        path: '/story/:id',
        element: <Story/>,
      },
      {
        path: '/story/:id/edit',
        element: <EditStory/>,
      },
      {
        path: '/explore',
        element: <Explore/>,
      },
      {
        path: '/help',
        element: <Help/>,
      },
      {
        path: '/legal',
        element: <Legal/>,
      },
      {
        path: '*',
        element: <NotFound/>,
      },
    ]
  },
  {
    path: '/register',
    element: <Register/>,
  },
  {
    path: '/login',
    element: <Login/>,
  },
])

function App() {

  return (
    <>
      <div className='flex flex-col w-full justify-center items-center overflow-hidden text-text'>
        <RouterProvider router={ router } />
      </div>
    </>
  )
}

export default App
