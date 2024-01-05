import { useEffect, useState } from "react";
import SearchResult from "../../components/SearchResult";
import axios from "axios";

interface SearchData {
  title: string;
  image: string;
  username: string;
}

const ExploreAllTimeTop = () => {
  // State variables:
  // - error: Boolean indicating if there is an error.
  const [error, setError] = useState<boolean>(false);

  // - errorMessage: String containing the error message to display.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // - data: Array of objects containing information for search results.
  const [data, setData] = useState<SearchData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/searches/top");
        setData(res.data.data);
      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error);
        else setErrorMessage("An unexpected error occurred.");
        console.log(error);
      }
    }
    fetchData();
  });

  return (
    <div className="flex flex-col justify-center items-center h-auto w-9/12 mb-24 mt-32">
      <p className="text-center mb-10 p-2 font-bold text-5xl bg-clip-text text-transparent bg-gradient">Top Stories of All Time</p>

      <div className="flex flex-col justify-center items-center mb-12 w-1/2">
        {data.map(searchResult => (
          <SearchResult key={searchResult.username} data={searchResult} />
        ))}
      </div>
    </div>
  )
}

export default ExploreAllTimeTop;
