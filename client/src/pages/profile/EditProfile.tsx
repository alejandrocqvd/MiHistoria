import { useContext, useEffect, useState } from "react";
import storyBg from "../../assets/login-bg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

// Interface for holding and managing form data in the EditProfile component
interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  img: string;
  is_private: boolean;
}

/**
 * EditProfile component handles user profile editing/updating.
 * This component provides a form for users to enter their information.
 * @returns Edit profile page (/profile/edit)
 */
const EditProfile = () => {
  // State variables:
  // - error: Boolean indicating if there is an error during form submission.
  const [error, setError] = useState<boolean>(true);

  // - errorMessage: String containing the error message to display.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // - inputs: Object holding the form data for updating user profile information.
  const [inputs, setInputs] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    img: "",
    is_private: false
  });

  // - username: String holding the user's username
  const [username, setUsername] = useState<string>("");

  // useNavigate used to go back to user profile after updating their profile.
  const navigate = useNavigate();

  // Using authContext's logout function to log the user out after they delete their account.
  const { logout } = useContext(AuthContext)!;

  /**
   * Converts the received date of birth from API to proper format.
   * @param dob - User's date of birth as a string.
   * @returns the users's date of birth properly formatted as a YYYY-MM-DD.
   */
  const formatDOB = (dob: string): string => {
    // Parse the string to a Date object
    const date = new Date(dob);
    // Format to YYYY-MM-DD
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Handles input changes for edit profile form.
   * @param e - The React change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}));
    if (e.target.name === 'dob') {
      setInputs(prev => ({...prev, [e.target.name]: formatDOB(e.target.value)}));
    }
  }

  /**
   * Handles the submission of the edit profile form.
   * @param e - The React form event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error states.
    setError(false);
    setErrorMessage("");

    // Attempt form submission. Display error message if any.
    try {
      await axios.post("/api/users/edit", inputs);
      navigate("/profile");
    } catch (error) {
      setError(true);
      setErrorMessage("Email is already taken.");
      console.log(error);
    }
  }

  /**
   * Handles the deletion of a user's profile.
   */
  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete your account?");

    if (isConfirmed) {
      try {
        await axios.delete("/api/users/delete", {
          withCredentials: true
        });
        await logout();
        navigate("/");
      } catch (error) {
        setError(true);
        setErrorMessage("Failed to delete account.");
        console.log(error);
      }
    }
  }

  // useEffect fetches the user's existing profile data to populate the form inputs.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/users/profile", {
          withCredentials: true
        });
        const formattedData = {
          ...res.data.data,
          dob: formatDOB(res.data.data.dob)
        };
        setInputs(formattedData);

        const userRes = await axios.get("/api/users/username", {
          withCredentials: true
        });
        setUsername(userRes.data.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(true);
          setErrorMessage(error.response.data.error);
        } else {
          setError(true);
          setErrorMessage("An unexpected error occurred.");
        }
        console.log(error);
      }
    }
    fetchData();
  }, []);

  /**
   * Renders the edit profile form with all necessary fields, and a submit button. 
   * Displays an error message if profile updating fails.
   */
  return (
    <>
      <div className="flex flex-col justify-items-center mt-32 w-9/12">
        <p className="text-5xl font-bold text-center mb-12">Edit Profile</p>
        <div className="flex flex-col md:flex-row justify-center items-center mb-12">
          <img src={storyBg} className="h-28 w-auto rounded-xl" />
          <p className="text-4xl font-semibold m-8">{username}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-9/12 md:w-4/12">

        <div className="flex flex-row w-full pb-4">
          <div className="flex-col justify-start items-center w-full">
            <p className="mb-2 mx-2 font-semibold text-xl">First Name</p>
            <input 
              name="first_name"
              onChange={handleChange}
              className="w-full py-2 px-4 rounded-2xl mr-2 bg-secondary" 
              type="text" 
              value={inputs.first_name}
              placeholder="First Name">
            </input>
          </div>   
          <div className="flex flex-col justify-start items-start w-full">
            <p className="mb-2 mx-5 font-semibold text-xl">Last Name</p>
            <input 
              name="last_name"
              onChange={handleChange}
              className="w-full py-2 px-4 rounded-2xl ml-2 bg-secondary" 
              type="text" 
              value={inputs.last_name}
              placeholder="Last Name">
            </input>
          </div>       
        </div>

        <p className="mb-2 mx-2 font-semibold text-xl">Email</p>
        <div className="pb-4 relative">
            <input 
              name="email"
              onChange={handleChange}
              className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl bg-secondary" 
              type="email" 
              value={inputs.email}
              placeholder="Email" 
              required>
            </input>
            <FontAwesomeIcon className="absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm" icon={faEnvelope} />
        </div>

        <p className="mb-2 mx-2 font-semibold text-xl">Date of Birth</p>
        <div className="w-full pb-4">
          <input 
            name="dob"
            onChange={handleChange}
            className="w-full py-2 px-4 rounded-2xl bg-secondary" 
            type="date" 
            value={inputs.dob}
            placeholder="Date of Birth">
          </input>
        </div>

        <div className="flex flex-row justify-between items-center my-4">
          <p className="mb-2 mx-2 font-semibold text-xl">Private Account</p>
          <div className="switch-container">
            <label className="switch">
              <input 
                type="checkbox" 
                onChange={(e) => setInputs({ ...inputs, is_private: e.target.checked })}
                checked={inputs.is_private}>
              </input>
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <p className="text-center">A private account hides your first name, last name, and age, on your story page.</p>

        <div className="text-center">
            {error && <p className="text-error">{errorMessage}</p>}
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center pt-4 pb-4 mb-10">
          <Link 
            to={"./password"} 
            className="flex justify-center items-center h-10 w-40 bg-gradient rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105"
            >Change Password
          </Link>
          <button 
            type="submit"
            className="flex justify-center items-center h-10 w-40 m-4 bg-gradient rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105"
            >Save Profile
          </button>
          <button 
            onClick={handleDelete}
            className="w-40 shadow-md text-center rounded-xl bg-error font-bold px-4 py-2 hover:bg-[#9A0E2A]"
            >Delete Account
          </button>
        </div>

      </form>
    </>
  )
}

export default EditProfile
