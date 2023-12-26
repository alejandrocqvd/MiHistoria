import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart, faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart, faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import { useParams } from 'react-router-dom';

const StoryPage = () => {
  // State variables:
  // - error: Boolean indicating if there is an error.
  const [error, setError] = useState<boolean>(false);

  // - errorMessage: String containing the error message to display.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // - text: String containing HTML for page text.
  const [text, setText] = useState<string>("");

  // States and functions for liking and saving the story
  const [liked, setLiked] = useState<Boolean>(false);
  const [saved, setSaved] = useState<Boolean>(false);

  // Use the useParams hook to get URL parameters.
  const params = useParams() as {
    id: string;
    page_number: string;
  };

  const handleLike = () => {
    setLiked(!liked);
  }
  const handleSave = () => {
    setSaved(!saved);
  }

  // useEffect fetches the story page's text through an API request to the back end.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id, page_number } = params;

        if (!id || !page_number) {
          setError(true);
          setErrorMessage("Invalid parameters.");
          return;
        }

        const data = {
          username: id,
          page_number: page_number
        };

        const res = await axios.post("/api/stories/page", data);
        setText(res.data.data);
      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error);
        else setErrorMessage("An unexpected error occurred.");
        console.log(error);
      }
    }
    fetchData();
  }, [params]);

  return (
    <div className="flex flex-col justify-start items-center">
  
      <div className="flex flex-row justify-center items-center mb-12">
        <button onClick={handleLike} className={`w-28 shadow-md text-center rounded-xl bg-secondary px-4 py-2 ${liked ? "text-red-600" : null}`}>
          <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} className="mr-1" /> 24k
        </button>
        <button onClick={handleSave} className={`w-28 shadow-md ml-4 text-center rounded-xl bg-secondary px-4 py-2 ${saved ? "text-amber-500" : null}`}>
          <FontAwesomeIcon icon={saved ? solidBookmark : regularBookmark} className="mr-1" /> 6k
        </button>
        <button className="w-28 shadow-md ml-4 text-center rounded-xl bg-gradient font-bold px-4 py-2">Edit</button>
        <button className="w-32 shadow-md ml-4 text-center rounded-xl bg-error font-bold px-4 py-2 hover:bg-[#9A0E2A]">Delete Story</button>
      </div>
  
      <div className="flex flex-row justify-between items-start w-full mb-6">
        <div className="flex flex-row justify-between items-start">
          <button className="bg-secondary p-2 rounded-xl shadow-md mr-2 w-32">Previous Page</button>
          <button className="bg-secondary p-2 rounded-xl shadow-md mr-2 w-32">Next Page</button>
        </div>
        <div className="flex flex-row justify-between items-center bg-secondary p-2 rounded-xl shadow-md mr-2 w-32 px-4">
          <p>Page:</p>
          <select className="bg-secondary">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
  
      <div dangerouslySetInnerHTML={{ __html: text }} />
  
      <div className="flex flex-row justify-between items-start w-full mt-6 mb-12">
        <div className="flex flex-row justify-between items-start">
          <button className="bg-secondary p-2 rounded-xl shadow-md mr-2 w-32">Previous Page</button>
          <button className="bg-secondary p-2 rounded-xl shadow-md mr-2 w-32">Next Page</button>
        </div>
        <div className="flex flex-row justify-between items-center bg-secondary p-2 rounded-xl shadow-md mr-2 w-32 px-4">
          <p>Page:</p>
          <select className="bg-secondary">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
  
      <div className="flex flex-row justify-center items-center mb-10">
        <button onClick={handleLike} className={`w-28 shadow-md text-center rounded-xl bg-secondary px-4 py-2 ${liked ? "text-red-600" : null}`}>
          <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} className="mr-1" /> 24k
        </button>
        <button onClick={handleSave} className={`w-28 shadow-md ml-4 text-center rounded-xl bg-secondary px-4 py-2 ${saved ? "text-amber-500" : null}`}>
          <FontAwesomeIcon icon={saved ? solidBookmark : regularBookmark} className="mr-1" /> 6k
        </button>
        <button className="w-28 shadow-md ml-4 text-center rounded-xl bg-gradient font-bold px-4 py-2">Edit</button>
      </div>
  
    </div>
  )
  
}

export default StoryPage
