import React, { useState } from "react";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore"; 
import { db, storage }from "../lib/firebase";
import { uploadBytes } from "firebase/storage";
import { ref } from "firebase/storage";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { type } from "os";
const Showcase = () => {
    const { user, admin } = useContext(UserContext);
    const [nonAdmin, adminChange] = useState(false);
    const checker = async () =>{

        const querySnapshot = await getDocs(collection(db, "Account"));
        var items = new Map();


        querySnapshot.forEach((doc) => {
            items.set(doc.data().Email, doc.data().AccountType);
        });
        //console.log(items);


        //console.log(user.email);
        if(items.has(user.email)){
            //console.log(items.get(user.email));
            if(items.get(user.email) == "E"){
                adminChange(true);
                const admin = nonAdmin;
            }
            else{
                adminChange(false);
                const admin = nonAdmin;
            }
        }

    }
    checker();
    return (
        <>
            {nonAdmin ? (
                <div id="showcase" className="showcase hero h-[36.1rem]">                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-lg">
                        <h1 className="mb-5 text-5xl font-bold">
                            Get Your Money Back
                        </h1>
                        <p className="mb-5">
                            Send expenditure claims directly to your line
                            manager hassle free. Guaranteed support from the FDM
                            Expenses Team.
                        </p>
                        <button className="btn btn-primary">
                            <a href="#addX">Add Expense</a>
                        </button>
                    </div>
                </div>
            </div>
            ) : null}
        </>
    );
};

export default Showcase;
