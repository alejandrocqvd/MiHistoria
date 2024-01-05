import { useEffect, useState } from "react"
import axios from "axios";

interface commentData {
    comment_id: string;
    text: string;
    timestamp: string;
    username: string;
    first_name: string;
    last_name: string;
    image: string;
}

interface CommentProps {
    commentData: commentData;
}

const Comment: React.FC<CommentProps> = ({ commentData }) => {
  // State variables:
  // - error: Boolean indicating if there is an error.
  const [error, setError] = useState<boolean>(false);

  // - errorMessage: String containing the error message to display.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // - isDeletable: Boolean indicating if the current user has deletion privileges.
  const [isDeletable, setIsDeletable] = useState<boolean>(false);

  // - isDeleted: Boolean indicating if the comment has been deleted.
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  // Retrieve the user item from session storage and parse it if it's a valid JSON string.
  const storedUser = sessionStorage.getItem('user');
  const sessionUsername = storedUser && storedUser !== "null" ? JSON.parse(storedUser).user_info.username : null;

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete your comment?");

    if (isConfirmed) {
      try {
        await axios.delete("/api/comments/delete", {
          data: { comment_id: commentData.comment_id, comment_username: commentData.username },
          withCredentials: true
        });
        setIsDeleted(true);
      } catch (error) {
        setError(true);
        setErrorMessage("Failed to delete comment.");
        console.log(error);
      }
    }
  }

  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", { 
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  const formattedDate = formatTimestamp(commentData.timestamp);

  useEffect(() => {
    if (commentData.username === sessionUsername) setIsDeletable(true);
  }, []);

  return (
    <div className={isDeleted ? "hidden" : "flex flex-col justify-items-center bg-secondary rounded-xl p-4 mb-2"}>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row justify-start items-center mb-2">
              <img src={`/public/uploads/${commentData.image}`} className={commentData.image !== null ? "h-8 rounded-xl w-8 object-cover mr-3" : "hidden"} />
              <a href={`/story/${commentData.username}/page/1`} className="text-md md:text-lg font-semibold ml-1">{commentData.username}</a>
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
