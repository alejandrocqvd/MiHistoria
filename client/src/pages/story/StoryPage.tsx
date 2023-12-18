import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as solidHeart, faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart, faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';

const StoryPage = () => {
  // States and functions for liking and saving the story
  const [liked, setLiked] = useState<Boolean>(false)
  const [saved, setSaved] = useState<Boolean>(false)

  const handleLike = () => {
    setLiked(!liked)
  }
  const handleSave = () => {
    setSaved(!saved)
  }

  return (
    <div className='flex flex-col justify-start items-center'>

        <div className='flex flex-row justify-center items-center mb-6'>
          <button onClick={handleLike} className={`w-28 shadow-md text-center rounded-xl bg-secondary px-4 py-2 ${ liked ? 'text-red-600' : null}`}>
            <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} className='mr-1' /> 24k
          </button>
          <button onClick={handleSave} className={`w-28 shadow-md ml-4 text-center rounded-xl bg-secondary px-4 py-2 ${ saved ? 'text-amber-500' : null}`}>
            <FontAwesomeIcon icon={saved ? solidBookmark : regularBookmark} className='mr-1' /> 6k
          </button>
          <button className='w-28 shadow-md ml-4 text-center rounded-xl bg-gradient font-bold px-4 py-2'>Edit</button>
          <button className='w-32 shadow-md ml-4 text-center rounded-xl bg-error font-bold px-4 py-2 hover:bg-[#9A0E2A]'>Delete Story</button>
        </div>

        <div className='flex flex-row justify-between items-start w-full mb-6'>
            <div className='flex flex-row justify-between items-start'>
                <button className='bg-secondary p-2 rounded-xl shadow-md mr-2 w-32'>Previous Page</button>
                <button className='bg-secondary p-2 rounded-xl shadow-md mr-2 w-32'>Next Page</button>
            </div>
            <div className='flex flex-row justify-between items-center bg-secondary p-2 rounded-xl shadow-md mr-2 w-32 px-4'>
                <h1>Page:</h1>
                <select className='bg-secondary'>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                </select>
            </div>
        </div>

        <p>
            <strong>Early Life and Education</strong><br></br>
            I was born in 1904 in New York City. My fascination with science began at a young age, 
            influenced by a vibrant, intellectual environment at home. I pursued physics with a passion 
            that eventually took me to Harvard and then to Cambridge and Göttingen for further studies.
        </p>
        <p>
            My work in theoretical physics garnered attention, and I found myself immersed in the 
            burgeoning field of quantum mechanics. <a href='https://www.nobelprize.org/prizes/physics/'>Nobel Prize</a> 
            laureates were among my peers and mentors. This period was a formative time in my life, 
            shaping my scientific pursuits.
        </p>
        <h2>The Manhattan Project</h2>
        <p>
            The year 1942 marked a turning point when I was appointed as the scientific director of the 
            <em>Manhattan Project</em>. The goal was daunting: to develop an atomic bomb during the 
            height of World War II. Our work was centered in a secret laboratory in Los Alamos, New Mexico.
        </p>
        <p>
            The moral and ethical implications of our work weighed heavily on my conscience. 
            The success of the project, while a remarkable scientific feat, presented the world with 
            a formidable and sobering power. In 1945, the atomic bombs were dropped on Hiroshima 
            and Nagasaki, bringing an end to the war but at an immense human cost.
        </p>
        <h2>Later Years and Reflections</h2>
        <p>
            In the post-war years, I found myself at a crossroads, advocating for international control 
            of atomic energy and striving to promote peaceful uses of nuclear technology. 
            My political affiliations and stance on nuclear disarmament, however, led to a 
            controversial and public <a href='https://www.atomicheritage.org/history/oppenheimer-security-hearing'>security hearing</a> 
            in 1954, dramatically altering the course of my career.
        </p>
        <p>
            As I reflect on my journey, I am struck by the profound ways in which the pursuit of knowledge 
            can intersect with the complexities of ethics, politics, and human destiny. 
            The words from the <a href='https://www.bhagavadgita.org.in/'>Bhagavad Gita</a> 
            resonate deeply with me: 'Now I am become Death, the destroyer of worlds.' 
            These words, uttered at the Trinity test site, encapsulate the paradox of scientific 
            advancement and its potential consequences.
        </p>
        <p>
            <em>- J. Robert Oppenheimer</em>
        </p>

        <div className='flex flex-row justify-between items-start w-full my-6'>
            <div className='flex flex-row justify-between items-start'>
                <button className='bg-secondary p-2 rounded-xl shadow-md mr-2 w-32'>Previous Page</button>
                <button className='bg-secondary p-2 rounded-xl shadow-md mr-2 w-32'>Next Page</button>
            </div>
            <div className='flex flex-row justify-between items-center bg-secondary p-2 rounded-xl shadow-md mr-2 w-32 px-4'>
                <h1>Page:</h1>
                <select className='bg-secondary'>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                </select>
            </div>
        </div>

        <div className='flex flex-row justify-center items-center mb-10'>
            <button onClick={handleLike} className={`w-28 shadow-md text-center rounded-xl bg-secondary px-4 py-2 ${ liked ? 'text-red-600' : null}`}>
            <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} className='mr-1' /> 24k
            </button>
            <button onClick={handleSave} className={`w-28 shadow-md ml-4 text-center rounded-xl bg-secondary px-4 py-2 ${ saved ? 'text-amber-500' : null}`}>
            <FontAwesomeIcon icon={saved ? solidBookmark : regularBookmark} className='mr-1' /> 6k
            </button>
            <button className='w-28 shadow-md ml-4 text-center rounded-xl bg-gradient font-bold px-4 py-2'>Edit</button>
        </div>

    </div>
  )
}

export default StoryPage
