import React from "react";
import Header from "./Header";
import { useState, useRef } from "react";
import checkValidData from "../utils/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firabase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/redux/userSlice";
import { backgroundImage_URL } from "../utils/constants";
import { profileImage_URL } from "../utils/constants";

const Login = () => {
  const dispatch = useDispatch();
  const [isSignIn, setIsSignIn] = useState(true);
  const [errorMessage, setErrorMessage] = useState();

  let myName = useRef(null);
  let email = useRef(null);
  let password = useRef(null);

  const toggleSignIn = () => {
    setIsSignIn(!isSignIn);
  };

  const handleFormValidation = () => {
    let message = checkValidData(email.current.value, password.current.value);
    setErrorMessage(message);

    if (message) return null;

    if (!isSignIn) {
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;

          updateProfile(user, {
            displayName: myName.current.value,
            photoURL: profileImage_URL,
          })
            .then(() => {
              // Profile updated!
              const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayName: displayName,
                  photoURL: photoURL,
                })
              );
            })
            .catch((error) => {});
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          setErrorMessage(errorCode + "-" + errorMessage);
        });
    } else {
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Login
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    }
  };

  return (
    <div>
      <Header />
      <div className="absolute">
        <img src={backgroundImage_URL} alt="logo" />
      </div>

      <form
        className="absolute w-[28%] p-12 mx-auto my-32 right-0 left-0 bg-black text-white bg-opacity-80 rounded-xl"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 className="font-bold text-3xl py-4">
          {isSignIn ? "Sign In" : "Sign Up"}
        </h1>

        {!isSignIn && (
          <input
            ref={myName}
            type="text"
            placeholder="Enter name"
            className="p-4 my-4 w-full bg-[#333333] outline-none rounded-md"
          />
        )}
        <input
          ref={email}
          type="text"
          placeholder="Email address"
          className="p-4 my-4 w-full bg-[#333333] outline-none rounded-md"
        />
        <input
          ref={password}
          type="password"
          placeholder="password"
          className="p-4 my-4 w-full bg-[#333333] outline-none rounded-md"
        />
        <p className="text-red-600 font-medium">{errorMessage}</p>
        <button
          className="p-4 my-6 bg-red-600 w-full rounded-md"
          onClick={handleFormValidation}
        >
          {isSignIn ? "Sign in" : "Sign Up "}
        </button>
        <p className="py-4 cursor-pointer" onClick={toggleSignIn}>
          {isSignIn
            ? "New to Netflix? Sign Up now"
            : "Already registered? Sign in now"}
        </p>
      </form>
    </div>
  );
};

export default Login;