import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  return (
    <>
      <div className="flex justify-center items-center w-screen h-screen bg-img-login">

        <div className="flex flex-col justify-center item-center px-24 py-16 bg-black bg-opacity-25 backdrop-blur-lg rounded-2xl">

          <h1 className="text-4xl text-center font-bold mb-12">Login</h1>

          <form className="w-80">

              <div className="pb-4 relative">
                <input className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl" type="email" placeholder="Email" required></input>
                <FontAwesomeIcon className="absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm" icon={faEnvelope} />
              </div>

              <div className="pb-4 relative">
                <input className="w-full py-2 px-4 pl-3 pr-10 rounded-2xl" type={passwordHidden ? "password" : "text"} placeholder="Password" required></input>
                <button className="absolute inset-y-0 right-0 px-5 pb-4 flex items-center text-sm" type="button" onClick={() => setPasswordHidden(passwordHidden => !passwordHidden)}>
                  {passwordHidden ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                </button>
              </div>

              <div className="flex justify-center items-center pt-4 pb-4">
                <button className="flex justify-center items-center h-10 w-24 bg-gradient rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105">Login</button>
              </div>

              <div className="text-center pb-4">
                {error && <p className="text-error">Incorrect email or password. Please try again.</p>}
              </div>

              <div className="text-center">
                <p>Don"t have an account? <a href="./register" className="hover-underline-animation font-bold">Register</a></p>
              </div>

          </form>

        </div>

      </div>
    </>
  )
}

export default Login
