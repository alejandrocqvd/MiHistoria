/**
 * Explore New Page Component
 * 
 * This component renders a page with the newest stories ordered by creation date.
 * Each story result is a link to the corresponding the story.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { useEffect, useState } from "react";
import SearchResult from "../../components/SearchResult";
import axios from "axios";
import ErrorDisplay from "../../components/ErrorDisplay";

/**
 * Interface for story search result data
 * 
 * @property {string} title - The title of the story.
 * @property {string} image - The story banner image file name.
 * @property {string} username - The story author's username.
 */
interface SearchData {
  title: string;
  image: string;
  username: string;
}

// Explore New Page Component
const ExploreNew: React.FC = () => {
  // Boolean indicating if there is an error
  const [error, setError] = useState<boolean>(false);

  // String containing the error message to display
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Number indicating the current page number of stories
  const [currentResultPage, setCurrentResultPage] = useState<number>(1);

  // Number indicating the total number of stories loaded in
  const [resultCount, setResultCount] = useState<number>(0);
  
  // Array of objects containing information for search results
  const [data, setData] = useState<SearchData[]>([]);


  /**
   * Handles the show more stories event.
   * 
   * This function increases the current story result page by 1.
   */
  const handleShowMore = () => {
    const nextPage = currentResultPage + 1;
    setCurrentResultPage(nextPage);
  }

  // Fetches the first 50 newest stories on component mount, and fetches 50 more if currentResultPage change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const countRes = await axios.get("/api/searches/stories/count");
        const count = countRes.data.data.count;
        setResultCount(count);

        const res = await axios.post("/api/searches/new", {
          page: currentResultPage, 
          limit: 50
        });
        // Fill the data array with new data from the API request
        const newData = res.data.data.map((story: any) => ({
          title: story.title,
          username: story.username,
          image: story.image
        }));
        // Update the state by appending new stories, avoiding duplicates
        setData(prevStories => {
          const existingUsernames = new Set(prevStories.map(s => s.username));
          const filteredUsernames = newData.filter((story: { username: string; }) => !existingUsernames.has(story.username));
          return [...prevStories, ...filteredUsernames];
        });
      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.message);
        else setErrorMessage("An unexpected error occurred.");
        console.log(error);
      }
    }
    fetchData();
  },[currentResultPage]);

  return (
    <div className="flex flex-col justify-center items-center h-auto w-9/12 mb-24 mt-32">
      <p className="text-center p-2 mb-10 font-bold text-5xl bg-clip-text text-transparent bg-gradient">New Stories</p>
  
      {error && <ErrorDisplay errorMessage={errorMessage}></ErrorDisplay>}
  
      <div className="flex flex-col justify-center items-center w-full md:w-1/2">
        {data.map(searchResult => (
          <SearchResult key={searchResult.username} data={searchResult} />
        ))}
      </div>

      {(currentResultPage * 50) < resultCount && ( // 50 is the limit of stories per result page
        <button 
          onClick={handleShowMore}
          className="w-1/2 mb-4 px-6 py-3 bg-gradient rounded-xl font-semibold"
          >See More
        </button>
      )}
    </div>
  )
}

export default ExploreNew;
