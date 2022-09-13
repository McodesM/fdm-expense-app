import React, { useState } from "react";
import Link from "next/link";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore"; 
import { db, storage, auth }from "../lib/firebase";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { uploadBytes } from "firebase/storage";
import { ref } from "firebase/storage";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { type } from "os";



const ExpenseMenu = () => {
    const [ontoggle, setToggle] = useState(false); //For more no reciept section
    const [categoryId, setCategoryId] = useState(-1);
    const [nonAdmin, adminChange] = useState(false);
    const [newAccounttype, setNewacc] = useState("");
    const [admin, setAdmin] = useState(false);
    const [line, setline] = useState(false);
    const [show, setshow] = useState(true);
    const [createshow, setcreateshow] = useState(false);
    
    const [newemail, setnewemail] = useState("");
    const [newpassword, setnewpassword] = useState("");
    const { user } = useContext(UserContext);
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
                
            }
            else{
                if(items.get(user.email) == "A"){
                    setAdmin(true);
                }else{
                    setline(true);
                }
                adminChange(false);       
            }
            
        }
        
    }
    checker();
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("GBP");
    const [category, setCategory] = useState(0);
    const [name, setName] = useState(0);
    const [SortCode, setSortCode] = useState(0);
    const [AccNum, setAccnum] = useState(0);
    const [imageUpload, setImageUpload] = useState("");
    const [desc, setdesc] = useState("");

    // const inputFields: any = [
    //     {
    //         "Travel Company": "WizzAir",
    //         "Ticket Number": "A6",
    //         "Date of Departure": "dd/mm/yy",
    //         "Time of Departure": "hh:mm",
    //         "Reference Number": "XXXXXXXX",
    //     },
    //     {
    //         "Hotel Company": "Marriott",
    //         "Room Number": "11B",
    //         "Check-in date": "dd/mm/yy",
    //         "Check-out date": "dd/mm/yy",
    //         "Reference Number": "XXXXXXXX",
    //     },
    // ];
    const submitter = async (event) =>{
        event.preventDefault();
        console.log(imageUpload);
        const storageRef = ref(storage, `images/${imageUpload.name + user.email}`);
        uploadBytes(storageRef, imageUpload);
        const time = new Date().toLocaleString();
        console.log(imageUpload.name);
        var link = `https://firebasestorage.googleapis.com/v0/b/fdm-expenses-fb590.appspot.com/o/images%2F${(imageUpload.name).replaceAll(" ", "%20")}${(user.email).replace("@", "%40")}?alt=media`;
        await addDoc(collection(db, "Expense Applications"),{
            Email: user.email,
            Amount: amount,
            Time_of_Expense: time,
            Time_of_Appeal: "",
            Appeal: "None",
            Currency: currency,
            Category: category,
            Name: name,
            Sort_Code: SortCode,
            Account_Number: AccNum,
            EvidenceLink: link,
            Type: event.target.name,
            Status: "Pending",
            RejectionStatement: '',
            Statement: "",
            Description: desc
        })
        setdesc("");
        window.location.reload(false);
    }
    
    const createacc = async () =>{
        setshow(false);
        setcreateshow(true);
    }
    
    const register = async () =>{
        const querySnapshot = await getDocs(collection(db, "Account"));
        var items = new Map();
        querySnapshot.forEach((doc) => {
            items.set(doc.data().Email, doc.data().AccountType);
        });

        if(newemail.length > 0 && newpassword.length > 0){
            if(newemail.includes("@fdm.com")){
                if(items.has(newemail)==false){
                    await createUserWithEmailAndPassword(auth, newemail, newpassword);
                    await addDoc(collection(db, "Account"),{
                        Email: newemail,
                        AccountType: newAccounttype
                    });
                }  
            }else{
                alert("Email not ending in @fdm.com");
            }
        }else{
            alert("Email and password fields must be completed");
        }
        setNewacc("");
        setnewemail("");
        setnewpassword(""); 
        setshow(true);
        setcreateshow(false)
    }
    

    return (
        <>
            <div id="addX" className="hero min-h-screen bg-base-200 pb-10">
                <div className="hero-content text-center">
                    <div className="">
                    {nonAdmin ? (<h1 className="my-8 text-4xl font-bold">Add Expense</h1>) : null}
                        {nonAdmin ? (
                            <div className="grid grid-cols-2 gap-10 ">
                            <div className="card w-96 bg-primary text-primary-content">
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title text-2xl">
                                        Small Expense
                                    </h2>
                                    <p>This is for expenses under £250</p>
                                    <form onSubmit={submitter} name = "Small">
                                        <div className="form-control py-1">
                                            <label className="label">
                                                <span className="label-text mb-1">
                                                    Expense
                                                </span>
                                            </label>

                                            <label className="input-group">
                                                <span className="w-32 bg-[#0369a1]">
                                                    Amount
                                                </span>
                                                <input
                                                    type="number"
                                                    onChange={(event) => {setAmount(event.target.value)}}
                                                    max = "249"
                                                    placeholder="0"
                                                    className="input input-bordered w-28 bg-neutral"required></input>
                                                <select onChange={(event) => {setCurrency(event.target.value)}} className="no-arrow w-20 bg-[#0369a1] text-center focus:outline-none"required>
                                                    <option
                                                        value="GBP"
                                                        >
                                                        GBP
                                                    </option>
                                                    <option value="USD">USD</option>
                                                    <option value="EUR">EUR</option>
                                                    <option value="JPY">JPY</option>
                                                    <option value="AUD">AUD</option>
                                                    <option value="CAD">CAD</option>
                                                    <option value="CNY">CNY</option>
                                                    <option value="INR">INR</option>
                                                    <option value="HKD">HKD</option>
                                                </select>
                                            </label>
                                        </div>

                                        <div className="form-control py-1">
                                            <div className="input-group  ">
                                                <select
                                                    id="typeSelect"
                                                    onChange={(event) => {setCategory(event.target.value)}}
                                                    className="select select-bordered w-80 bg-neutral"required>
                                                    <option disabled selected>
                                                        Pick a category
                                                    </option>
                                                    <option>Travel</option>
                                                    <option>Hospitality</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-control py-1">
                                            <label className="label">
                                                <span className="label-text">
                                                    Card Credentials
                                                </span>
                                            </label>

                                            <label className="input-group py-1">
                                                <span className="w-32 bg-[#0369a1]">
                                                    Name
                                                </span>
                                                <input
                                                    type="text"
                                                    onChange={(event) => {setName(event.target.value)}}
                                                    placeholder="John Doe"
                                                    className="w-50  input input-bordered bg-neutral"required></input>
                                            </label>

                                            <label className="input-group py-1">
                                                <span className="w-32 bg-[#0369a1]">
                                                    Sort Code
                                                </span>
                                                <input
                                                    type="text"
                                                    onChange={(event) => {setSortCode(event.target.value)}}
                                                    placeholder="XX-XX-XX"
                                                    className="w-50  input input-bordered bg-neutral"required></input>
                                            </label>

                                            <label className="input-group py-1">
                                                <span className="w-32 bg-[#0369a1]">
                                                    Account No.
                                                </span>
                                                <input
                                                    type="text"
                                                    onChange={(event) => {setAccnum(event.target.value)}}
                                                    placeholder="36829639"
                                                    className="w-50  input input-bordered bg-neutral"required></input>
                                            </label>
                                        </div>
                                        { nonAdmin ? (
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">
                                                        Add Reciept (Compulsory)
                                                    </span>
                                                </label>
                                                <input 
                                                id="file1"
                                                className="btn border-none bg-secondary text-center outline hover:opacity-40 "
                                                type="file" onChange={(event)=>{setImageUpload(event.target.files[0])}}required/>
                                            </div>
                                        )
                                            : (null)}
                                        <div className="card-actions justify-center">
                                            <button
                                                type="submit"
                                                
                                                className=" btn mt-8 mb-2 mb-[-0.3rem]  w-80 rounded-2xl border-2 border-transparent bg-info font-semibold text-white  hover:opacity-40">
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                    
                                    
                                </div>
                            </div>
    
                            <div className="card w-96 bg-[#4c1d95] text-primary-content">
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title text-2xl">
                                        Large Expense
                                    </h2>
                                    <p>This is for expenses over £250</p>
                                    <form onSubmit={submitter} name = "Large">
                                        <div className="form-control py-1">
                                            <label className="label">
                                                <span className="label-text">
                                                    Expense
                                                </span>
                                            </label>

                                            <label className="input-group py-1">
                                                <span className="w-32 bg-secondary">
                                                    Amount
                                                </span>
                                                <input
                                                    type="number"
                                                    placeholder="250"
                                                    min = "250"
                                                    onChange={(event) => {setAmount(event.target.value)}}
                                                    className="input input-bordered w-28 bg-neutral"
                                                    required></input>
                                                <select onChange={(event) => {setCurrency(event.target.value)}} className="no-arrow w-20 bg-secondary text-center focus:outline-none" required>
                                                    <option
                                                        className="">
                                                        GBP
                                                    </option>
                                                    <option>USD</option>
                                                    <option>EUR</option>
                                                    <option>JPY</option>
                                                    <option>AUD</option>
                                                    <option>CAD</option>
                                                    <option>CNY</option>
                                                    <option>INR</option>
                                                    <option>HKD</option>
                                                </select>
                                            </label>
                                        </div>

                                        <div className="form-control ">
                                            <div className="input-group  ">
                                                <select
                                                    defaultValue={categoryId}
                                                    onChange={(event) => {setCategory(event.target.value)}}
                                                    className="select select-bordered w-80 bg-neutral" required>
                                                    <option disabled value={-1}>
                                                        Pick category
                                                    </option>
                                                    <option value="Travel">
                                                        Travel
                                                    </option>
                                                    <option value="Hospitality">
                                                        Hospitality
                                                    </option>
                                                    <option value = "Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <textarea type="text" placeholder="Description" onChange={(event)=>{setdesc(event.target.value)}}
                                            className="w-80 mt-2 input input-bordered bg-neutral"
                                            required></textarea>
                                        </div>

                                        <div className="form-control py-1.5 ">
                                            <label className="label">
                                                <span className="label-text">
                                                    Card Credentials
                                                </span>
                                            </label>

                                            <label className="input-group py-1">
                                                <span className="w-32 bg-secondary">
                                                    Name
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    onChange={(event) => {setName(event.target.value)}}
                                                    className="w-50  input input-bordered bg-neutral"required></input>
                                            </label>

                                            <label className="input-group py-1">
                                                <span className="w-32 bg-secondary ">
                                                    Sort Code
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder="XX-XX-XX"
                                                    onChange={(event) => {setSortCode(event.target.value)}}
                                                    className="w-50 input input-bordered bg-neutral"required></input>
                                            </label>

                                            <label className="input-group py-1">
                                                <span className="w-32 bg-secondary">
                                                    Account No.
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder="36829639"
                                                    onChange={(event) => {setAccnum(event.target.value)}}
                                                    className="w-50 input input-bordered bg-neutral"required></input>
                                            </label>
                                        </div>

                                        { nonAdmin ? (
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">
                                                        Add Reciept (Compulsory)
                                                    </span>
                                                </label>
                                                <input 
                                                id="file"
                                                className="btn border-none bg-secondary text-center outline hover:opacity-40 "
                                                type="file" onChange={(event)=>{setImageUpload(event.target.files[0])}}required/>
                                            </div>
                                        )
                                            : (null)}
                                       
                                        <div className="card-actions justify-center">
                                        <button
                                            type="submit"
                                            className="btn mt-1 mb-[-0.3rem] w-80  rounded-2xl border-2  border-transparent bg-indigo-600 font-semibold  text-white hover:opacity-40">
                                            Submit
                                        </button>
                                    </div>
                                    </form>

                                    
                                </div>
                            </div>
                            {/* First div is needed for flex to work */}
                            <div className="h-1 w-full "></div>
                            {ontoggle && (
                                <ul>
                                    <div className="relative z-50 mt-[-8rem] flex h-[27rem] w-full flex-col items-center bg-accent px-8 pt-3">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    More Information
                                                </span>
                                            </label>

                                            {Object.keys(
                                                inputFields[categoryId]
                                            ).map((field) => (
                                                <label className="input-group py-1">
                                                    <span className="w-32 bg-secondary">
                                                        {field}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        placeholder={
                                                            inputFields[
                                                                categoryId
                                                            ][field]
                                                        }
                                                        className="w-50  input input-bordered bg-neutral"></input>
                                                </label>
                                            ))}
                                        </div>

                                        <div className="card-actions justify-center">
                                            <button
                                                type="submit"
                                                className=" btn mt-8 mb-[-0.3rem] w-80  rounded-2xl border-2  border-transparent bg-indigo-600 font-semibold  text-white hover:opacity-40">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </ul>
                            )}
                        </div>) : null}
                        {line?(
                            <div>
                                <button className="btn btn-primary">
                                    <Link href="/track">Edit Expenses</Link>
                                </button>                              
                            </div>
                        ):(null)}
                        {admin?(
                            <>
                            {show?(
                                <div className="card-actions justify-center">
                                    <button
                                        type="submit"
                                        
                                        onClick={createacc}
                                        className="btn mt-1 mb-[-0.3rem] createaccount w-80  rounded-2xl border-2  border-transparent bg-indigo-600 font-semibold  text-white hover:opacity-40">
                                        Create Account
                                    </button>
                                    
                                </div>
                            ):(null)}
                            {createshow?(
                                <div className="rgBtn">
                                    <input
                                        type="text"
                                        onChange={(event) => {setnewemail(event.target.value)}}
                                        placeholder="Enter new Email"
                                        className="w-50 rgBtn1 input input-bordered bg-neutral"></input>
                                        <input
                                        type="text"
                                        onChange={(event) => {setnewpassword(event.target.value)}}
                                        placeholder="Enter new Password"
                                        className="w-50 rgBtn1 input input-bordered bg-neutral"></input>
                                        <div className="input-group  ">
                                            <select
                                                defaultValue={null}
                                                onChange={(event) => {setNewacc(event.target.value)}}
                                                className="select rgBtn1 select-bordered w-80 bg-neutral">
                                                <option disabled value={-1}>
                                                    Pick Account Type
                                                </option>
                                                <option value="Travel">
                                                    Employee
                                                </option>
                                                <option value="Hospitality">
                                                    Line Manager
                                                </option>
                                                <option value="A">
                                                    Admin
                                                </option>
                                            </select>
                                        </div>
                                    
                                        <button
                                            type="submit"
                                            onClick={register}
                                            className="btn mt-1 mb-[-0.3rem] createaccount w-80  rounded-2xl border-2  border-transparent bg-indigo-600 font-semibold  text-white hover:opacity-40">
                                            Register Account
                                        </button>
                                        
                                        
                                    
                                </div>
                            ):(null)}
                            
                            </>
                            
                        ):(null)}
                        
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExpenseMenu;

// function setToggle(arg0: boolean): void {
//     throw new Error("Function not implemented.");
// }
function render() {
    throw new Error("Function not implemented.");
}

// function handleChange(e: React.ChangeEvent<HTMLSelectElement>): void {
//     throw new Error("Function not implemented.");
// }
