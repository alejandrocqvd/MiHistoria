import { useEffect, useState } from "react";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WriteStory = () => {
  // State variables:
  // - error: Boolean indicating if there is an error during form submission.
  const [error, setError] = useState<boolean>(false);

  // - errorMessage: String containing the error message to display.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // - text: String containing HTML for page text.
  const [text, setText] = useState<string>("");

  // - title: String containing the title of the story.
  const [title, setTitle] = useState<string>("");

  // - image: String containing the filename of the story's banner image.
  const [image, setImage] = useState<string>("");
 
  // useNavigate used to go back to user's story after updating their story.
  const navigate = useNavigate();

  // Retrieve the user item from session storage and parse it if it's a valid JSON string.
  const storedUser = sessionStorage.getItem('user');
  const sessionUsername = storedUser && storedUser !== "null" ? JSON.parse(storedUser).user_info.username : null;

  const handleTextChange = (content: string) => {
    setText(content);
  }

  const handleImageDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete your story's banner?");

    if (isConfirmed) {
      try {
        await axios.delete("/api/stories/upload/delete")
        setImage("");
      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error); 
        else setErrorMessage("An unexpected error occurred.");
        console.log(error);
      }
    }
  }

  const handleSave = async () => {
    // Reset error states.
    setError(false);
    setErrorMessage("");

    const data = {
      title: title,
      text: text,
    }

    // Attempt story saving. Display error if any.
    try {
      console.log(text);
      await axios.post("/api/stories/save", data);
      navigate(`/story/${sessionUsername}/page/1`);
    } catch (error) {
      setError(true);
      if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error); 
      else setErrorMessage("An unexpected error occurred.");
      console.log(error);
    }
  }

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
          if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error);
          else setErrorMessage("An unexpected error occurred.");
          console.log(error);
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

      <div className="text-center">
        {error && <p className="text-error text-center mb-2 mt-4">{errorMessage}</p>}
      </div>

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
