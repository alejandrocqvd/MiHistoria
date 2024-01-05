import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faHeart as solidHeart, faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart, faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import Comment from "../../components/Comment.tsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext.tsx";
import ErrorDisplay from "../../components/ErrorDisplay.tsx";

// Interface for holding and managing the story's data.
interface StoryData {
  title: string;
  username: string;
  first_name: string;
  last_name: string;
  dob: string;
  user_image: string;
  story_image: string;
  text: string;
  page_count: string;
  is_private: string;
}

// Interface for holding and managing an individual comment's data.
interface CommentData {
  comment_id: string;
  username: string;
  first_name: string;
  last_name: string;
  text: string;
  timestamp: string;
  image: string;
}

const Story = () => {
  // State variables:
  // - error: Boolean indicating if there is an error.
  const [error, setError] = useState<boolean>(false);

  // - errorMessage: String containing the error message to display.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // - profile: Object containing all the story's data.
  const [story, setStory] = useState<StoryData | null>(null);

  // - exists: Boolean indicating if the user's story exists.
  const [exists, setExists] = useState<boolean>(false);

  // - liked: Boolean indicating if the user has liked the post.
  const [liked, setLiked] = useState<Boolean>(false);

  // - saved: Boolean indicating if the user has saved the post.
  const [saved, setSaved] = useState<Boolean>(false);

  // - pageNumber: Number indicating the current page number.
  const [pageNumber, setPageNumber] = useState<number>(1);

  // - isEditable: Boolean indicating if the current user is allowed to edit the story.
  const [isEditable, setIsEditable] = useState<boolean>(false);

  // - comment: String containing the user's typed comment.
  const [comment, setComment] = useState<string>("");

  // - comments: Array containing comment objects.
  const [comments, setComments] = useState<CommentData[]>([]);

  // - commentError: Boolean indicating if there is an error with comment creation.
  const [commentError, setCommentError] = useState<boolean>(false);

  // - commentErrorMessage: String containing the error message to display.
  const [commentErrorMessage, setCommentErrorMessage] = useState<string>("");
  
  // - currentCommentPage: Number indicating the current index of the comment pages.
  const [currentCommentPage, setCurrentCommentPage] = useState<number>(1);

  // - totalComments: Number indicating the total number of comments loaded in.
  const [totalComments, setTotalComments] = useState<number>(0);

  // useNavigate used to go to edit page.
  const navigate = useNavigate();

  // Use the useParams hook to get URL parameters.
  const params = useParams() as {
    id: string;
    page_number: string;
  };

  // AuthContext to get current user
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext!;

  // Retrieve the user item from session storage and parse it if it's a valid JSON string.
  const storedUser = sessionStorage.getItem('user');
  const sessionUsername = storedUser && storedUser !== "null" ? JSON.parse(storedUser).user_info.username : null;

  // DOCUMENT THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const generatePageNumbers = (pageCount: number): number[] => {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }  

  /**
   * Converts the user's date of birth string to a numerical age.
   * @param dobString - Date of birth as a string.
   * @returns the calculated age of the user.
   */
  const calculateAge = (dobString: string): number => {
    const dob = new Date(dobString);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - dob.getFullYear();
    const monthDifference = currentDate.getMonth() - dob.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < dob.getDate())) age--;

    return age;
  }

  const handleLike = async () => {
    try {
      await axios.post("/api/users/like", {
        data: { liked, story_username: params.id },
        withCredentials: true
      });
      setLiked(!liked);
    } catch (error) {
      setError(true);
      setErrorMessage("Failed to like or unlike story.");
      console.log(error);
    }
  }

  const handleSave = async () => {
    try {
      await axios.post("/api/users/save", {
        data: { saved, story_username: params.id },
        withCredentials: true
      });
      setSaved(!saved);
    } catch (error) {
      setError(true);
      setErrorMessage("Failed to save or unsave story.");
      console.log(error);
    }
  }

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete your story?");

    if (isConfirmed) {
      try {
         await axios.delete("/api/stories/delete", {
          data: { story_username: params.id },
          withCredentials: true
         });
         navigate("/profile");
      } catch (error) {
        setError(true);
        setErrorMessage("Failed to delete story.");
        console.log(error);
      }
    }
  }

  const fetchComments = async (page: number) => {
    try {
      const res = await axios.post("/api/comments/get", {
        story_username: params.id,
        page: page,
        limit: 50
      });
      // Fill the comments array with data from the API request.
      const newComments = res.data.data.map((comment: any) => ({
        comment_id: comment.comment_id,
        username: comment.username,
        first_name: comment.first_name,
        last_name: comment.last_name,
        text: comment.text,
        timestamp: comment.timestamp,
        image: comment.image
      }));
      // Update the state by appending new comments, avoiding duplicates.
      setComments(prevComments => {
        const existingCommentIds = new Set(prevComments.map(c => c.comment_id));
        const filteredNewComments = newComments.filter((comment: { comment_id: string; }) => !existingCommentIds.has(comment.comment_id));
        return [...prevComments, ...filteredNewComments];
      });

    } catch (error) {
      setError(true);
      if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error);
      else setErrorMessage("An unexpected error occurred.");
      console.log(error);
    }
  }

  const handleShowMore = () => {
    const nextPage = currentCommentPage + 1;
    setCurrentCommentPage(nextPage);
  }

  const handleComment = async () => {
    try {
      await axios.post("/api/comments/create", {
        data: { story_username: params.id, text: comment },
        withCredentials: true
      });
      setComment("");
    } catch (error) {
      setError(true);
      setErrorMessage("Failed to create comment.");
      console.log(error);
    }
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }

  const scroll = () => {
    setTimeout(() => {
      const topNav = document.getElementById("TopNav");
      if (topNav) {
        topNav.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  }

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

        setPageNumber(Number.parseInt(page_number));

        // Check if the current user is allowed to edit the story.
        if (sessionUsername == params.id) setIsEditable(true);

        // API Request to get the data of the story.
        const storyRes = await axios.post("/api/stories/story", { username: id });
        
        if (sessionUsername) {
          // API Request to get the stories the current user has liked.
          const likeRes = await axios.get("/api/users/liked", {
            withCredentials: true
          });

          // API Request to get the stories the current user has saved.
          const saveRes = await axios.get("/api/users/saved", {
            withCredentials: true
          });

          // Set the liked status of the story.
          const hasLiked = likeRes.data.data.some((story: { story_username: string; }) => story.story_username === id);
          setLiked(hasLiked);

          // Set the saved status of the story.
          const hasSaved = saveRes.data.data.some(((story: { story_username: string; }) => story.story_username === id));
          setSaved(hasSaved);
        }

        // API Request to get the total number of comments made on the story.
        const countRes = await axios.post("/api/comments/count", { story_username: id });
        setTotalComments(countRes.data.data.count);

        // API Request to get the first page of comments on the story.
        fetchComments(currentCommentPage);
        
        // Check if the response has data for a story.
        if (!exists) {
          if (storyRes.data.data) {
            setStory(storyRes.data.data);
            setExists(true);
          } else {
            setExists(false);
          }
        }

      } catch (error) {
        setError(true);
        if (axios.isAxiosError(error) && error.response) setErrorMessage(error.response.data.error);
        else setErrorMessage("An unexpected error occurred.");
        console.log(error);
      }
    }
    fetchData();
  }, [params, currentCommentPage, comments]);

  return (
    <div className="flex flex-col justify-center items-center mt-20 w-9/12">
      {!exists ? (
        sessionUsername === params.id ? (
          <div className="flex flex-col justify-center items-center h-screen w-full text-center">
            <p className="text-4xl font-bold mb-10">You haven't written a story yet!</p>
            <Link 
              to={"/story/write"} 
              className="w-72 shadow-md ml-4 mb-24 text-center rounded-xl bg-gradient font-bold px-4 py-2 transition duration-200 ease-in-out hover:scale-105"
              >Start Writing Your Story
            </Link>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-screen w-full text-center">
            <p className="text-4xl font-bold mb-24">{params.id} hasn't written a story yet!</p>
          </div>
        )
      ) : (
        <>
          <div className="flex flex-col h-auto w-full md:w-1/2">

            <p className="text-5xl text-center font-bold my-12 rounded-xl">{story?.title}</p>
            <img 
              src={`/public/uploads/${story?.story_image}`} 
              className={story?.story_image ? "max-h-96 w-auto h-auto rounded-xl mb-6 object-contain" : "hidden"} 
            />

            <div className={`flex-col ${story?.is_private && "mb-8"}`}>
              <p className="text-3xl text-center font-bold mb-6">By {story?.username}</p>
              <div className={story?.is_private ? "hidden" : "flex-1 flex flex-row justify-center items-center rounded-xl mb-8"}>
                <img src={`/public/uploads/${story?.user_image}`} className={story?.user_image !== null ? "h-12 rounded-xl w-12 object-cover" : "hidden"} />
                <p className="text-xl ml-8 font-semibold">{story?.first_name + " " + story?.last_name}</p>
                <p className="text-xl ml-8 font-normal">{calculateAge(story?.dob ?? "")} Years Old</p>
              </div>
            </div>

          </div>

          <div id="TopNav" className="flex flex-row justify-center items-center mb-12">
            <button 
              onClick={sessionUsername ? handleLike : () => navigate("/login")} 
              className={`w-28 shadow-md text-center rounded-xl bg-secondary px-4 py-2 transition duration-200 ease-in-out hover:shadow-xl ${liked ? "text-red-600" : null}`}>
              <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
            </button>
            <button 
              onClick={sessionUsername ? handleSave : () => navigate("/login")} 
              className={`w-28 shadow-md ml-4 text-center rounded-xl bg-secondary px-4 py-2 transition duration-200 ease-in-out hover:shadow-xl ${saved ? "text-amber-500" : null}`}>
              <FontAwesomeIcon icon={saved ? solidBookmark : regularBookmark} />
            </button>
            <button 
              onClick={() => navigate("/story/write")}
              className={isEditable ? "w-28 shadow-md ml-4 text-center rounded-xl bg-gradient font-bold px-4 py-2 transition duration-200 ease-in-out hover:shadow-xl" : "hidden"}
              >Edit
            </button>
            <button 
              onClick={handleDelete}
              className={isEditable ? "w-32 shadow-md ml-4 text-center rounded-xl bg-error font-bold px-4 py-2 hover:bg-[#9A0E2A] transition duration-200 ease-in-out hover:shadow-xl" : "hidden"}
              >Delete Story
            </button>
          </div>

          <div className="flex flex-row justify-between items-start w-full md:w-1/2 mb-6">
            <div className="flex flex-row justify-between items-start">
              <button 
                onClick={() => navigate(`/story/${params.id}/page/${pageNumber - 1}`)}
                className={pageNumber == 1 ? "hidden" : "bg-secondary p-2 rounded-xl shadow-md mr-2 w-32 transition duration-200 ease-in-out hover:shadow-xl"}
                >Previous Page
              </button>
              <button 
                onClick={() => navigate(`/story/${params.id}/page/${pageNumber + 1}`)}
                className={pageNumber == Number.parseInt(story?.page_count ?? "") ? "hidden" : "bg-secondary p-2 rounded-xl shadow-md mr-2 w-32 transition duration-200 ease-in-out hover:shadow-xl"}
                >Next Page
              </button>
            </div>
            <div className={story?.page_count == "1" ? "hidden" : "flex flex-row justify-between items-center bg-secondary p-2 rounded-xl shadow-md mr-2 w-32 px-4"}>
              <p>Page:</p>
              {
                story && (
                  <select 
                  className="bg-secondary"  
                    value={pageNumber} 
                    onChange={(e) => navigate(`/story/${params.id}/page/${Number(e.target.value)}`)}>
                    {generatePageNumbers(Number(story.page_count)).map(pageNum => (
                      <option key={pageNum} value={pageNum}>{pageNum}</option>
                    ))}
                  </select>
                )
              }
            </div>
          </div>

          {error && <ErrorDisplay errorMessage={errorMessage}></ErrorDisplay>}
          
          <div className="justify-items-center h-auto w-full md:w-1/2 rounded-xl">
            <Outlet />
          </div>

          <div className="flex flex-row justify-between items-start w-full md:w-1/2 mt-6 mb-12">
            <div className="flex flex-row justify-between items-start">
              <button 
                onClick={() => {
                  navigate(`/story/${params.id}/page/${pageNumber - 1}`);
                  scroll();
                }}
                className={pageNumber == 1 ? "hidden" : "bg-secondary p-2 rounded-xl shadow-md mr-2 w-32 transition duration-200 ease-in-out hover:shadow-xl"}
                >Previous Page
              </button>
              <button 
                onClick={() => {
                  navigate(`/story/${params.id}/page/${pageNumber + 1}`);
                  scroll();
                }}
                className={pageNumber == Number.parseInt(story?.page_count ?? "") ? "hidden" : "bg-secondary p-2 rounded-xl shadow-md mr-2 w-32 transition duration-200 ease-in-out hover:shadow-xl"}
                >Next Page
              </button>
            </div>
            <div className={story?.page_count == "1" ? "hidden" : "flex flex-row justify-between items-center bg-secondary p-2 rounded-xl shadow-md mr-2 w-32 px-4"}>
              <p>Page:</p>
              {
                story && (
                  <select 
                    className="bg-secondary" 
                    value={pageNumber} 
                    onChange={(e) => {
                      navigate(`/story/${params.id}/page/${Number(e.target.value)}`);
                      scroll();
                    }}>
                    {generatePageNumbers(Number(story.page_count)).map(pageNum => (
                      <option key={pageNum} value={pageNum}>{pageNum}</option>
                    ))}
                  </select>
                )
              }
            </div>
          </div>
      
          <div className="flex flex-row justify-center items-center mb-10">
            <button 
              onClick={sessionUsername ? handleLike : () => navigate("/login")} 
              className={`w-28 shadow-md text-center rounded-xl bg-secondary px-4 py-2 transition duration-200 ease-in-out hover:shadow-xl ${liked ? "text-red-600" : null}`}>
              <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
            </button>
            <button 
              onClick={sessionUsername ? handleSave : () => navigate("/login")} 
              className={`w-28 shadow-md ml-4 text-center rounded-xl bg-secondary px-4 py-2 transition duration-200 ease-in-out hover:shadow-xl ${saved ? "text-amber-500" : null}`}>
              <FontAwesomeIcon icon={saved ? solidBookmark : regularBookmark} />
            </button>
            <button 
              onClick={() => navigate("/story/write")}
              className={isEditable ? "w-28 shadow-md ml-4 text-center rounded-xl bg-gradient font-bold px-4 py-2 transition duration-200 ease-in-out hover:shadow-xl" : "hidden"}
              >Edit
            </button>
          </div>

          <div className="flex flex-col justify-center items center w-full md:w-1/2 mb-6">
            <p className="text-2xl font-semibold mb-6">Comments</p>
            <div className="pb-4 relative mb-4">
              <input 
                onChange={handleCommentChange}
                value={comment}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (comment.length > 5000) {
                      setCommentError(true);
                      setCommentErrorMessage("Comment exceeds the limit of 5000 words.");
                    } else {
                      handleComment();
                    }
                  }
                }}
                className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl bg-tertiary" 
                type="textarea" 
                placeholder={currentUser ? "Comment..." : "Must be signed in to comment"} 
                required={!!currentUser} 
                disabled={!currentUser}>
              </input>
              <button 
                onClick={() => {
                  if (comment.length > 5000) {
                    setCommentError(true);
                    setCommentErrorMessage("Comment exceeds the limit of 5000 words.");
                  } else {
                    handleComment();
                  }
                }}
                className="absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm">
                <FontAwesomeIcon 
                  className="absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm" 
                  icon={faPaperPlane} 
                />
              </button>
            </div>
            <div className={commentError ? "w-full justify-items-center text-error mb-8" : "hidden"}>
              <p className="text-center">{commentErrorMessage}</p>
            </div>

            {comments.map(comment => (
              <Comment key={comment.comment_id} commentData={comment} />
            ))}

            {(currentCommentPage * 50) <= totalComments && (
              <button 
                onClick={handleShowMore}
                className="w-full mb-4 px-6 py-3 bg-gradient rounded-xl font-semibold"
                >See More
              </button>
            )}

          </div>
        </>
      )}
    </div>
  )
}

export default Story
