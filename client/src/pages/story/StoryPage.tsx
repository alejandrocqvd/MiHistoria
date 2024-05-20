/**
 * Story Page Component
 * 
 * This component renders a specific story page for a specified story.
 * Displays all HTML text that has been sanitized.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import ErrorDisplay from "../../components/ErrorDisplay";

const StoryPage: React.FC = () => {
  // Boolean indicating if there is an error
  const [error, setError] = useState<boolean>(false);

  // String containing the error message to display
  const [errorMessage, setErrorMessage] = useState<string>("");

  // String containing HTML for page text
  const [text, setText] = useState<string>("");

  // Use the useParams hook to get URL parameters
  const params = useParams() as {
    id: string;
    page_number: string;
  };

  // Fetches the story page's text through an API request, changes on mounting and param changes
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
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.message);
        else setErrorMessage("An unexpected error occurred.");
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
