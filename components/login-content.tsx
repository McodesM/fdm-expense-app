import { auth } from "../lib/firebase";
import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore"; 
import { useContext } from "react";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    getAuth,
  } from "firebase/auth";
import { UserContext } from "../lib/context";


const LoginContent = () => {
    const { user } = useContext(UserContext);
    

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
          const user = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          
          console.log(user);

        } catch (error) {
          console.log(error);
        }
      };
    return (
        <div className="flex h-screen">
            <div className="i z-20 flex w-1/2 items-center justify-around bg-gradient-to-tr from-purple-900 to-primary">
                <div>
                    <h1 className="font-sans text-4xl font-bold text-white">
                        FDM Expenses
                    </h1>
                    <p className="mt-1 text-white">
                        The most popular corporate expense software
                    </p>
                    
                </div>
            </div>
            <div className="bg-base flex w-1/2 flex-col items-center justify-center">
                <div className="bg-base">
                    <h1 className="mb-1 text-3xl font-bold text-[#d4d4d4]">
                        Hello Again
                    </h1>
                    <p className="mb-7 text-lg font-normal text-blue-500">
                        Welcome Back
                    </p>
                    <div className="mb-4 flex items-center rounded-2xl border-2 py-2 px-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                        </svg>
                        <input
                            className="border-none bg-base-100 pl-2 outline-none"
                            type="text"
                            name=""
                            id=""
                            onChange={(event) => {setEmail(event.target.value)}}
                            placeholder="Email Address"
                        />
                    </div>
                    <div className="flex items-center  rounded-2xl border-2 py-2 px-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <input
                            className="border-none bg-base-100 pl-2 outline-none"
                            type="password"
                            name=""
                            id=""
                            onChange={(event) => {setPassword(event.target.value)}}
                            placeholder="Password"
                        />
                    </div>
                    <button
                        
                        onClick={login}
                        className=" btn mt-4 mb-2 block w-full rounded-2xl border-2 border-transparent bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-600 hover:opacity-80">
                        Login
                    </button>
                    
                </div>
              
            </div>
        </div>
    );
};


//function SignInGoogleButton() {
  //  const signInWithGoogle = () => {
    //    console.log("hi");
        // await signInWithPopup(auth, provider);
      //  signInWithPopup(auth, provider)
        //    .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
          //      const credential =
            //        GoogleAuthProvider.credentialFromResult(result);
              //  const token = credential?.accessToken;
                // The signed-in user info.
               // const user = result.user;
                // ...
           // })
           // .catch((error) => {
                // Handle Errors here.
             //   const errorCode = error.code;
              //  const errorMessage = error.message;
                // The email of the user's account used.
               // const email = error.email;
                // The AuthCredential type that was used.
                //const credential =
                 //   GoogleAuthProvider.credentialFromError(error);
                // ...
            //});
    //};

   // return (
     //   <button
       //     onClick={signInWithGoogle}
         //   className="border-1 btn my-4 w-60 border-transparent hover:border-slate-600 ">
           // <FontAwesomeIcon
             //   icon={faGoogle}
               // className="pr-2 text-[0.85rem] text-[#3B81F6]"
           // />
            //log in with google{" "}
        //</button>
    //);
//}

export default LoginContent;
