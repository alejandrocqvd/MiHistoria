import { useEffect, useState } from "react";
import SearchResult from "../../components/SearchResult";
import axios from "axios";
import ErrorDisplay from "../../components/ErrorDisplay";

interface SearchData {
  title: string;
  image: string;
  username: string;
}

const ExploreTop = () => {
  // State variables:
  // - error: Boolean indicating if there is an error.
  const [error, setError] = useState<boolean>(false);

  // - errorMessage: String containing the error message to display.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // - monthly: Boolean indicating if the user has selected top stories this month.
  const [monthly, setMonthly] = useState<boolean>(false);
  
  // - yearly: Boolean indicating if the user has selected top stories this year.
  const [yearly, setYearly] = useState<boolean>(false);

  // - allTime: Boolean indicating if the user has selected top stories of all time.
  const [allTime, setAllTime] = useState<boolean>(true);

  // - currentResultPage: Number indicating the current page number of stories.
  const [currentResultPage, setCurrentResultPage] = useState<number>(1);

  // - resultCount: Number indicating the total number of stories loaded in.
  const [resultCount, setResultCount] = useState<number>(0);

  // - data: Array of objects containing information for search results.
  const [data, setData] = useState<SearchData[]>([]);

  const handleShowMore = () => {
    const nextPage = currentResultPage + 1;
    setCurrentResultPage(nextPage);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiEndpoint = monthly ? "/api/searches/top/monthly" :
                            yearly ? "/api/searches/top/yearly" :
                            "/api/searches/top";
        const countRes = await axios.get(apiEndpoint + "/count");
        setResultCount(countRes.data.data.count);

        const res = await axios.post(apiEndpoint, {
          page: currentResultPage,
          limit: 50
        });
        // Fill the data array with new data from the API request.
        const newData = res.data.data.map((story: any) => ({
          title: story.title,
          username: story.username,
          image: story.image
        }));
        // Update the state by appending new stories, avoiding duplicates.
        setData(prevStories => {
          const existingUsernames = new Set(prevStories.map(s => s.username));
          const filteredUsernames = newData.filter((story: { username: string; }) => !existingUsernames.has(story.username));
          return [...prevStories, ...filteredUsernames];
        });
      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error);
        else setErrorMessage("An unexpected error occurred.");
        console.log(error);
      }
    }
    fetchData();
  },[monthly, yearly, allTime, currentResultPage]);

  return (
    <div className="flex flex-col justify-center items-center h-auto w-9/12 mb-24 mt-32">
      <p className="text-center p-2 font-bold text-5xl bg-clip-text text-transparent bg-gradient">Top Stories</p>

      {error && <ErrorDisplay errorMessage={errorMessage}></ErrorDisplay>}

      <div className="flex flex-row justify-center items-center my-10">
        <button 
          onClick={() => { setMonthly(true); setYearly(false); setAllTime(false); }}
          className={`${monthly && "border-text"} flex justify-center items-center h-10 w-28 p-4 border-2 border-secondary bg-secondary text-sm rounded-xl shadow-lg font-bold hover:shadow-xl`}
          >This Month
        </button>
        <button 
          onClick={() => { setMonthly(false); setYearly(true); setAllTime(false); }}
          className={`${yearly && "border-text"} flex justify-center items-center h-10 w-28 mx-4 p-4 border-2 border-secondary bg-secondary text-sm rounded-xl shadow-lg font-bold hover:shadow-xl`}
          >This Year
        </button>
        <button 
          onClick={() => { setMonthly(false); setYearly(false); setAllTime(true); }}
          className={`${allTime && "border-text"} flex justify-center items-center h-10 w-28 p-4 border-2 border-secondary bg-secondary text-sm rounded-xl shadow-lg font-bold hover:shadow-xl`}
          >All Time
        </button>
      </div>

      <div className="flex flex-col justify-center items-center w-1/2">
        {data.map(searchResult => (
          <SearchResult key={searchResult.username} data={searchResult} />
        ))}
      </div>

      {(currentResultPage * 50) < resultCount && (
        <button 
          onClick={handleShowMore}
          className="w-1/2 mb-4 px-6 py-3 bg-gradient rounded-xl font-semibold"
          >See More
        </button>
      )}
    </div>
  )
}

export default ExploreTop;
