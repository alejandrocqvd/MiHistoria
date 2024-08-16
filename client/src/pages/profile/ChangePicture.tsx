/**
 * Change Profile Picture Page Component
 * 
 * This component renders a page where the user can change their account's profile picture.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import axios from "axios";
import api from "../../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorDisplay from "../../components/ErrorDisplay";

// Change Profile Picture Page Component
const ChangePicture: React.FC = () => {
  // Boolean indicating if there is an error during form submission
  const [error, setError] = useState<boolean>(false);

  // String containing the error message to display
  const [errorMessage, setErrorMessage] = useState<string>("");

  // File containing the filepath of the story's uploaded image
  const [file, setFile] = useState<File | null>(null);

  // useNavigate used to go back to user's story after updating their story
  const navigate = useNavigate();

  /**
   * Handles file input change events.
   * 
   * This function is triggered when the file input field changes.
   * It updates the component's state with the first selected file, if any.
   * 
  * @param {React.ChangeEvent<HTMLInputElement>} e - The event object that contains information about the change event. 
  */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  /**
   * Handles file upload.
   * 
   * This function is triggered when the user clicks on the 'Save Profile Picture' button where 
   * handleSubmit() calls this function.
   * It attempts an API call to upload the image to the uploads directory.
   * 
   * @returns The file name returned from the API on successful upload or 'undefined' if it fails.
   */
  const uploadFile = async () => {
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await api.post("/api/upload", formData);
        return res.data.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.message); 
      else setErrorMessage("An unexpected error occurred.");
    }
  }

  /**
   * Handles profile picture submission event.
   * 
   * This function attempts to upload the image to the uploads directory. 
   * If successful, it makes an API call to update the user in the database to include the image.
   * Then navigates back to the edit profile page.
   */
  const handleSubmit = async () => {
    const filename = await uploadFile();
    await api.post("/api/users/upload", { image: filename})
    navigate("/profile/edit");
  }

  /**
   * Handles profile picture image deletion event.
   * 
   * This function is triggered when the user clicks on the 'Delete Profile Picture' button.
   * When clicked, it prompts the user with a confirmation screen to confirm deletion.
   * If confirmed, attempts image deletion through an API call.
   */
  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete your profile picture?");

    if (isConfirmed) {
      try {
        await api.delete("/api/users/upload/delete");
        navigate("/profile/edit");
      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.message); 
        else setErrorMessage("An unexpected error occurred.");
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen w-9/12 md:w-1/2">
      <p className="text-3xl font-bold my-4">Change Profile Picture</p>
      <input 
        type="file" 
        accept="image/jpeg, image/png"
        onChange={handleFileChange}
        className="w-full md:w-1/2 py-2 px-4 pl-3 pr-10 rounded-2xl bg-secondary">
      </input>

      {error && <ErrorDisplay errorMessage={errorMessage}></ErrorDisplay>}

      <div className="flex flex-row md:flex-row justify-center items-center pt-4 pb-4 mb-10">
        <button 
          onClick={handleSubmit}
          className="flex justify-center items-center h-10 w-44 bg-gradient rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105"
          >Save Profile Picture
        </button>
        <button 
          onClick={handleDelete}
          className="flex justify-center items-center h-10 w-44 ml-4 bg-error rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:bg-[#9A0E2A]"
          >Delete Profile Picture
        </button>
      </div>
    </div>
  )
}

export default ChangePicture;
