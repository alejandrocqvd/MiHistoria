import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const [passwordHidden1, setPasswordHidden1] = useState<boolean>(true);
  const [passwordHidden2, setPasswordHidden2] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  return (
    <>
    <div className="flex justify-center items-center w-screen h-screen bg-img-login">

      <div className="flex flex-col justify-center item-center px-24 py-16 bg-black bg-opacity-25 backdrop-blur-lg rounded-2xl">

        <h1 className="text-4xl text-center font-bold mb-12">Register</h1>

        <form className="w-80">

            <div className="flex flex-row w-full pb-4">
              <input className="w-full py-2 px-4 rounded-2xl mr-2" type="text" placeholder="First Name"></input>
              <input className="w-full py-2 px-4 rounded-2xl ml-2" type="text" placeholder="Last Name"></input>
            </div>

            <div className="pb-4 relative">
              <input className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl" type="text" placeholder="Username" required></input>
              <FontAwesomeIcon className="absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm" icon={faUser} />
            </div>

            <div className="pb-4 relative">
                <input className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl" type="email" placeholder="Email" required></input>
                <FontAwesomeIcon className="absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm" icon={faEnvelope} />
              </div>

            <div className="w-full pb-4">
              <input className="w-full py-2 px-4 rounded-2xl" type="date" placeholder="Date of Birth"></input>
            </div>

            <div className="pb-4 relative">
              <input className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl" type={passwordHidden1 ? "password" : "text"} placeholder="Password" required></input>
              <button className="absolute inset-y-0 right-0 px-5 pb-4 flex items-center text-sm" type="button" onClick={() => setPasswordHidden1(passwordHidden1 => !passwordHidden1)}>
                {passwordHidden1 ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
              </button>           
            </div>

            <div className="pb-4 relative">
              <input className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl" type={passwordHidden2 ? "password" : "text"} placeholder="Confirm Password" required></input>
              <button className="absolute inset-y-0 right-0 px-5 pb-4 flex items-center text-sm" type="button" onClick={() => setPasswordHidden2(passwordHidden2 => !passwordHidden2)}>
                {passwordHidden2 ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
              </button>            
            </div>

            <div className="flex justify-center items-center pt-4 pb-4">
              <button className="flex justify-center items-center h-10 w-24 bg-gradient rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105">Register</button>
            </div>

            <div className="text-center pb-4">
                {error && <p className="text-error">Username is already taken.</p>}
            </div>

            <div className="text-center">
              <p>Already have an account? <a href="./login" className="hover-underline-animation font-bold">Login</a></p>
            </div>

        </form>

      </div>

    </div>
  </>
  )
}

export default Register
