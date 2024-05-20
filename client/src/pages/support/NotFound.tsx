/**
 * Not Found Page Component
 * 
 * This component renders the 404NotFound Page for users. Contains 
 * a list of possible actions to do if this page was reached. 
 * Used as a catch-all in routing.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="flex flex-col h-screen justify-center items-center mt-32 mb-24 w-9/12 md:w-3/12">
      <a className="font-semibold text-5xl text-center mb-12">404 Not Found!</a>
      <p className="mb-6">
        Sorry, we couldn't find the page you were looking for. It might have been removed, had its name changed, or is temporarily unavailable. 
        But don"t worry, there are plenty more stories to explore!
      </p>
      <p className="font-bold mb-6 text-2xl text-center">
        Here's what you can do next:
      </p>
      <ul className="mb-44">
        <li><Link to="./" className="font-bold">Go to Home Page</Link>: Revisit our homepage and start your journey again.</li>
        <li><Link to="./explore" className="font-bold">Explore Stories</Link>: Dive into a sea of unique life stories.</li>
        <li><Link to="./help" className="font-bold">Need Help?</Link> If you’re stuck or need assistance, our help page is here for you.</li>
        <li><Link to="./legal" className="font-bold">Report a Problem</Link>: If you believe this is an error, let us know here.</li>
        </ul>
    </div>
  )
}

export default NotFound
