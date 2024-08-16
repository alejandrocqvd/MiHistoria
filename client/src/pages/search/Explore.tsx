/**
 * Explore Page Component
 * 
 * This component renders the explore page a user can use to search for specified stories,
 * or browse existing stories based on queries like top stories, new stories, saved stories.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import api from "../../services/api";
import SearchResult from "../../components/SearchResult";
import { Link } from "react-router-dom";
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

// Explore Page Component
const Explore: React.FC = () => {
  // Boolean indicating if there is an error
  const [error, setError] = useState<boolean>(false);

  // String containing the error message to display
  const [errorMessage, setErrorMessage] = useState<string>("");

  // String containing the user's search input
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Array of objects containing information for search results
  const [data, setData] = useState<SearchData[]>([]);

  // Array of objects containing information for 5 saved stories
  const [savedData, setSavedData] = useState<SearchData[]>([]);

  // Array of objects containing information for top 5 stories of all time
  const [topData, setTopData] = useState<SearchData[]>([]);

  // Array of objects containing information for the newest 5 stories
  const [newData, setNewData] = useState<SearchData[]>([]);

  // useStates for search parameters.
  const [searchStories, setSearchStories] = useState<boolean>(false);

  const [searchUsers, setSearchUsers] = useState<boolean>(false);

  // useStates for identifying if the user has typed something in search bar
  const [searching, setSearching] = useState<boolean>(false);

  // AuthContext to get current user
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext!;

  /**
   * Handles search filter change event.
   * 
   * This function updates the search title according to chosen filters.
   * @returns {string} - The title for the explore page based on the chosen filter.
   */
  const getSearchTitle = () => {
    if (searchStories) return "Search by Story";
    if (searchUsers) return "Search by User";
    return "Search";
  }

  /**
   * Handles changes in the search input field.
   * 
   * This function is used to determine whether or not to show top stories,
   * newest stories, if the user has started searching.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object that contains all information
   * on the change event.
   */
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

  /**
   * Handles searching event.
   * 
   * This function is triggered in handleSearchChange() where when the user is searching, it 
   * will call this function to automatically search without the user needing to press enter.
   */
  const handleSearch = async () => {
    try {
      const apiEndpoint = searchStories ? "/api/searches/story" :
                          searchUsers ? "/api/searches/user" :
                          "/api/searches/all";
      const res = await api.post(apiEndpoint, { searchTerm });
      setData(res.data.data);
    } catch (error) {
      setError(true);
      if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.message);
      else setErrorMessage("An unexpected error occurred.");
    }
  }

  // Redoes the search if the user changes the filter with the same search input
  useEffect(() => {
    if (searching) handleSearch();
  }, [searchStories, searchUsers]);

  // Fetches the top 5 saved, newest, and top of all time stories
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          const savedRes = await api.post("/api/searches/saved/5", {
            withCredentials: true
          });
          setSavedData(savedRes.data.data);
        }

        const topRes = await api.get("/api/searches/top/5");
        setTopData(topRes.data.data);

        const newRes = await api.get("/api/searches/new/5");
        setNewData(newRes.data.data);
      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.message);
        else setErrorMessage("An unexpected error occurred.");
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

          {error && <ErrorDisplay errorMessage={errorMessage}></ErrorDisplay>}

          <div className={ searching ? "flex flex-col justify-center items-center mb-12" : "hidden"}>
            {data.map(searchResult => (
              <SearchResult key={searchResult.username} data={searchResult} />
            ))}
          </div>

          <div className={ searching || !currentUser || savedData.length === 0 ? "hidden" : "flex flex-col justify-center items-center mb-12"}>
            <p className="text-3xl font-semibold mb-8">Saved Stories</p>
            {savedData.map(searchResult => (
              <SearchResult key={searchResult.username} data={searchResult} />
            ))}
            <Link to={"/saved"} className="w-full mb-4 px-6 py-3 bg-gradient rounded-xl text-center hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out font-semibold">
              See More
            </Link>
          </div>
      

          <div className={ searching ? "hidden" : "flex flex-col justify-center items-center mb-12"}>
            <p className="text-3xl font-semibold mb-8">Top Stories</p>
            {topData.map(searchResult => (
              <SearchResult key={searchResult.username} data={searchResult} />
            ))}
            <Link to={"/explore/top"} className="w-full mb-4 px-6 py-3 text-center bg-gradient rounded-xl hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out font-semibold">
              See More
            </Link>
          </div>

          <div className={ searching ? "hidden" : "flex flex-col justify-center items-center mb-12"}>
            <p className="text-3xl font-semibold mb-8">New Stories</p>
            {newData.map(searchResult => (
              <SearchResult key={searchResult.username} data={searchResult} />
            ))}
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
