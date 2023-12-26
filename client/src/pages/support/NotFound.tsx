const NotFound = () => {
  return (
    <div className="flex flex-col h-96 justify-items-center mt-32 mb-24 w-9/12 md:w-3/12">
      <a className="font-semibold text-5xl text-center mb-12">404 Not Found!</a>
      <p className="mb-6">
        Sorry, we couldn"t find the page you were looking for. It might have been removed, had its name changed, or is temporarily unavailable. 
        But don"t worry, there are plenty more stories to explore!
      </p>
      <p className="font-bold mb-6 text-2xl text-center">
        Here"s what you can do next:
      </p>
      <ul className="mb-12">
        <li><a href="./" className="font-bold">Go to Home Page</a>: Revisit our homepage and start your journey again.</li>
        <li><a href="./explore" className="font-bold">Explore Stories</a>: Dive into a sea of unique life stories.</li>
        <li><a href="./help" className="font-bold">Need Help?</a> If you’re stuck or need assistance, our help page is here for you.</li>
        <li><a href="./legal" className="font-bold">Report a Problem</a>: If you believe this is an error, let us know here.</li>
        </ul>
    </div>
  )
}

export default NotFound
