/**
 * Change Password Page Component
 * 
 * This component renders a page where the user can change their account's password.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import axios from "axios";
import api from "../../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import ErrorDisplay from "../../components/ErrorDisplay";

// Change Password Page Component
const ChangePassword: React.FC = () => {
  // Boolean indicating if there is an error during form submission
  const [error, setError] = useState<boolean>(false);

  // String containing the error message to display
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Boolean indicating if the password input is hidden or visible
  const [passwordHidden1, setPasswordHidden1] = useState<boolean>(true);
  
  // Boolean indicating if the confirm password input is hidden or visible
  const [passwordHidden2, setPasswordHidden2] = useState<boolean>(true);

  // String containing the contents of the confirm password input
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // String containing the new password
  const [password, setPassword] = useState<string>("");

  // useNavigate used to go to login page after registration
  const navigate = useNavigate();

  /**
   * Handles input changes for password form.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    }
  
    /**
     * Handles changes in the confirm password input field.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
     */
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
    }

    /**
     * Handles the submission of the change password form. 
     * 
     * This function checks if the two passwords field match, then attempts 
     * password change through an API call.
     * 
     * @param {React.FormEvent<HTMLFormElement>} e - The form event object.
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Check if passwords match
      if (password !== confirmPassword) {
        setError(true);
        setErrorMessage("Passwords do not match.");
        return;
      }

      // Reset error states
      setError(false);
      setErrorMessage("");

      // Attempt form submission and display error if any
      try {
        const data = {
          password: password
        }
        await api.post("/api/users/password", data, {
          withCredentials: true
        });
        navigate("/profile/edit");
      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.message);
        else setErrorMessage("An unexpected error occurred.");
      }
    }

  return (
    <div className="flex flex-col justify-center items-center h-screen w-9/12">

      <p className="text-5xl font-bold text-center mb-12">Change Password</p>

      <form onSubmit={handleSubmit} className="w-9/12 md:w-4/12">

        <p className="mb-2 mx-2 font-semibold text-xl">New Password</p>
        <div className="pb-4 relative">
          <input 
            name="password"
            onChange={handleChange}
            className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl bg-secondary" 
            type={passwordHidden1 ? "password" : "text"} 
            placeholder="Password" 
            required>
          </input>
          <button 
            className="absolute inset-y-0 right-0 px-5 pb-4 flex items-center text-sm" 
            type="button" 
            onClick={() => setPasswordHidden1(passwordHidden1 => !passwordHidden1)}
            >{passwordHidden1 ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
          </button>           
        </div>

        <p className="mb-2 mx-2 font-semibold text-xl">Confirm Password</p>
        <div className="pb-4 relative">
          <input 
            onChange={handleConfirmPasswordChange}
            className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl bg-secondary" 
            type={passwordHidden2 ? "password" : "text"} 
            placeholder="Confirm Password" 
            required>
          </input>
          <button 
            className="absolute inset-y-0 right-0 px-5 pb-4 flex items-center text-sm" 
            type="button" 
            onClick={() => setPasswordHidden2(passwordHidden2 => !passwordHidden2)}
            >{passwordHidden2 ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
          </button>            
        </div>

        {error && <ErrorDisplay errorMessage={errorMessage}></ErrorDisplay>}

        <div className="flex flex-col md:flex-row justify-center items-center pt-4 pb-4 mb-10">
          <button 
            type="submit"
            className="flex justify-center items-center h-10 w-40 m-4 bg-gradient rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105"
            >Save Password
          </button>
        </div>

      </form>

    </div>
  )
}

export default ChangePassword;
