import storyBg from "../../assets/login-bg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Outlet, useParams } from "react-router-dom";
import Comment from "../../components/Comment.tsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext.tsx";

// Interface for holding and managing the story's data.
interface StoryData {
  title: string;
  username: string;
  first_name: string;
  last_name: string;
  dob: string;
  user_image: string;
  story_image: string;
}

const Story = () => {
  // State variables:
  // - error: Boolean indicating if there is an error.
  const [error, setError] = useState<boolean>(false);

  // - errorMessage: String containing the error message to display.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // - profile: Object containing all the story's data.
  const [story, setStory] = useState<StoryData | null>(null);

  // Use the useParams hook to get URL parameters.
  const params = useParams() as {
    id: string;
    page_number: string;
  };

  // AuthContext to get current user
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext!;

  /**
   * Converts the user's date of birth string to a numerical age.
   * @param dobString - Date of birth as a string.
   * @returns the calculated age of the user.
   */
  const calculateAge = (dobString: string): number => {
    const dob = new Date(dobString);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - dob.getFullYear();
    const monthDifference = currentDate.getMonth() - dob.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < dob.getDate())) age--;

    return age;
  }

  // useEffect fetches the story page's text through an API request to the back end.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = params;

        if (!id) {
          setError(true);
          setErrorMessage("Invalid parameters.");
          return;
        }

        const data = {
          username: id,
        };

        const res = await axios.post("/api/stories/story", data);
        setStory(res.data.data);
      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error);
        else setErrorMessage("An unexpected error occurred.");
        console.log(error);
      }
    }
    fetchData();
  }, [params]);


  const dummyComments = [
    {
      comment_id: "1",
      text: "This is the first comment.",
      timestamp: "2021-12-17T12:00:00Z",
      author: {
        username: "user1",
        first_name: "John",
        last_name: "Doe"
      }
    },
    {
      comment_id: "2",
      text: "This is the second comment.",
      timestamp: "2021-12-18T13:00:00Z",
      author: {
        username: "user2",
        first_name: "Jane",
        last_name: "Doe"
      }
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center mt-20 w-9/12">

      <div className="flex flex-col h-auto w-full md:w-1/2">

        <p className="text-5xl text-center font-bold my-12">{story?.title}</p>
        <img src={storyBg} className="h-72 w-full rounded-xl mb-6" />

        <p className="text-3xl text-center font-bold mb-6">By {story?.username}</p>
        <div className="flex-1 flex flex-row justify-center items-center rounded-xl mb-8">
          <img src={storyBg} className="h-12 rounded-xl w-12" />
          <p className="text-xl ml-8 font-semibold">{story?.first_name + " " + story?.last_name}</p>
          <p className="text-xl ml-8 font-normal">{calculateAge(story?.dob ?? "")} Years Old</p>
        </div>
        
      </div>

      <div className="justify-items-center h-auto w-full md:w-1/2 rounded-xl">
        <Outlet />
      </div>

      <div className="flex flex-col justify-center items center w-full md:w-1/2 mb-6">
        <p className="text-2xl font-semibold mb-6">Comments</p>
        <div className="pb-4 relative mb-4">
          <input className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl bg-tertiary" type="textarea" placeholder={currentUser ? "Comment..." : "Must be signed in to comment"} required={!!currentUser} disabled={!currentUser}></input>
          <button className="absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm">
            <FontAwesomeIcon className="absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm" icon={faPaperPlane} />
          </button>
        </div>

        {dummyComments.map(comment => (
          <Comment key={comment.comment_id} commentData={comment} />
        ))}

      </div>

    </div>
  )
}

export default Story
