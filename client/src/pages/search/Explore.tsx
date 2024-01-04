import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import homeBg from "../../assets/home-bg.png";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import SearchResult from "../../components/SearchResult";
import { Link } from "react-router-dom";

interface SearchData {
  title: string;
  image: string;
  username: string;
}

const Explore = () => {
  // State variables:
  // - error: Boolean indicating if there is an error.
  const [error, setError] = useState<boolean>(false);

  // - errorMessage: String containing the error message to display.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // - searchTerm: String containing the user's search input.
  const [searchTerm, setSearchTerm] = useState<string>("");

  // - data: Array of objects containing information for search results.
  const [data, setData] = useState<SearchData[]>([]);

  // - savedData: Array of objects containing information for 5 saved stories.
  const [savedData, setSavedData] = useState<SearchData[]>([]);

  // - topMonthlyData: Array of objects containing information for top 5 stories in the past month.
  const [topMonthlyData, setTopMonthlyData] = useState<SearchData[]>([]);

  // - topYearlyData: Array of objects containing information for top 5 stories in the past year.
  const [topYearlyData, setTopYearlyData] = useState<SearchData[]>([]);

  // - topData: Array of objects containing information for top 5 stories of all time.
  const [topData, setTopData] = useState<SearchData[]>([]);

  // useStates for search parameters.
  const [searchStories, setSearchStories] = useState<boolean>(false);

  const [searchUsers, setSearchUsers] = useState<boolean>(false);

  // useStates for identifying if the user has typed something in search bar.
  const [searching, setSearching] = useState<boolean>(false);

  // AuthContext to get current user
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext!;

  // Updates the search title according to chosen filters.
  const getSearchTitle = () => {
    if (searchStories) return "Search by Story";
    if (searchUsers) return "Search by User";
    return "Search";
  }

  // Used to determine whether or not to show top stories, newest stories, if the user has started searching.
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target.value;
    if (value.length > 0) {
      setSearching(true);
      setSearchTerm(value);
      handleSearch();
    } else {
      setSearching(false);
      setData([]);
    }
  }

  const handleSearch = async () => {
    try {
      const apiEndpoint = searchStories ? "/api/searches/story" :
                          searchUsers ? "/api/searches/user" :
                          "/api/searches/all";
      const res = await axios.post(apiEndpoint, { searchTerm });
      setData(res.data.data);
    } catch (error) {
      setError(true);
      if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error);
      else setErrorMessage("An unexpected error occurred.");
      console.log(error);
    }
  }

  useEffect(() => {
    if (searching) handleSearch();
  }, [searchStories, searchUsers]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          const savedRes = await axios.get("/api/searches/saved/5");
          setSavedData(savedRes.data.data);
        }

        const monthlyRes = await axios.get("/api/searches/top/monthly/5");
        setTopMonthlyData(monthlyRes.data.data);

        const yearlyRes = await axios.get("/api/searches/top/yearly/5");
        setTopYearlyData(yearlyRes.data.data);

        const topRes = await axios.get("/api/searches/top/5");
        setTopData(topRes.data.data);
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
      <div className="flex flex-col justify-center items-center h-auto w-9/12 mb-24 mt-32">

        <div className="flex flex-col w-full md:w-1/2">
          <p className="text-center mb-10 p-2 font-bold text-5xl bg-clip-text text-transparent bg-gradient">{getSearchTitle()}</p>

          <div className="w-full relative">
            <input type="text" placeholder="Search..." className="w-full rounded-xl py-4 md:py-3 px-6 bg-secondary shadow-lg" onChange={handleSearchChange}></input>
            <button className="absolute inset-y-0 right-0 px-6 flex items-center text-sm">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          <div className="flex flex-row justify-center items-center mb-12">
            <button 
              className={ searchStories ? "bg-secondary w-1/2 my-3 pt-1 pb-2 rounded-xl shadow-md" : "w-1/2 my-3  pt-1 pb-2 rounded-xl shadow-md" } 
              onClick={() => { setSearchStories(!searchStories); setSearchUsers(false); }}
              >Stories
            </button>
            <button 
              className={ searchUsers ? "bg-secondary w-1/2 my-3 pt-1 pb-2 rounded-xl shadow-md" : "w-1/2 my-3 pt-1 pb-2 rounded-xl shadow-md" } 
              onClick={() => { setSearchUsers(!searchUsers); setSearchStories(false); }}
              >Users
            </button>
          </div>

          <div className="text-center">
            {error && <p className="text-error">{errorMessage}</p>}
          </div>

          <div className={ searching ? "flex flex-col justify-center items-center mb-12" : "hidden"}>
            {data.map(searchResult => (
              <SearchResult key={searchResult.username} data={searchResult} />
            ))}
          </div>

          <div className={ searching || !currentUser ? "hidden" : "flex flex-col justify-center items-center mb-12"}>
            <p className="text-3xl font-semibold mb-8">Saved Stories</p>
            {savedData.map(searchResult => (
              <SearchResult key={searchResult.username} data={searchResult} />
            ))}
            <button className="w-full mb-4 px-6 py-3 bg-gradient rounded-xl hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out font-semibold">
              See More
            </button>
          </div>

          <div className={ searching ? "hidden" : "flex flex-col justify-center items-center mb-12"}>
            <p className="text-3xl font-semibold mb-8">Top Stories This Month</p>
            {topMonthlyData.map(searchResult => (
              <SearchResult key={searchResult.username} data={searchResult} />
            ))}
            <Link to={"/explore/top/monthly"} className="w-full mb-4 px-6 py-3 text-center bg-gradient rounded-xl hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out font-semibold">
              See More
            </Link>
          </div>
          
          <div className={ searching ? "hidden" : "flex flex-col justify-center items-center mb-12"}>
            <p className="text-3xl font-semibold mb-8">Top Stories This Year</p>
            {topYearlyData.map(searchResult => (
              <SearchResult key={searchResult.username} data={searchResult} />
            ))}
            <Link to={"/explore/top/yearly"} className="w-full mb-4 px-6 py-3 text-center bg-gradient rounded-xl hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out font-semibold">
              See More
            </Link>
          </div>

          <div className={ searching ? "hidden" : "flex flex-col justify-center items-center mb-12"}>
            <p className="text-3xl font-semibold mb-8">Top Stories of All Time</p>
            {topData.map(searchResult => (
              <SearchResult key={searchResult.username} data={searchResult} />
            ))}
            <Link to={"/explore/top"} className="w-full mb-4 px-6 py-3 text-center bg-gradient rounded-xl hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out font-semibold">
              See More
            </Link>
          </div>

          <div className={ searching ? "hidden" : "flex flex-col justify-center items-center mb-12"}>
            <p className="text-3xl font-semibold mb-8">New Stories</p>
            <a href="./story/:id" className="flex flex-row justify-between items-center w-full mb-4 px-6 py-3 bg-secondary rounded-xl hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out">
              <div className="flex flex-row justify-center items-center overflow-hidden">
                <img src={homeBg} className="h-16 w-auto rounded-xl mr-6" />
                <p className="text-xl font-semibold overflow-hidden text-ellipsis line-clamp-1">Once Upon A Time In Hollywood</p>
              </div>
              <p className="flex-shrink-0">John Seed</p>
            </a>
            <Link to={"/explore/new"} className="w-full mb-4 px-6 py-3 text-center bg-gradient rounded-xl hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out font-semibold">
              See More
            </Link>
          </div>

        </div>

      </div>
    </>
  )
}

export default Explore
