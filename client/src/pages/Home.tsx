/**
 * Home/Landing Page Component
 * 
 * This component renders the home/landing page for users. It provides a 
 * description for the application and its uses, and fetches 5 top stories of 
 * all time to display.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import homeBg from "../assets/home-bg.png";
import { Link } from "react-router-dom";
import globeIcon from "../assets/globe-icon.png";
import bookIcon from "../assets/book-icon.png";
import privacyIcon from "../assets/privacy-icon.png";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import SearchResult from "../components/SearchResult";
import ErrorDisplay from "../components/ErrorDisplay";

/**
 * Interface for story results
 * 
 * @property {string} title - The title of the story.
 * @property {string} image - The file name for the story's banner image.
 * @property {string} username - The story author's username.
 */
interface SearchData {
  title: string;
  image: string;
  username: string;
}

// Home/Landing Page Component
const Home: React.FC = () => {
  // Boolean indicating if there is an error
  const [error, setError] = useState<boolean>(false);

  // String containing the error message to display
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Array of objects containing information for top 5 stories of all time
  const [topData, setTopData] = useState<SearchData[]>([]);

  // Retrieve the current user using AuthContext
  const { currentUser } = useContext(AuthContext)!;

  // Retrieve the user item from session storage and parse it if it's a valid JSON string
  const storedUser = sessionStorage.getItem('user');
  const sessionUsername: string | null = storedUser && storedUser !== "null" ? JSON.parse(storedUser).user_info.username : null;

  // Fetch the top 5 stories of all time to display on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/searches/top/5");
        setTopData(res.data.data);
      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.message);
        else setErrorMessage("An unexpected error occurred.");
        console.log(error);
      }
    }
    fetchData();
  },[]);

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
          Here, each user gets one chance, <span className="font-bold">one post, to share their life story.</span> Our app is built on the belief that every person's 
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
        <a href={ currentUser ? `/story/${sessionUsername}/page/1` : "/login"} className="flex-1 flex flex-col justify-between items-center w-full lg:mx-20 p-16 mb-8 text-center bg-[#292929] shadow-xl hover:shadow-2xl rounded-xl hover:scale-105 transition duration-300 ease-in-out">
            <p className="text-4xl font-bold mb-8 text-center">Write <span className="underline">Your</span> Story</p>
            <img src={bookIcon} className="h-24 w-auto mb-8" />
            <p className="font-semibold text-center">Let the world hear your story. Travel back in your time to recollect and write down your life.</p>
        </a>
        <a href={ currentUser ? "./profile/edit" : "./login"} className="flex-1 flex flex-col justify-between items-center w-full p-16 mb-8 text-center bg-[#292929] shadow-xl hover:shadow-2xl rounded-xl hover:scale-105 transition duration-300 ease-in-out">
            <p className="text-4xl font-bold mb-8 text-center">Be Yourself or Be Anonymous</p>
            <img src={privacyIcon} className="h-24 w-auto mb-8" />
            <p className="font-semibold text-center">No need to expose your identity, feel free to write anonymously and tell your truth with no filter.</p>
        </a>
      </div>

      <p className="text-5xl font-bold mb-12 mt-28 pb-2 bg-clip-text text-transparent bg-gradient">Explore Top Stories</p>

      {error && <ErrorDisplay errorMessage={errorMessage}></ErrorDisplay>}

      <div className="flex flex-col justify-center items-stretch h-auto w-9/12 md:w-1/2 mb-32">
        {topData.map(searchResult => (
          <SearchResult key={searchResult.username} data={searchResult} />
        ))}
      </div>
    </>
  )
}

export default Home
