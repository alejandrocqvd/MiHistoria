import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorDisplay from "../../components/ErrorDisplay";

const ChangePicture = () => {
  // State variables
  // - error: Boolean indicating if there is an error during form submission.
  const [error, setError] = useState<boolean>(false);

  // - errorMessage: String containing the error message to display.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // - file: File containing the filepath of the story's uploaded image.
  const [file, setFile] = useState<File | null>(null);

  // useNavigate used to go back to user's story after updating their story.
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post("/api/upload", formData);
        console.log(res.data.data);
        return res.data.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error); 
      else setErrorMessage("An unexpected error occurred.");
      console.log(error);
    }
  }

  const handleSubmit = async () => {
    const filename = await uploadFile();
    await axios.post("/api/users/upload", { image: filename})
    navigate("/profile/edit");
  }

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete your profile picture?");

    if (isConfirmed) {
      try {
        await axios.delete("/api/users/upload/delete");
        navigate("/profile/edit");
      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error); 
        else setErrorMessage("An unexpected error occurred.");
        console.log(error);
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
        className="w-1/2 py-2 px-4 pl-3 pr-10 rounded-2xl bg-secondary">
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
