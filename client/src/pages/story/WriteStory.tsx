/**
 * Write Story Page Component
 * 
 * This component renders a page where the user can create or modify their story.
 * Has a field for title, a rich text editor for story text, and a button to change 
 * or delete the story's banner image.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { useEffect, useState } from "react";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorDisplay from "../../components/ErrorDisplay";

const WriteStory: React.FC = () => {
  // Boolean indicating if there is an error during form submission
  const [error, setError] = useState<boolean>(false);

  // String containing the error message to display
  const [errorMessage, setErrorMessage] = useState<string>("");

  // String containing HTML for page text
  const [text, setText] = useState<string>("");

  // String containing the title of the story
  const [title, setTitle] = useState<string>("");

  // String containing the filename of the story's banner image
  const [image, setImage] = useState<string>("");
 
  // useNavigate used to go back to user's story after updating their story
  const navigate = useNavigate();

  // Retrieve the user item from session storage and parse it if it's a valid JSON string
  const storedUser = sessionStorage.getItem('user');
  const sessionUsername = storedUser && storedUser !== "null" ? JSON.parse(storedUser).user_info.username : null;

  /**
   * Handles rich text editor input change event.
   * 
   * This function is triggered when the text changes inside the TinyMCE text editor.
   * 
   * @param {string} content - HTML content as a string.
   */
  const handleTextChange = (content: string) => {
    setText(content);
  }

  /**
   * Handles story banner image deletion event.
   * 
   * This function is triggered when the user clicks on the 'Delete Banner' button.
   * When clicked, it prompts the user with a confirmation screen to confirm deletion.
   * If confirmed, attempts image deletion through an API call.
   */
  const handleImageDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete your story's banner?");

    if (isConfirmed) {
      try {
        await axios.delete("/api/stories/upload/delete")
        setImage("");
      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.message); 
        else setErrorMessage("An unexpected error occurred.");
      }
    }
  }

  /**
   * Handles story saving event.
   * 
   * This function is triggered when the user clicks on the 'Save Story' button. 
   * Attempts an API call to update or insert the story and all its values into the database.
   */
  const handleSave = async () => {
    // Reset error states
    setError(false);
    setErrorMessage("");

    const data = {
      title: title,
      text: text,
    }

    // Attempt story saving. Display error if any
    try {
      await axios.post("/api/stories/save", data);
      navigate(`/story/${sessionUsername}/page/1`);
    } catch (error) {
      setError(true);
      if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.message); 
      else setErrorMessage("An unexpected error occurred.");
    }
  }

  // Fetches the story's existing data to populate the input fields on mounting, if any.
  useEffect(() => {
    const fetchData = async () => {
        try {
          const res = await axios.post("/api/stories/story", { username: sessionUsername });
          if (res.data.data) {
            setText(res.data.data.text);
            setTitle(res.data.data.title);
            setImage(res.data.data.story_image);
          }
        } catch (error) {
          setError(true);
          if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.message);
          else setErrorMessage("An unexpected error occurred.");
        }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-items-center w-9/12 md:w-1/2 mt-24 h-screen">

      <input 
        type="text" 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title..." 
        className="text-5xl text-center font-bold pb-1 rounded-xl bg-tertiary">
      </input>

      <div className="flex flex-col md:flex-row w-full justify-center items-center my-2">
        <button 
          onClick={() => navigate("/story/banner")}
          className="justify-items-center h-10 w-full text-lg border-2 rounded-xl shadow-lg font-bold"
          >Change Story Banner
        </button>
        {image && (
          <button 
            onClick={handleImageDelete}
            className="justify-items-center h-10 w-full text-lg border-2 rounded-xl shadow-lg font-bold md:ml-2 my-2 md:my-0"
            >Delete Story Banner
        </button>
        )}
      </div>

      <TinyMCEEditor
        apiKey="cl0f7stppfmnuulii3hvi4dhnko97k32vvg06zrd6n8ealln"
        init={{
          plugins: "anchor autolink charmap codesample image link lists media searchreplace visualblocks wordcount",
          toolbar: "undo redo | blocks fontsize | bold italic underline strikethrough | link image media | align lineheight | tinycomments | checklist numlist bullist indent outdent | removeformat",
          tinycomments_mode: "embedded",
          tinycomments_author: "Author name",
          mergetags_list: [
            { value: "First.Name", title: "First Name" },
            { value: "Email", title: "Email" },
          ],
          height: 640,
          content_style: "body { overflow-y: auto; }",
          directionality: 'ltr',
        }}
        onEditorChange={handleTextChange}
        value={text}
      />

      {error && <ErrorDisplay errorMessage={errorMessage}></ErrorDisplay>}

      <div className="flex flex-row justify-center items-center my-4">
        <button 
          onClick={handleSave} className="bg-gradient rounded-xl shadow-md font-bold p-2 w-32 mr-2 hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out"
          >Save Story
        </button>
      </div>

    </div>
  )
}

export default WriteStory;
