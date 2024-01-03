interface ResultData {
  title: string;
  image: string;
  username: string;
}

interface ResultProps {
  data: ResultData;
}

const SearchResult: React.FC<ResultProps> = ({ data }) => {
  return (
    <a href={`/story/${data.username}/page/1`} className="flex flex-row justify-between items-center h-22 w-full mb-4 px-6 py-3 bg-secondary rounded-xl hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out">
      <div className="flex flex-row justify-center items-center overflow-hidden">
        <img src={`/public/uploads/${data.image}`} className={data.image !== null ? "h-16 w-auto rounded-xl mr-6" : "hidden"} />
        <p className="text-xl font-semibold overflow-hidden text-ellipsis line-clamp-1">{data.title}</p>
      </div>
      <p className="flex-shrink-0">{data.username}</p>
    </a>
  )
}

export default SearchResult;
