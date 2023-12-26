import './App.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/login/Register'
import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import EditProfile from './pages/profile/EditProfile'
import Story from './pages/story/Story'
import NotFound from './pages/support/NotFound'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Help from './pages/support/Help'
import Legal from './pages/support/Legal'
import Explore from './pages/Explore'
import StoryPage from './pages/story/StoryPage'
import EditStoryPage from './pages/story/EditStoryPage'
import RequireAuth from './pages/support/RequireAuth'
import ChangePassword from './pages/profile/ChangePassword'

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
        element: <RequireAuth><Profile/></RequireAuth>,
      },
      {
        path: '/profile/edit',
        element: <RequireAuth><EditProfile/></RequireAuth>,
      },
      {
        path: '/profile/edit/password',
        element: <RequireAuth><ChangePassword/></RequireAuth>,
      },
      {
        path: '/story/:id',
        element: <Story/>,
        children: [
          {
            path: 'page/:page_number',
            element: <StoryPage/>,
          },
          {
            path: 'page/:page_number/edit',
            element: <RequireAuth><EditStoryPage/></RequireAuth>,
          },
        ]
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
