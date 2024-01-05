import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import ErrorDisplay from "../../components/ErrorDisplay";

const StoryPage = () => {
  // State variables:
  // - error: Boolean indicating if there is an error.
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

        const res = await axios.post("/api/stories/page", { username: id, page_number });
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
    <div className="flex flex-col justify-start items-center">
      {error && <ErrorDisplay errorMessage={errorMessage}></ErrorDisplay>}
      <div className="flex flex-wrap flex-col w-full" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  )
  
}

export default StoryPage
