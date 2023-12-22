import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ChangePassword = () => {
  // State variables:
  // - error: Boolean indicating if there is an error during form submission.
  const [error, setError] = useState<boolean>(false);

  // - errorMessage: String containing the error message to display.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // - passwordHidden1: Boolean indicating if the password input is hidden or visible.
  const [passwordHidden1, setPasswordHidden1] = useState<boolean>(true);
  
  // - passwordHidden2: Boolean indicating if the confirm password input is hidden or visible.
  const [passwordHidden2, setPasswordHidden2] = useState<boolean>(true);

  // - confirmPassword: String containing the contents of the confirm password input.
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // - password: String containing the new password.
  const [password, setPassword] = useState<string>("");

  // useNavigate used to go to login page after registration
  const navigate = useNavigate();

  /**
   * Handles input changes for password form.
   * @param e - The React change event.
   */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    }
  
    /**
     * Handles changes in the confirm password input field.
     * @param e - The React change event.
     */
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Check if passwords match.
      if (password !== confirmPassword) {
        setError(true);
        setErrorMessage("Passwords do not match.");
        return;
      }

      // Reset error states.
      setError(false);
      setErrorMessage("");

      // Attempt form submission. Display error if any.
      try {
        const data = {
          password: password
        }
        await axios.post("/api/users/password", data, {
          withCredentials: true
        });
        navigate("/profile/edit");
      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error);
        else setErrorMessage("An unexpected error occurred.");
        console.log(error);
      }
    }

    /**
   * Renders the change password form.
   * Displays an error message if updating password fails.
   */
  return (
    <div className="flex flex-col justify-center items-center h-screen w-9/12">

      <h1 className="text-5xl font-bold text-center mb-12">Change Password</h1>

      <form onSubmit={handleSubmit} className="w-9/12 md:w-4/12">

        <h1 className="mb-2 mx-2 font-semibold text-xl">New Password</h1>
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

        <h1 className="mb-2 mx-2 font-semibold text-xl">Confirm Password</h1>
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

        <div className="text-center">
            {error && <p className="text-error">{errorMessage}</p>}
        </div>

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
