import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import storyBg from "../../assets/login-bg.png";

const SavedStory = () => {
// State variables:
  // - saved
  const [saved, setSaved] = useState<Boolean>(false);

  const handleSave = () => {
    setSaved(!saved);
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-auto p-8 bg-secondary shadow-xl rounded-xl">
        <div className="flex flex-row justify-between items-center overflow-hidden w-full">
        <img src={storyBg} className="h-20 flex-shrink-0 rounded-xl" />
        <a href={"./story/1/page/1"} className="text-3xl text-center font-bold overflow-hidden text-ellipsis line-clamp-1">Title</a>
        <button onClick={handleSave} className={`w-12 shadow-md justify-items-center text-center rounded-xl bg-gradient pl-3 pr-2 py-2 hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out ${ saved ? "text-amber-500" : null}`}>
            <FontAwesomeIcon icon={saved ? solidBookmark : regularBookmark} className="mr-1" />
        </button>
        </div>
    </div>
  )
}

export default SavedStory;
