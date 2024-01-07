/**
 * Search Result Component
 * 
 * This component renders a search result for the explore page.
 * It contains the story's banner image, the title, and the author's username.
 * The result itself is a link to the corresponding story.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

/**
 * Interface for search result data
 * 
 * @property {string} title - Story's title.
 * @property {string} image - Story's banner image file name.
 * @property {string} username - Story author's username.
 */
interface ResultData {
  title: string;
  image: string;
  username: string;
}

/**
 * Interface for the properties of a search result component
 * 
 * @property {ResultData} data - An object containing the data.
 */
interface ResultProps {
  data: ResultData;
}

// Search Result Component
const SearchResult: React.FC<ResultProps> = ({ data }) => {
  return (
    <a href={`/story/${data.username}/page/1`} className="flex flex-row justify-between items-center h-20 w-full mb-4 px-6 py-3 bg-secondary rounded-xl hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out">
      <div className="flex flex-row h-16 justify-center items-center overflow-hidden">
        <img src={`/public/uploads/${data.image}`} className={data.image !== null ? "hidden md:flex h-14 w-24 object-cover rounded-xl mr-6" : "hidden"} />
        <p className="text-xl font-semibold overflow-hidden text-ellipsis line-clamp-1">{data.title}</p>
      </div>
      <p className="flex-shrink-0 ml-4">{data.username}</p>
    </a>
  )
}

export default SearchResult;
