/**
 * Change Banner Page Component
 * 
 * This component renders the change story banner page. 
 * Presents the user with a file upload and a submission button.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import axios from "axios";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorDisplay from "../../components/ErrorDisplay";

// Change Story Banner Component
const ChangeBanner: React.FC = () => {
  // Boolean indicating if there is an error during form submission
  const [error, setError] = useState<boolean>(false);

  // String containing the error message to display
  const [errorMessage, setErrorMessage] = useState<string>("");

  // String containing the title of the story
  const [title, setTitle] = useState<string>("");

  // File containing the filepath of the story's uploaded image
  const [file, setFile] = useState<File | null>(null);

  // useNavigate used to go back to user's story after updating their story
  const navigate = useNavigate();

  // Retrieve the user item from session storage and parse it if it's a valid JSON string
  const storedUser = sessionStorage.getItem('user');
  const sessionUsername = storedUser && storedUser !== "null" ? JSON.parse(storedUser).user_info.username : null;

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
   * This function is triggered when the user clicks on the 'Save Banner' button where 
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
   * Handles banner submission event.
   * 
   * This function attempts to upload the image to the uploads directory. 
   * If successful, it makes an API call to update the story in the database to include the image.
   * Then navigates back to story writing page.
   */
  const handleSubmit = async () => {
    const filename = await uploadFile();
    await api.post("/api/stories/upload", { image: filename})
    navigate("/story/write");
  }
  
  // Fetch the existing story data to populate the title text.
  useEffect(() => {
    const fetchData = async () => {
        try {
          const res = await api.post("/api/stories/story", { username: sessionUsername });
          setTitle(res.data.data.title);
        } catch (error) {
          setError(true);
          if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.message);
          else setErrorMessage("An unexpected error occurred.");
        }
    }
    fetchData();
  }, []);

  return (
    <>
      {title !== "" ? (
        <div className="flex flex-col justify-center items-center mt-24 h-screen w-9/12 md:w-1/2">
          <p className="text-3xl font-bold my-4">Change Story Banner</p>
          <input 
            type="file" 
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            className="w-full md:w-1/2 py-2 px-4 pl-3 pr-10 rounded-2xl bg-secondary">
          </input>

          {error && <ErrorDisplay errorMessage={errorMessage}></ErrorDisplay>}

          <div className="flex flex-col md:flex-row justify-center items-center pt-4 pb-4 mb-10">
            <button 
              onClick={handleSubmit}
              className="flex justify-center items-center h-10 w-40 mb-32 bg-gradient rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105"
              >Save Banner
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mt-32 h-screen">
          <p className="text-center font-bold text-4xl mb-44">You must create a story first.</p>
        </div>
      )}
    </>
  )
}

export default ChangeBanner;
