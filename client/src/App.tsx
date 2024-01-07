/**
 * App Component
 * 
 * This is the root component of the MiHistoria application. It sets up the routing 
 * for the entire application using React Router and defines the main layout structure.
 * 
 * Key Features:
 * 1. Routing: Utilizes React Router to manage navigation between different pages in the application.
 * 2. Layout: Defines the main layout that includes the Navbar and Footer components, 
 *    which are consistent across different pages.
 * 3. Page Components: Renders different page components based on the URL path. 
 *    Each path is associated with a specific component.
 * 4. Authentication: Implements routes that require authentication using the 'RequireAuth' component.
 *    This restricts access to certain pages based on the user's authentication status.
 * 5. Error Handling: Includes a catch-all route for unmatched URLs that directs users to a 'NotFound' page.
 *
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

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
import Explore from "./pages/search/Explore"
import StoryPage from "./pages/story/StoryPage"
import RequireAuth from "./pages/support/RequireAuth"
import ChangePassword from "./pages/profile/ChangePassword"
import WriteStory from "./pages/story/WriteStory"
import ChangeBanner from "./pages/story/ChangeBanner"
import ChangePicture from "./pages/profile/ChangePicture"
import ExploreNew from "./pages/search/ExploreNew"
import ExploreAllTimeTop from "./pages/search/ExploreTop"
import Saved from "./pages/search/Saved"

// Layout Component
const Layout = () => {
  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}

// Router Configuration
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
        path: "/profile/edit/picture",
        element: <RequireAuth><ChangePicture/></RequireAuth>,
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
        path: "/saved",
        element: <RequireAuth><Saved/></RequireAuth>,
      },
      {
        path: "/explore",
        element: <Explore/>,
      },
      {
        path: "/explore/top",
        element: <ExploreAllTimeTop/>,
      },
      {
        path: "/explore/new",
        element: <ExploreNew/>,
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

/**
 * App Component
 * 
 * This is the root component of the application. It sets up the main layout and routing structure using React Router.
 * The 'App' component is responsible for rendering the 'RouterProvider' with the application's routing configuration.
 */
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
