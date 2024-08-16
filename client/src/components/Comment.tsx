/**
 * Comment Component
 * 
 * This component renders a comment to be displayed on a story. It contains 
 * the user's username, and profile picture if they have one. It also contains the 
 * timestamp of the comment and a button to delete the comment if the user has deletion privileges.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import api from "../services/api"

/**
 * Interface for the comment's data
 * 
 * @property {string} comment_id - Comment's identification number.
 * @property {string} text - Comment's text contents.
 * @property {string} timestamp - Comment's date and time timestamp.
 * @property {string} username - Comment author's username.
 * @property {string} first_name - Comment author's first name.
 * @property {string} last_name - Comment author's last name.
 * @property {string} image - Comment author's profile picture.
 */
interface commentData {
    comment_id: string;
    text: string;
    timestamp: string;
    username: string;
    first_name: string;
    last_name: string;
    image: string;
}

/**
 * Interface for the properties of a comment component
 * 
 * @property {commentData} commentData - An object containing the data.
 */
interface CommentProps {
    commentData: commentData;
}

// Comment Component
const Comment: React.FC<CommentProps> = ({ commentData }) => {
  // Boolean indicating if there is an error
  const [error, setError] = useState<boolean>(false);

  // String containing the error message to display
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Boolean indicating if the current user has deletion privileges
  const [isDeletable, setIsDeletable] = useState<boolean>(false);

  // Boolean indicating if the comment has been deleted
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  // Retrieve the user item from session storage and parse it if it's a valid JSON string
  const storedUser = sessionStorage.getItem('user');
  const sessionUsername = storedUser && storedUser !== "null" ? JSON.parse(storedUser).user_info.username : null;

  /**
   * Handles comment deletion.
   * 
   * Function is triggered when the user clicks on the 'Delete' button on the comment component.
   * The function presents a confirmation window to the user to confirm deletion,
   * if confirmed, the function attempts to delete the comment through an API call.
   */
  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete your comment?");

    if (isConfirmed) {
      try {
        await api.delete("/api/comments/delete", {
          data: { comment_id: commentData.comment_id, comment_username: commentData.username },
          withCredentials: true
        });
        setIsDeleted(true);
      } catch (error) {
        setError(true);
        setErrorMessage("Failed to delete comment.");
      }
    }
  }

  /**
   * Formats a DATETIME timestamp fetched from the backend to an easily read format.
   * 
   * @param {string} timestamp - A date and time timestamp.
   * @returns {string} The timestamp formatted as 'YEAR MONTH DAY'.
   */
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", { 
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  const formattedDate = formatTimestamp(commentData.timestamp);

  // Compares the comment author's username to the current user's username, sets deletable to true if same
  useEffect(() => {
    if (commentData.username === sessionUsername) setIsDeletable(true);
  }, []);

  return (
    <div className={isDeleted ? "hidden" : "flex flex-col justify-items-center bg-secondary rounded-xl p-4 mb-2"}>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row justify-start items-center mb-2">
              <img src={`/public/uploads/${commentData.image}`} className={commentData.image !== null ? "h-8 rounded-xl w-8 object-cover mr-3" : "hidden"} />
              <Link to={`/story/${commentData.username}/page/1`} className="text-md md:text-lg font-semibold ml-1">{commentData.username}</Link>
          </div>
          <div className="flex flex-row justify-end items-center">
              <button 
                onClick={handleDelete}
                className={isDeletable ? "hover-underline-animation font mr-4 font-semibold" : "hidden"}
                >Delete
              </button>
              <p>{formattedDate}</p>
          </div>
        </div>
        <p className="px-2">{error ? errorMessage : commentData.text}</p>
    </div>
  )
}

export default Comment
