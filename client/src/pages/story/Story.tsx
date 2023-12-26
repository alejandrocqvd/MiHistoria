import storyBg from "../../assets/login-bg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Outlet } from "react-router-dom";
import Comment from "../../components/Comment.tsx";

const Story = () => {
  const dummyComments = [
    {
      comment_id: "1",
      text: "This is the first comment.",
      timestamp: "2021-12-17T12:00:00Z",
      author: {
        username: "user1",
        first_name: "John",
        last_name: "Doe"
      }
    },
    {
      comment_id: "2",
      text: "This is the second comment.",
      timestamp: "2021-12-18T13:00:00Z",
      author: {
        username: "user2",
        first_name: "Jane",
        last_name: "Doe"
      }
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center mt-20 w-9/12">

      <div className="flex flex-col h-auto w-full md:w-1/2">

        <p className="text-5xl text-center font-bold my-12">Once Upon a Time in Hollywood</p>
        <img src={storyBg} className="h-72 w-full rounded-xl mb-6" />

        <p className="text-3xl text-center font-bold mb-6">By Username</p>
        <div className="flex-1 flex flex-row justify-center items-center rounded-xl mb-8">
          <img src={storyBg} className="h-12 rounded-xl w-12" />
          <p className="text-xl ml-8 font-semibold">First Name Last Name</p>
          <p className="text-xl ml-8 font-normal">65 Years Old</p>
        </div>
        
      </div>

      <div className="justify-items-center h-auto w-full md:w-1/2 rounded-xl">
        <Outlet />
      </div>

      <div className="flex flex-col justify-center items center w-full md:w-1/2 mb-6">
        <p className="text-2xl font-semibold mb-6">Comments</p>
        <div className="pb-4 relative mb-4">
          <input className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl bg-tertiary" type="textarea" placeholder="Comment..." required></input>
          <button className="absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm">
            <FontAwesomeIcon className="absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm" icon={faPaperPlane} />
          </button>
        </div>

        {dummyComments.map(comment => (
          <Comment key={comment.comment_id} commentData={comment} />
        ))}

      </div>

    </div>
  )
}

export default Story
