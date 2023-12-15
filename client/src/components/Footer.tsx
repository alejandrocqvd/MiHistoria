import { Link } from "react-router-dom"

export const Footer = () => {
  return (
    <>
      <div className='flex flex-col justify-center items-center bottom-0 h-auto w-screen m-0 p-24 bg-secondary'>
        <div className='flex flex-col md:flex-row md:justify-between w-9/12 items-center p-4'>
          <div className='flex flex-col text-center md:text-left'>
            <h1 className='font-bold text-xl'>Discover MiHistoria</h1>
            <p>Explore stuff lol</p>
          </div>
          <div className='flex flex-col text-center md:text-left my-8 md:my-0'>
            <h1 className='font-bold text-xl'>Explore Stories</h1>
            <p>Explore stuff lol</p>
          </div>
          <div className='flex flex-col text-center md:text-left'>
            <h1 className='font-bold text-xl'>Get Inspired</h1>
            <p>Explore stuff lol</p>
          </div>
        </div>
        <hr className='bg-white h-1/2 w-9/12 my-8'></hr>
        <div className='flex flex-col md:flex-row justify-between w-9/12 items-center p-4'>
          <div>
            <Link to='./'><h2 className='text-3xl font-notable font-extrabold mb-8 md:mb-0'>MiHistoria</h2></Link>
          </div>
          <div className='flex flex-grow justify-end items-center font-bold'>
            <Link className='hover-underline-animation' to='./'>About</Link>
            <Link className='hover-underline-animation mx-24' to='./help'>Help</Link>
            <Link className='hover-underline-animation' to='./legal'>Legal</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer
