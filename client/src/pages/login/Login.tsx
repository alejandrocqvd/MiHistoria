/**
 * Login Page Component
 * 
 * This component renders a page where the user can login. If they have no account, 
 * they are presented with a link to the register page.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import ErrorDisplay from "../../components/ErrorDisplay";

/**
 * Interface for holding the inputted login information
 * 
 * @property {string} email - Inputted email address.
 * @property {string} password - Inputted password.
 */
interface FormData {
  email: string;
  password: string;
}

// Login Page Component
const Login: React.FC = () => {
  // Boolean indicating if the password input is hidden or visible
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true);

    // Boolean indicating if there is an error during form submission
  const [error, setError] = useState<boolean>(false);

    // String containing the error message to display
  const [errorMessage, setErrorMessage] = useState<string>("");

    // Object holding the form data for email and password
  const [inputs, setInputs] = useState<FormData>({
    email: "",
    password: "",
  });

  // useNavigate used to go to homepage after authentication
  const navigate = useNavigate();

  // Authorization context and saving the login function
  const authContext = useContext(AuthContext);
  if (!authContext) {
    setError(true);
    setErrorMessage("Internal Error: AuthContext is undefined.");
  }
  const { login } = authContext!;

  /**
   * Handles input changes for login form.
   * 
   * Triggered when the user changes any of the input fields.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  /**
   * Handles the submission of the login form.
   * 
   * Triggered when the user clicks on the 'Login' button. 
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - The form event object.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error states
    setError(false);
    setErrorMessage("");

    // Attempt form submission and display error message if any
    try {
      await login(inputs);
      navigate("/");
    } catch (error) {
      setError(true);
      setErrorMessage("Incorrect email or password.");
    }
  }
  
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

            {error && <ErrorDisplay errorMessage={errorMessage}></ErrorDisplay>}

            <div>
              <p className="text-center">Don't have an account? <a href="./register" className="hover-underline-animation font-bold">Register</a></p>
            </div>

        </form>

      </div>

    </div>
  )
}

export default Login
