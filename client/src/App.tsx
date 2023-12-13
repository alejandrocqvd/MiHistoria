import './App.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/login/Register'
import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import EditProfile from './pages/profile/EditProfile'
import Story from './pages/story/Story'
import EditStory from './pages/story/EditStory'
import Search from './pages/Search'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { FAQ } from './pages/story/FAQ'

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
        path: '/search',
        element: <Search/>,
      },
      {
        path: '/faq',
        element: <FAQ/>,
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
