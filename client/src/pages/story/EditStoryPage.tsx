import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditStoryPage = () => {
  // State variables:
  // - error: Boolean indicating if there is an error during form submission.
  const [error, setError] = useState<boolean>(false);

  // - errorMessage: String containing the error message to display.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // - text: String containing HTML for page text.
  const [text, setText] = useState<string>("");

  // Use the useParams hook to get URL parameters.
  const params = useParams() as {
    id: string;
    page_number: string;
  };

  // useEffect fetches the story page's text through an API request to the back end.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id, page_number } = params;

        if (!id || !page_number) {
          setError(true);
          setErrorMessage("Invalid parameters.");
          return;
        }

        const data = {
          username: id,
          page_number: page_number
        };

        const res = await axios.post("/api/stories/page", data);
        setText(res.data.data);
      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error);
        else setErrorMessage("An unexpected error occurred.");
        console.log(error);
      }
    }
    fetchData();
  }, [params]);

  return (
    <div className="flex flex-col justify-items-center">

      <Editor
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
        }}
        initialValue={text}
      />

      <div className="flex flex-row justify-between items-center my-6">
        <div className="flex flex-row justify-center items-center">
          <button className="bg-secondary p-2 rounded-xl shadow-md mr-2 w-32">Previous Page</button>
          <button className="bg-secondary p-2 rounded-xl shadow-md w-32">Next Page</button>
        </div>
        <button className="bg-gradient rounded-xl shadow-md font-bold p-2 w-32">Save Page</button>
      </div>

    </div>
  )
}

export default EditStoryPage
