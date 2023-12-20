import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";


/**
 * Interface for holding and managing form data in the Login component.
 * All properties match the input fields.
 */
interface FormData {
  email: string;
  password: string;
}


/**
 * Login component for handling user authentication.
 * This component provides a form for users to input their email and password, and handles
 * the authentication process by communicating with the backend API.
 * @returns Login page (/login)
 */
const Login = () => {
  // State variables:
  // - passwordHidden: Boolean indicating if the password input is hidden or visible.
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true);

    // - error: Boolean indicating if there is an error during form submission.
  const [error, setError] = useState<boolean>(false);

    // - errorMessage: String containing the error message to display.
  const [errorMessage, setErrorMessage] = useState<string>("");

    // - inputs: Object holding the form data for email and password.
  const [inputs, setInputs] = useState<FormData>({
    email: "",
    password: "",
  })

  // useNavigate used to go to homepage after authentication.
  const navigate = useNavigate();

  /**
   * Handles input changes for login form.
   * @param e - The React change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}));
  }

  /**
   * Handles the submission of the login form.
   * @param e - The React form event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error states.
    setError(false);
    setErrorMessage("");

    // Attempt form submission. Display error message if any.
    try {
      const res = await axios.post("/api/auth/login", inputs);
      console.log(res);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(true);
        setErrorMessage(error.response.data.error);
      } else {
        setError(true);
        setErrorMessage("An unexpected error occurred.")
      }
      console.log(error);
    }
  }

  /**
   * Renders the login form with email and password fields, and a submit button.
   * Displays an error message if login fails. Provides a link to the registration page.
   */
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-img-login">

      <div className="flex flex-col justify-center item-center px-24 py-16 bg-black bg-opacity-25 backdrop-blur-lg rounded-2xl">

        <h1 className="text-4xl text-center font-bold mb-12">Login</h1>

        <form onSubmit={handleSubmit} className="w-80">

            <div className="pb-4 relative">
              <input 
                name="email"
                onChange={handleChange}
                className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl" 
                type="email" 
                placeholder="Email" 
                required>
              </input>
              <FontAwesomeIcon className="absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm" icon={faEnvelope} />
            </div>

            <div className="pb-4 relative">
              <input 
                name="password"
                onChange={handleChange}
                className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl" 
                type={passwordHidden ? "password" : "text"} 
                placeholder="Password" 
                required>
              </input>
              <button 
                className="absolute inset-y-0 right-0 px-5 pb-4 flex items-center text-sm" 
                type="button" 
                onClick={() => setPasswordHidden(passwordHidden => !passwordHidden)}
                >{passwordHidden ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
              </button>
            </div>

            <div className="flex justify-center items-center pt-4 pb-4">
              <button 
                type="submit" 
                className="flex justify-center items-center h-10 w-24 bg-gradient rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105"
                >Login
              </button>
            </div>

            <div className="text-center pb-4">
              {error && <p className="text-error">{errorMessage}</p>}
            </div>

            <div className="text-center">
              <p>Don't have an account? <a href="./register" className="hover-underline-animation font-bold">Register</a></p>
            </div>

        </form>

      </div>

    </div>
  )
}

export default Login
