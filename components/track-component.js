import React, { useState, useEffect } from "react";
import Firebase from "firebase/app";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    setDoc,
    query,
    where,
    updateDoc,
} from "firebase/firestore";
import { db, storage } from "../lib/firebase";
import { uploadBytes } from "firebase/storage";
import { ref } from "firebase/storage";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { type } from "os";
import Popup from "reactjs-popup";
import { async } from "@firebase/util";

const TrackComponent = () => {
    const [appStat, setAppStat] = useState([]);
    const { user } = useContext(UserContext);

    const [nonAdmin, adminChange] = useState(false);
    const [type, SetType] = useState("");
    const [statement, setStatement] = useState("");
    const [amount, setAmount] = useState("");
    const [desc, setDesc] = useState("");
    const [currency, setCurrency] = useState("GBP");
    const [category, setCategory] = useState(0);
    const [name, setName] = useState(0);
    const [SortCode, setSortCode] = useState(0);
    const [AccNum, setAccnum] = useState(0);
    const [imageUpload, setImageUpload] = useState("");
    const checker = async () => {
        const querySnapshot = await getDocs(collection(db, "Account"));
        var items = new Map();

        querySnapshot.forEach((doc) => {
            items.set(doc.data().Email, doc.data().AccountType);
        });

        if (items.has(user.email)) {
            if (items.get(user.email) == "E") {
                adminChange(false);
                SetType(items.get(user.email));
            } else if (items.get(user.email) == "L") {
                adminChange(true);
                SetType(items.get(user.email));
            } else {
                adminChange(true);
                SetType(items.get(user.email));
            }
        }
    };

    checker();

    useEffect(() => {
        const checker = async () => {
            try {
                const collec1 = query(
                    collection(db, "Expense Applications"),
                    where("Email", "==", user.email)
                );
                const collec = query(
                    collec1,
                    where("Status", "in", ["Pending", "Pending - Appealed"])
                );
                const data = await getDocs(collec);
                setAppStat(data.docs.map((doc) => ({ ...doc.data() })));
            } catch (error) {
                null;
            }
        };

        const checkerLM = async () => {
            //if non admin code called if
            try {
                const collec = query(
                    collection(db, "Expense Applications"),
                    where("Status", "in", ["Pending", "Pending - Appealed"])
                );
                const data = await getDocs(collec);
                setAppStat(
                    data.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                );
            } catch (error) {
                null;
            }
        };

        if (nonAdmin == false) {
            checkerLM();
        } else {
            checker();
        }
    }, []);

    const items = appStat;

    const acceptApp = async (event) => {
        await updateDoc(doc(db, "Expense Applications", event.target.id), {
            Status: "Accepted",
        });
        window.location.reload(false);
    };

    const rejectApp = async (event) => {
        await updateDoc(doc(db, "Expense Applications", event.target.id), {
            Status: "Rejected",
        });
        window.location.reload(false);
    };

    const rejectStatement = async (event) => {
        await updateDoc(doc(db, "Expense Applications", event.target.id), {
            Status: "Rejected",
            RejectionStatement: statement,
        });
        window.location.reload(false);
    };

    const submitter = async (event) => {
        if (imageUpload != "") {
            const storageRef = ref(
                storage,
                `images/${imageUpload.name + user.email}`
            );
            uploadBytes(storageRef, imageUpload).then(() => {
                null;
            });
            var link = `https://firebasestorage.googleapis.com/v0/b/fdm-expenses-fb590.appspot.com/o/images%2F${imageUpload.name.replaceAll(
                " ",
                "%20"
            )}${user.email.replace("@", "%40")}?alt=media`;

            await updateDoc(doc(db, "Expense Applications", event.target.id), {
                EvidenceLink: link,
            });
        }
        if (amount != "") {
            await updateDoc(doc(db, "Expense Applications", event.target.id), {
                Amount: amount,
            });
        }
        if (desc != "") {
            await updateDoc(doc(db, "Expense Applications", event.target.id), {
                Description: desc,
            });
        }
        if (currency != "") {
            await updateDoc(doc(db, "Expense Applications", event.target.id), {
                Currency: currency,
            });
        }
        if (category != "") {
            await updateDoc(doc(db, "Expense Applications", event.target.id), {
                Category: category,
            });
        }
        if (name != "") {
            await updateDoc(doc(db, "Expense Applications", event.target.id), {
                Name: name,
            });
        }
        if (SortCode != "") {
            await updateDoc(doc(db, "Expense Applications", event.target.id), {
                Sort_Code: SortCode,
            });
        }
        if (AccNum != "") {
            await updateDoc(doc(db, "Expense Applications", event.target.id), {
                Account_Number: AccNum,
            });
        }
        if (imageUpload != "") {
            await updateDoc(doc(db, "Expense Applications", event.target.id), {
                EvidenceLink: link,
            });
        }
        window.location.reload(false);
    };

    return (
        <>
            <div className="history flex min-h-[70vh] flex-col items-center  bg-base-200 md:bg-base-100">
                <h1 className="mt-8 mb-8 text-3xl font-bold md:mt-[6.5rem]">
                    Pending Applications
                </h1>
                {!nonAdmin && type == "E" ? (
                    <div className="h-7/6 card mb-10 w-4/5 rounded-lg bg-neutral shadow-xl">
                        <div className="p-0">
                            <div className="dark-secondary mx-0 grid h-8 w-full grid-cols-4 items-center justify-center px-0 text-center text-sm text-slate-300 md:h-16 md:grid-cols-4 lg:h-10">
                                <p className="text-right md:text-center">
                                    Date
                                </p>
                                <p className="ml-8 md:text-left">Expense</p>
                                <p className="mr-8 md:text-right">Status</p>
                                <p className="text-left md:text-center">Card</p>
                            </div>
                            <div className="App"></div>
                            {/* for each item calls item and index */}
                            {items.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        tabIndex={0}
                                        className="collapse-arrow collapse">
                                        <input
                                            type="checkbox"
                                            className="peer"></input>

                                        <div
                                            className={
                                                "gird-rows-4 collapse-title mx-0 grid h-60 w-full items-center justify-center px-0 text-center text-slate-300 md:h-20 md:grid-cols-4 " +
                                                (index % 2 === 0
                                                    ? "lighter"
                                                    : "darker")
                                            }>
                                            <p className="my-2 text-slate-400 md:my-0">
                                                {item["Time_of_Expense"]}
                                            </p>
                                            <p className="my-2 md:my-0 md:text-left">
                                                {item.Category}
                                            </p>
                                            <p className="my-2 text-slate-400 md:my-0 md:text-right">
                                                {item.Status}
                                            </p>
                                            <p className="ml-30 my-2 md:my-0">
                                                {item.Sort_Code}
                                                <div className="my-4 md:my-0"></div>
                                                {item.Account_Number}
                                            </p>
                                        </div>

                                        <div
                                            className={
                                                "collapse-content mx-0 grid h-60 w-full grid-cols-1 items-center justify-center px-0 text-center text-slate-300 md:h-20 md:grid-cols-5  " +
                                                (index % 2 === 0
                                                    ? "lighter"
                                                    : "darker")
                                            }>
                                            <p className="text-slate-400 ">
                                                Type:{" "}
                                                <span className="capitalize">
                                                    {item.Type}
                                                </span>
                                            </p>
                                            <p className="md:ml-[-1rem]">
                                                Appeal: {item.Appeal}
                                            </p>
                                            <a
                                                href={"#modal-" + index}
                                                className="text-slate-400 hover:underline md:text-left">
                                                Appeal Statement
                                            </a>
                                            <p className="md:ml-[-1rem]">
                                                Amount: {item.Amount}
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                Currency: {item.Currency}
                                            </p>
                                            <p className="md:text-center md:ml-[-1rem]">
                                                <a
                                                href={item.EvidenceLink}
                                                className="cursor-pointer text-sm underline hover:opacity-90 "
                                                target="_blank">
                                                View Attachment
                                            </a>
                                            </p>
                                            
                                        </div>

                                        <div
                                            className="modal"
                                            id={"modal-" + index}>
                                            <div className="modal-box">
                                                <h3 className="text-lg font-bold">
                                                    Appeal Statement
                                                </h3>
                                                <p className="py-4">
                                                    {item.Statement}
                                                </p>
                                                <div className="modal-action">
                                                    <a href="#" className="btn">
                                                        Close
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="dark-primary mx-0 flex h-10 w-full justify-end px-0 text-center text-sm text-slate-300 opacity-90">
                                <div className="btn-group px-20">
                                    <button className="btn">«</button>
                                    <button className="btn">Page 1</button>
                                    <button className="btn">»</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-7/6 card mb-10 w-4/5 rounded-lg bg-neutral shadow-xl">
                        <div className=" p-0">
                            <div className="dark-secondary mx-0 grid h-8 w-full grid-cols-5 items-center justify-center px-0 text-center text-sm text-slate-300">
                                <p className="">Date</p>
                                <p className="text-left">Expense</p>
                                {nonAdmin && type == "L" ? (
                                    <>
                                        <p className="">Response</p>
                                        <p className=""></p>
                                    </>
                                ) : (
                                    <p className="">Edit</p>
                                )}
                                <p className="">Status</p>

                                {nonAdmin && type == "A" ? (
                                    <>
                                        <p className="">Card</p>
                                    </>
                                ) : null}
                            </div>
                            <div className="App"></div>
                            {/* for each item calls item and index */}
                            {items.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        tabIndex={0}
                                        className="collapse-arrow collapse">
                                        <input
                                            type="checkbox"
                                            className="peer"></input>

                                        <div
                                            className={
                                                "collapse-title mx-0 grid h-60 w-full items-center justify-center px-0 text-center text-slate-300 md:h-20 md:grid-cols-5 " +
                                                (index % 2 === 0
                                                    ? "lighter"
                                                    : "darker")
                                            }>
                                            {/* button must return id of item */}
                                            {/* query to change the status */}
                                            <p className="text-slate-400">
                                                {item["Time_of_Expense"]}
                                            </p>
                                            <p className="text-left">
                                                {item.Category}
                                            </p>
                                            {nonAdmin && type == "L" ? (
                                                <>
                                                    <button
                                                        className="btn btn-outline btn-error btn-sm z-10 mx-2 w-32 text-right text-sm normal-case"
                                                        id={item.id}
                                                        //onChange={(event) => {setAppID(event.target.item.id)}}
                                                        onClick={(event) =>
                                                            acceptApp(event)
                                                        }>
                                                        Accept
                                                    </button>
                                                    <Popup
                                                        trigger={
                                                            <button
                                                                className="btn btn-outline btn-error btn-sm z-10 mx-2 w-32 text-left text-sm normal-case"
                                                                id={item.id}
                                                                onClick={(
                                                                    event
                                                                ) =>
                                                                    rejectApp(
                                                                        event
                                                                    )
                                                                }>
                                                                Reject
                                                            </button>
                                                        }
                                                        modal
                                                        nested>
                                                        <body className="m-4 w-[30rem] bg-base-100 p-10 ">
                                                            <h2 className="mb-8 text-center text-3xl font-bold">
                                                                Rejection
                                                                Statement
                                                            </h2>
                                                            <form action="">
                                                                <label className="label">
                                                                    <input
                                                                        type="text"
                                                                        onChange={(
                                                                            event
                                                                        ) => {
                                                                            setStatement(
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            );
                                                                        }}
                                                                        placeholder="Write Rejection Statement here..."
                                                                        className="input input-bordered flex w-full items-end pt-8 pb-32"></input>
                                                                </label>
                                                            </form>
                                                            <div className="flex items-center justify-end">
                                                                <button
                                                                    id={item.id}
                                                                    className="btn mt-8 mr-4"
                                                                    onClick={(
                                                                        event
                                                                    ) =>
                                                                        rejectStatement(
                                                                            event
                                                                        )
                                                                    }>
                                                                    Submit
                                                                </button>
                                                            </div>
                                                        </body>
                                                    </Popup>
                                                </>
                                            ) : (
                                                <>
                                                    <Popup
                                                        trigger={
                                                            <button
                                                                className="btn btn-outline btn-error btn-sm z-10 text-sm normal-case"
                                                                id={item.id}>
                                                                Edit Application
                                                            </button>
                                                        }
                                                        modal
                                                        nested>
                                                        <div className="editApp card w-96 bg-[#4c1d95] text-primary-content">
                                                            <form action="">
                                                                <div className="form-control py-1">
                                                                    <label className="label">
                                                                        <span className="label-text mb-1">
                                                                            Edit
                                                                            Expense
                                                                        </span>
                                                                    </label>

                                                                    <label className="input-group">
                                                                        <span className="w-32 bg-[#0369a1]">
                                                                            Amount
                                                                        </span>
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={
                                                                                item.Amount
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) => {
                                                                                setAmount(
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }}
                                                                            placeholder="10"
                                                                            className="input input-bordered w-28 bg-neutral"></input>
                                                                        <select
                                                                            defaultValue={
                                                                                item.Currency
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) => {
                                                                                setCurrency(
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }}
                                                                            className="no-arrow w-20 bg-[#0369a1] text-center focus:outline-none">
                                                                            <option value="GBP">
                                                                                GBP
                                                                            </option>
                                                                            <option value="USD">
                                                                                USD
                                                                            </option>
                                                                            <option value="EUR">
                                                                                EUR
                                                                            </option>
                                                                            <option value="JPY">
                                                                                JPY
                                                                            </option>
                                                                            <option value="AUD">
                                                                                AUD
                                                                            </option>
                                                                            <option value="CAD">
                                                                                CAD
                                                                            </option>
                                                                            <option value="CNY">
                                                                                CNY
                                                                            </option>
                                                                            <option value="INR">
                                                                                INR
                                                                            </option>
                                                                            <option value="HKD">
                                                                                HKD
                                                                            </option>
                                                                        </select>
                                                                    </label>
                                                                </div>

                                                                <div className="form-control py-1">
                                                                    <div className="input-group  ">
                                                                        <select
                                                                            id="typeSelect"
                                                                            defaultValue={
                                                                                item.Category
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) => {
                                                                                setCategory(
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }}
                                                                            className="select select-bordered w-80 bg-neutral">
                                                                            <option
                                                                                disabled
                                                                                selected>
                                                                                Pick
                                                                                a
                                                                                category
                                                                            </option>
                                                                            <option>
                                                                                Travel
                                                                            </option>
                                                                            <option>
                                                                                Hospitality
                                                                            </option>
                                                                            <option>
                                                                                Other
                                                                            </option>
                                                                        </select>
                                                                    </div>
                                                                </div>

                                                                {item.Type == "Large"?(
                                                                <div>
                                                                    <textarea 
                                                                    defaultValue={item.Description}
                                                                    type="text" placeholder="Description" onChange={(event)=>{setDesc(event.target.value)}}
                                                                    className="w-80 mt-2 input input-bordered bg-neutral"
                                                                    required></textarea>
                                                                </div>
                                                                ):(null)}                                                                

                                                                <div className="form-control py-1">
                                                                    <label className="label">
                                                                        <span className="label-text">
                                                                            Card
                                                                            Credentials
                                                                        </span>
                                                                    </label>

                                                                    <label className="input-group py-1">
                                                                        <span className="w-32 bg-[#0369a1]">
                                                                            Name
                                                                        </span>
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={
                                                                                item.Name
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) => {
                                                                                setName(
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }}
                                                                            placeholder="John Doe"
                                                                            className="w-50  input input-bordered bg-neutral"></input>
                                                                    </label>

                                                                    <label className="input-group py-1">
                                                                        <span className="w-32 bg-[#0369a1]">
                                                                            Sort
                                                                            Code
                                                                        </span>
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={
                                                                                item.Sort_Code
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) => {
                                                                                setSortCode(
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }}
                                                                            placeholder="XX-XX-XX"
                                                                            className="w-50  input input-bordered bg-neutral"></input>
                                                                    </label>

                                                                    <label className="input-group py-1">
                                                                        <span className="w-32 bg-[#0369a1]">
                                                                            Account
                                                                            No.
                                                                        </span>
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={
                                                                                item.Account_Number
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) => {
                                                                                setAccnum(
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }}
                                                                            placeholder="36829639"
                                                                            className="w-50  input input-bordered bg-neutral"></input>
                                                                    </label>
                                                                </div>
                                                                {nonAdmin ? (
                                                                    <div className="form-control">
                                                                        <label className="label">
                                                                            <span className="label-text">
                                                                                Add
                                                                                Reciept
                                                                                (Compulsory)
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            id="file1"
                                                                            className="btn border-none bg-secondary text-center outline hover:opacity-40 "
                                                                            type="file"
                                                                            onChange={(
                                                                                event
                                                                            ) => {
                                                                                setImageUpload(
                                                                                    event
                                                                                        .target
                                                                                        .files[0]
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ) : null}
                                                            </form>
                                                            <div className="card-actions justify-center">
                                                                <button
                                                                    type="submit"
                                                                    name="Large"
                                                                    id={item.id}
                                                                    onClick={
                                                                        submitter
                                                                    }
                                                                    className="btn mt-1 mb-[-0.3rem] w-80  rounded-2xl border-2  border-transparent bg-indigo-600 font-semibold  text-white hover:opacity-40">
                                                                    Submit
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </Popup>
                                                </>
                                            )}

                                            <p className="text-center text-slate-400">
                                                {item.Status}
                                            </p>
                                            {nonAdmin && type == "A" ? (
                                                <>
                                                    <p className="ml-30">
                                                        {item.Sort_Code}
                                                        <br />
                                                        {item.Account_Number}
                                                    </p>
                                                </>
                                            ) : null}
                                        </div>

                                        <div
                                            className={
                                                "collapse-content mx-0 grid h-24 w-full grid-cols-5 items-center justify-center px-0 text-center text-slate-300 " +
                                                (index % 2 === 0
                                                    ? "lighter"
                                                    : "darker")
                                            }>
                                            <p className="pl-20 text-slate-400">
                                                Type:{" "}
                                                <span className="capitalize">
                                                    {item.Type}
                                                </span>
                                            </p>
                                            <p className="ml-[-1rem]">
                                                Appeal: {item.Appeal}
                                            </p>
                                            <a
                                                href={"#modal-" + index}
                                                className="text-left text-slate-400 hover:underline">
                                                Appeal Statement
                                            </a>
                                            {item.Type == "Large"?(
                                            <a
                                                href={"#modal1-" + index}
                                                className="text-slate-400 hover:underline md:text-left">
                                                Description
                                            </a>
                                            ):(null)}
                                            
                                            <p className="md:ml-[-10rem]">
                                                Amount: {item.Amount}
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                Currency: {item.Currency}
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <a
                                                href={item.EvidenceLink}
                                                className="cursor-pointer text-sm underline hover:opacity-90 "
                                                target="_blank">
                                                View Attachment
                                            </a>
                                            </p>
                                        </div>
                                        <div
                                            className="modal"
                                            id={"modal-" + index}>
                                            <div className="modal-box">
                                                <h3 className="text-lg font-bold">
                                                    Appeal Statement
                                                </h3>
                                                <p className="py-4">
                                                    {item.Statement}
                                                </p>
                                                <div className="modal-action">
                                                    <a href="#" className="btn">
                                                        Close
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="modal"
                                            id={"modal1-" + index}>
                                            <div className="modal-box">
                                                <h3 className="text-lg font-bold">
                                                    Description
                                                </h3>
                                                <p className="py-4">
                                                    {item.Description}
                                                </p>
                                                <div className="modal-action">
                                                    <a href="#" className="btn">
                                                        Close
                                                    </a>
                                                </div>
                                            </div>
                                        </div> 
                                    </div>
                                );
                            })}

                            <div className="dark-primary mx-0 flex h-10 w-full justify-end px-0 text-center text-sm text-slate-300 opacity-90">
                                <div className="btn-group px-20">
                                    <button className="btn">«</button>
                                    <button className="btn">Page 1</button>
                                    <button className="btn">»</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TrackComponent;
