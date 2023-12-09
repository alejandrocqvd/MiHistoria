import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/Home'
import Register from './pages/login/Register'
import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import EditProfile from './pages/profile/EditProfile'
import Story from './pages/story/Story'
import EditStory from './pages/story/EditStory'
import Search from './pages/Search'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/profile",
    element: <Profile/>,
  },
  {
    path: "/profile/edit",
    element: <EditProfile/>,
  },
  {
    path: "/story/:id",
    element: <Story/>,
  },
  {
    path: "/story/:id/edit",
    element: <EditStory/>,
  },
  {
    path: "/search",
    element: <Search/>,
  },
])

function App() {

  return (
    <>
      <RouterProvider router={ router } />
    </>
  )
}

export default App
