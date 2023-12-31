import storyBg from "../../assets/login-bg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

// Interface for holding and managing the user's profile data.
interface ProfileData {
  username: string;
  first_name: string;
  last_name: string;
  dob: string;
  email: string;
  image: string;
  is_private: boolean;
}

// Interface for holding and managing
interface StoryData {
  title: string;
  image: string;
}

/**
 * Profile component for user's to view their profile information.
 * This component displays the user's information, their story, and their saved stories.
 * @returns Profile page (/profile)
 */
const Profile = () => {
  // State variables:
  // - error: Boolean indicating if there is an error during form submission.
  const [error, setError] = useState<boolean>(false);

  // - errorMessage: String containing the error message to display.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // - profile: Object containing all the user's profile data.
  const [profile, setProfile] = useState<ProfileData | null>(null);

  // - story: Object containing the title and image for the user's story.
  const [story, setStory] = useState<StoryData | null>(null); 

  // AuthContext to get current user
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext!;

  // Fetching user's username from session storage.
  const storedData = sessionStorage.getItem('user');
  const username = storedData ? JSON.parse(storedData).user_info.username : null;

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
  
  // useEffect fetches the user's profile information through an API request to the backend.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/users/profile", {
          withCredentials: true
        });
        setProfile(res.data.data);

        const storyRes = await axios.post("/api/stories/story", { username });
        setStory(storyRes.data.data);
      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error);
        else setErrorMessage("An unexpected error occurred.");
        console.log(error);
      }
    }
    fetchData();
  }, []);

  /**
   * Renders the profile page with all relevant information.
   */
  return (
    <> 
      { error ? 
        <div className="w-screen justify-items-center text-center my-64">
          <p className="font-semibold text-4xl">{ errorMessage }</p>
        </div> :
        <>
          <div className="flex flex-col justify-items-center mt-32 w-9/12">
            <div className="flex flex-col md:flex-row justify-center items-center mb-12">
              <img src={storyBg} className="h-32 w-32 rounded-xl" />
              <p className="text-5xl font-bold m-8">{profile?.username}</p>
              { profile?.is_private ? <FontAwesomeIcon icon={faLock} className="h-8 mt-2" /> : null}
            </div>
          </div>

          <div className="flex flex-col justify-center items-center mb-12 w-9/12 md:w-4/12">

            <div className="flex flex-row justify-between items-center bg-secondary rounded-xl py-2 px-4 w-full mb-2">
              <p className="text-xl font-semibold">Name:</p>
              <p className="text-xl">{profile?.first_name + " " + profile?.last_name} </p>
            </div>
            <div className="flex flex-row justify-between items-center bg-secondary rounded-xl py-2 px-4 w-full mb-2">
              <p className="text-xl font-semibold">Age:</p>
              <p className="text-xl">{calculateAge(profile?.dob ?? "") + " Years Old"}</p>
            </div>
            <div className="flex flex-row justify-between items-center bg-secondary rounded-xl py-2 px-4 w-full mb-2">
              <p className="text-xl font-semibold">Email:</p>
              <p className="text-xl">{profile?.email}</p>
            </div>
            <div className="flex flex-row justify-between items-center bg-secondary rounded-xl py-2 px-4 w-full mb-6">
              <p className="text-xl font-semibold">Account Type:</p>
              <p className="text-xl">{profile?.is_private ? "Private" : "Public"}</p>
            </div>

            <div className="flex flex-row justify-center items-center w-full mb-10">
              <Link to={"./edit"} className="w-40 shadow-md text-center rounded-xl bg-gradient font-bold px-4 py-2 transition duration-200 ease-in-out hover:scale-105">Edit Account</Link>
            </div>

          </div>

          <div className="flex flex-col justify-items-center w-9/12 md:w-4/12 mb-24">
            <p className="text-4xl font-bold mb-8 text-center">Your Story</p>
            <a href={ currentUser ? "../story/" + username + "/page/1" : "/"} className="flex flex-row justify-center items-center w-full h-auto p-8 bg-secondary shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out">
              <div className="flex flex-row justify-between items-center overflow-hidden w-full">
                <img src={story?.image ?? storyBg} className="h-20 flex-shrink-0 rounded-xl" />
                <p className="text-3xl text-center font-bold overflow-hidden text-ellipsis line-clamp-1">{story?.title ?? "Start Writing"}</p>
              </div>
            </a>
          </div>
        </>
      }
    </>
  )
}

export default Profile
