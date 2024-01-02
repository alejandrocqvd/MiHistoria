import homeBg from "../assets/home-bg.png";
import { Link } from "react-router-dom";
import globeIcon from "../assets/globe-icon.png";
import bookIcon from "../assets/book-icon.png";
import privacyIcon from "../assets/privacy-icon.png";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Home = () => {
  const { currentUser } = useContext(AuthContext)!;

  // Retrieve the user item from session storage and parse it if it's a valid JSON string.
  const storedUser = sessionStorage.getItem('user');
  const sessionUsername = storedUser && storedUser !== "null" ? JSON.parse(storedUser).user_info.username : null;

  return (
    <>
      <div className="flex justify-center md:justify-between items-center h-screen w-9/12 mb-24">
        <div className="text-6xl font-bold text-center md:text-left">
          <p className="my-10 py-5">Speak your mind.</p>
          <p className="my-10 py-5">Tell your truth.</p>
          <p className="my-10 py-5">Write your story, <span className="bg-clip-text text-transparent bg-gradient font-extrabold underline">here.</span></p>
          <div className="flex flex-row justify-start items-center">
            <button className="hidden md:flex justify-center items-center h-10 w-auto p-4 mr-8 bg-gradient text-sm rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105">
              <Link to={ currentUser ? `/story/${sessionUsername}/page/1` : "./register"}>Start your journey</Link>
            </button>
            <button className="hidden md:flex justify-center items-center h-10 w-auto p-4 text-sm border-2 rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105">
              <Link to={ currentUser ? `/story/${sessionUsername}/page/1` : "./login"}>Continue your story</Link>
            </button>
          </div>
        </div>
        <div className="h-9/12 my-auto justify-center items-center">
          <img src={homeBg} className="hidden md:flex h-full w-auto" />
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-9/12 py-16 md:px-48 px-8 bg-[#292929] shadow-xl rounded-xl">
        <p className="text-5xl font-bold mb-12 text-center pb-2 bg-clip-text text-transparent bg-gradient">What is MiHistoria?</p>
        <p className="text-xl flex-1 mr-6 text-center">
          In an digital world full of fleeting moments and endless posts, MiHistoria offers something different. 
          Here, each user gets one chance, <span className="font-bold">one post, to share their life story.</span> Our app is built on the belief that every person"s 
          journey is unique and deserves to be told in its entirety. We've created this space to allow users to look back, reflect, and write down their lives.
        </p>
      </div>
      <div className="flex flex-col justify-center items-center w-9/12 mt-10 mb-24 py-16 md:px-48 px-8 bg-[#292929] shadow-xl rounded-xl">
        <p className="text-xl mb-20 text-center">
          We invite you to join this community and share your story, your entire story, in one post. Or delve into the intricate and beautiful 
          lives of others, learning, emphasizing, and connecting in a way that transcends traditional social media boundaries.
        </p>
        <p className="text-3xl font-normal pb-2 text-center italic bg-clip-text text-transparent bg-gradient">"There is no greater agony than bearing the untold story inside you"</p>
        <p className="text-2xl font-semibold mt-6 text-center">- Maya Angelou</p>
      </div>

      <p className="text-5xl font-bold mb-12 mt-28 pb-2 bg-clip-text text-transparent bg-gradient">What To Do</p>
      <div className="flex flex-col lg:flex-row justify-stretch items-stretch w-9/12 mb-24">
        <a href={"./explore"} 
          className="flex-1 flex flex-col justify-between items-center w-full p-16 mb-8 text-center bg-[#292929] shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out">
            <p className="text-4xl font-bold mb-8 text-center">Read Human Experiences</p>
            <img src={globeIcon} className="h-24 w-auto mb-8" />
            <p className="font-semibold text-center">See the collection of personal narratives that take you though the intricate experiences of people from any corner of the world.</p>
        </a>
        <a href={ currentUser ? "./story/:id/page/1" : "./login"} className="flex-1 flex flex-col justify-between items-center w-full lg:mx-20 p-16 mb-8 text-center bg-[#292929] shadow-xl hover:shadow-2xl rounded-xl hover:scale-105 transition duration-300 ease-in-out">
            <p className="text-4xl font-bold mb-8 text-center">Write <span className="underline">Your</span> Story</p>
            <img src={bookIcon} className="h-24 w-auto mb-8" />
            <p className="font-semibold text-center">Let the world hear your story. Travel back in your time to recollect and write down your life.</p>
        </a>
        <a href={ currentUser ? "./profile/edit" : "./login"} className="flex-1 flex flex-col justify-between items-center w-full p-16 mb-8 text-center bg-[#292929] shadow-xl hover:shadow-2xl rounded-xl hover:scale-105 transition duration-300 ease-in-out">
            <p className="text-4xl font-bold mb-8 text-center">Be yourself or be anonymous</p>
            <img src={privacyIcon} className="h-24 w-auto mb-8" />
            <p className="font-semibold text-center">No need to expose your identity, feel free to write anonymously and tell your truth with no filter.</p>
        </a>
      </div>

      <p className="text-5xl font-bold mb-12 mt-28 pb-2 bg-clip-text text-transparent bg-gradient">Explore Top Stories</p>
      <div className="flex flex-col justify-center items-stretch h-auto w-9/12 mb-32">
        
        <a href="./story/:id" className="flex flex-row justify-center items-center mb-4 h-24 p-8 bg-[#292929] shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out">
          <div className="flex-1 flex flex-col justify-items-center h-full">
            <p className="text-3xl text-center font-bold">Title</p>
          </div>
          <div className="flex-1 flex flex-row justify-center items-center rounded-xl">
            <img src={homeBg} className="h-20" />
            <p className="text-xl ml-8 font-semibold">Author</p>
          </div>
        </a>

        <a href="./story/:id" className="flex flex-row justify-center items-center mb-4 h-24 p-8 bg-[#292929] shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out">
          <div className="flex-1 flex flex-col justify-items-center h-full">
            <p className="text-3xl text-center font-bold">Title</p>
          </div>
          <div className="flex-1 flex flex-row justify-center items-center rounded-xl">
            <img src={homeBg} className="h-20" />
            <p className="text-xl ml-8 font-semibold">Author</p>
          </div>
        </a>

        <a href="./story/:id" className="flex flex-row justify-center items-center mb-4 h-24 p-8 bg-[#292929] shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out">
          <div className="flex-1 flex flex-col justify-items-center h-full">
            <p className="text-3xl text-center font-bold">Title</p>
          </div>
          <div className="flex-1 flex flex-row justify-center items-center rounded-xl">
            <img src={homeBg} className="h-20" />
            <p className="text-xl ml-8 font-semibold">Author</p>
          </div>
        </a>

        <a href="./story/:id" className="flex flex-row justify-center items-center mb-4 h-24 p-8 bg-[#292929] shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out">
          <div className="flex-1 flex flex-col justify-items-center h-full">
            <p className="text-3xl text-center font-bold">Title</p>
          </div>
          <div className="flex-1 flex flex-row justify-center items-center rounded-xl">
            <img src={homeBg} className="h-20" />
            <p className="text-xl ml-8 font-semibold">Author</p>
          </div>
        </a>

        <a href="./story/:id" className="flex flex-row justify-center items-center mb-4 h-24 p-8 bg-[#292929] shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out">
          <div className="flex-1 flex flex-col justify-items-center h-full">
            <p className="text-3xl text-center font-bold">Title</p>
          </div>
          <div className="flex-1 flex flex-row justify-center items-center rounded-xl">
            <img src={homeBg} className="h-20" />
            <p className="text-xl ml-8 font-semibold">Author</p>
          </div>
        </a>

      </div>
    </>
  )
}

export default Home
