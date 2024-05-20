/**
 * Register Page Component
 * 
 * This component renders a page where the user can register. If they already have an account, 
 * they are presented with a link to the login page.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorDisplay from "../../components/ErrorDisplay";


/**
 * Interface for holding the inputted registration information
 * 
 * @property {string} first_name - Inputted first name.
 * @property {string} last_name - Inputted last name.
 * @property {string} username - Inputted username.
 * @property {string} email - Inputted email address.
 * @property {string} dob - Inputted date of birth.
 * @property {string} password - Inputted password.
 */
interface FormData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  dob: string;
  password: string;
}

// Register Page Component
const Register: React.FC = () => {
  // Boolean indicating if the password input is hidden or visible
  const [passwordHidden1, setPasswordHidden1] = useState<boolean>(true);
  
  // Boolean indicating if the confirm password input is hidden or visible
  const [passwordHidden2, setPasswordHidden2] = useState<boolean>(true);

  // String containing the contents of the confirm password input
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Boolean indicating if there is an error during form submission
  const [error, setError] = useState<boolean>(false);

  // String containing the error message to display
  const [errorMessage, setErrorMessage] = useState<string>("");

  // - inputs: Object holding the form data for user registration
  const [inputs, setInputs] = useState<FormData>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    dob: "",
    password: "",
  });

  // useNavigate used to go to login page after registration
  const navigate = useNavigate();

  /**
   * Handles input changes for registration form.
   * 
   * Triggers when the user changes any of the input fields.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}));
  }

  /**
   * Handles changes in the confirm password input field.
   * 
   * Triggers when the user changes the input inside the 'change password' field.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   */
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  }

  /**
   * Handles the submission of the registration form.
   * 
   * Triggers when the user clicks on the 'Register' button.
   * Attempts inserting a new user into the database through an API call.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - The form event object.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Calculate age to verify later
    const birthday = new Date(inputs.dob);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    
    // Check if user is older than 16 years
    if (age < 16) {
      setError(true);
      setErrorMessage("You must be at least 16 years old to register.");
      return;
    }

    // Check if passwords match
    if (inputs.password !== confirmPassword) {
      setError(true);
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Reset error states
    setError(false);
    setErrorMessage("");

    // Attempt form submission and display error if any
    try {
      await axios.post("/api/auth/register", inputs);
      navigate("/login");
    } catch (error) {
      setError(true);
      if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.message); 
      else setErrorMessage("An unexpected error occurred.");
    }
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-img-login">

      <div className="flex flex-col justify-center item-center px-24 py-16 bg-black bg-opacity-25 backdrop-blur-lg rounded-2xl">

        <h1 className="text-4xl text-center font-bold mb-12">Register</h1>

        <form onSubmit={handleSubmit} className="w-80">

            <div className="flex flex-row w-full pb-4">
              <input 
                name="first_name"
                onChange={handleChange}
                className="w-full py-2 px-4 rounded-2xl mr-2" 
                type="text" 
                placeholder="First Name">
              </input>
              <input 
                name="last_name"
                onChange={handleChange}
                className="w-full py-2 px-4 rounded-2xl ml-2" 
                type="text" 
                placeholder="Last Name">
              </input>
            </div>

            <div className="pb-4 relative">
              <input 
                name="username"
                onChange={handleChange}
                className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl" 
                type="text" placeholder="Username" 
                required>
              </input>
              <FontAwesomeIcon className="absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm" icon={faUser} />
            </div>

            <div className="pb-4 relative">
                <input 
                  name="email"
                  onChange={handleChange}
                  className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl" 
                  type="email" 
                  placeholder="Email" required>
                </input>
                <FontAwesomeIcon className="absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm" icon={faEnvelope} />
              </div>

            <div className="w-full pb-4">
              <input 
                name="dob"
                onChange={handleChange}
                className="w-full py-2 px-4 rounded-2xl" 
                type="date" 
                placeholder="Date of Birth"
                required>
              </input>
            </div>

            <div className="pb-4 relative">
              <input 
                name="password"
                onChange={handleChange}
                className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl" 
                type={passwordHidden1 ? "password" : "text"} 
                placeholder="Password" 
                required>
              </input>
              <button className="absolute inset-y-0 right-0 px-5 pb-4 flex items-center text-sm" type="button" onClick={() => setPasswordHidden1(passwordHidden1 => !passwordHidden1)}>
                {passwordHidden1 ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
              </button>           
            </div>

            <div className="pb-4 relative">
              <input 
                onChange={handleConfirmPasswordChange}
                className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl" 
                type={passwordHidden2 ? "password" : "text"} 
                placeholder="Confirm Password" 
                required>
              </input>
              <button className="absolute inset-y-0 right-0 px-5 pb-4 flex items-center text-sm" type="button" onClick={() => setPasswordHidden2(passwordHidden2 => !passwordHidden2)}>
                {passwordHidden2 ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
              </button>            
            </div>

            <div className="flex justify-center items-center pt-4 pb-4">
              <button 
                type="submit"
                className="flex justify-center items-center h-10 w-24 bg-gradient rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105"
              >
                  Register
              </button>
            </div>
            
            {error && <ErrorDisplay errorMessage={errorMessage}></ErrorDisplay>}

            <div>
              <p className="text-center">Already have an account? <a href="/login" className="hover-underline-animation font-bold">Login</a></p>
            </div>

        </form>

      </div>

    </div>
  )
}

export default Register
