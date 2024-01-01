import "./App.css"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Register from "./pages/login/Register"
import Login from "./pages/login/Login"
import Profile from "./pages/profile/Profile"
import EditProfile from "./pages/profile/EditProfile"
import Story from "./pages/story/Story"
import NotFound from "./pages/support/NotFound"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Help from "./pages/support/Help"
import Legal from "./pages/support/Legal"
import Explore from "./pages/Explore"
import StoryPage from "./pages/story/StoryPage"
import RequireAuth from "./pages/support/RequireAuth"
import ChangePassword from "./pages/profile/ChangePassword"
import WriteStory from "./pages/story/WriteStory"
import ChangeBanner from "./pages/story/ChangeBanner"

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
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/profile",
        element: <RequireAuth><Profile/></RequireAuth>,
      },
      {
        path: "/profile/edit",
        element: <RequireAuth><EditProfile/></RequireAuth>,
      },
      {
        path: "/profile/edit/password",
        element: <RequireAuth><ChangePassword/></RequireAuth>,
      },
      {
        path: "/story/:id",
        element: <Story/>,
        children: [
          {
            path: "page/:page_number",
            element: <StoryPage/>,
          },
        ]
      },
      {
        path: "/story/write",
        element: <RequireAuth><WriteStory/></RequireAuth>,
      },
      {
        path: "/story/banner",
        element: <RequireAuth><ChangeBanner/></RequireAuth>
      },
      {
        path: "/explore",
        element: <Explore/>,
      },
      {
        path: "/help",
        element: <Help/>,
      },
      {
        path: "/legal",
        element: <Legal/>,
      },
      {
        path: "*",
        element: <NotFound/>,
      },
    ]
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
])

function App() {

  return (
    <>
      <div className="flex flex-col w-full justify-center items-center overflow-hidden text-text">
        <RouterProvider router={ router } />
      </div>
    </>
  )
}

export default App
