import { useEffect, useState } from "react";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import axios from "axios";

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

  // Retrieve the user item from session storage and parse it if it's a valid JSON string.
  const storedUser = sessionStorage.getItem('user');
  const sessionUsername = storedUser && storedUser !== "null" ? JSON.parse(storedUser).user_info.username : null;

  const handleTextChange = (content: string) => {
    setText(content);
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }

  const handleSave = async () => {
    // Reset error states.
    setError(false);
    setErrorMessage("");

    const data = {
      title: title,
      text: text
    }

    // Attempt story saving. Display error if any.
    try {
      console.log(text);
      await axios.post("/api/stories/save", data);
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
          const res = await axios.post("/api/stories/story", { username: sessionUsername});
          setText(res.data.data.text);
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
    <div className="flex flex-col justify-items-center w-9/12 md:w-1/2 mt-24 h-screen">

      <input 
        type="text" 
        value={title}
        onChange={handleTitleChange}
        placeholder="Title..." 
        className="text-5xl text-center font-bold my-8 pb-1 rounded-xl bg-tertiary">
      </input>

      <TinyMCEEditor
        apiKey="cl0f7stppfmnuulii3hvi4dhnko97k32vvg06zrd6n8ealln"
        init={{
          plugins: "tinycomments mentions anchor autolink charmap codesample image link lists media searchreplace visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss",
          toolbar: "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media | align lineheight | tinycomments | checklist numlist bullist indent outdent | removeformat",
          tinycomments_mode: "embedded",
          tinycomments_author: "Author name",
          mergetags_list: [
            { value: "First.Name", title: "First Name" },
            { value: "Email", title: "Email" },
          ],
          height: 600,
          content_style: "body { overflow-y: auto; }",
          directionality: 'ltr',
        }}
        onEditorChange={handleTextChange}
        value={text}
      />

      <div className="flex flex-row justify-center items-center my-6">
        <button onClick={handleSave} className="bg-gradient rounded-xl shadow-md font-bold p-2 w-32 mr-2">Save Story</button>
      </div>

    </div>
  )
}

export default WriteStory;
