import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorDisplay from "../../components/ErrorDisplay";

const ChangeBanner = () => {
  // State variables
  // - error: Boolean indicating if there is an error during form submission.
  const [error, setError] = useState<boolean>(false);

  // - errorMessage: String containing the error message to display.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // - title: String containing the title of the story.
  const [title, setTitle] = useState<string>("");

  // - file: File containing the filepath of the story's uploaded image.
  const [file, setFile] = useState<File | null>(null);

  // useNavigate used to go back to user's story after updating their story.
  const navigate = useNavigate();

  // Retrieve the user item from session storage and parse it if it's a valid JSON string.
  const storedUser = sessionStorage.getItem('user');
  const sessionUsername = storedUser && storedUser !== "null" ? JSON.parse(storedUser).user_info.username : null;

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
    await axios.post("/api/stories/upload", { image: filename})
    navigate("/story/write");
  }
  
  useEffect(() => {
    const fetchData = async () => {
        try {
          const res = await axios.post("/api/stories/story", { username: sessionUsername });
          setTitle(res.data.data.title);
        } catch (error) {
          setError(true);
          if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error);
          else setErrorMessage("An unexpected error occurred.");
          console.log(error);
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
