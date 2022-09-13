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

const HistoryComponent = () => {
    const [appStat, setAppStat] = useState([]);
    const [appealStatement, setAppealStatement] = useState("");
    const { user } = useContext(UserContext);

    const AppealClaim = async (event) => {
        const frankDocRef = doc(db, "Expense Applications", event.target.id);
        await updateDoc(frankDocRef, {
            Appeal: "Appealed",
            Statement: appealStatement,
            Time_of_Appeal: new Date().toLocaleString(),
            Status: "Pending - Appealed",
        });
        window.location.reload(false);
    };

    useEffect(() => {
        const checker = async () => {
            try {
                const collec = query(
                    query(
                        collection(db, "Expense Applications"),
                        where("Email", "==", user.email)
                    ),
                    where("Status", "in", ["Accepted", "Rejected"])
                );
                const data = await getDocs(collec);
                setAppStat(
                    data.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                );
            } catch (error) {
                null;
            }
        };

        checker();
    }, []);

    const items = appStat;

    return (
        <>
            <div className="h-min-screen history flex min-h-[70vh] flex-col items-center bg-base-200 md:bg-base-100">
                <h1 className="mt-8 mb-8 text-3xl font-bold md:mt-[6.5rem]">
                    Expense History
                </h1>

                <div className="h-7/6 card mb-10 w-4/5 rounded-lg bg-neutral shadow-xl">
                    <div className=" p-0">
                        <div className="dark-secondary mx-0 grid h-32 w-full grid-cols-4 items-center justify-center px-8 pb-8 text-center text-sm text-slate-300 md:h-16 md:grid-cols-7 md:pb-0 lg:h-10">
                            <p className="">Date</p>
                            <p className="">Expense</p>
                            <p>Appeals</p>
                            <p className="mt-6 md:mt-0">Rejection Statements</p>
                            <p className="">Line Manager</p>
                            <p className="">Status</p>
                            <p className="">Card</p>
                        </div>

                        {items.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    tabIndex={0}
                                    className="collapse-arrow collapse">
                                    <input type="checkbox"></input>

                                    <div
                                        className={
                                            "h-53 first-line: first-letter: collapse-title mx-0 grid w-full items-center justify-center px-8 text-center text-slate-300 md:h-40 md:grid-cols-7 lg:h-20 " +
                                            (index % 2 === 0
                                                ? "lighter"
                                                : "darker")
                                        }>
                                        <p className="my-4 text-slate-400 md:my-0">
                                            {item.Time_of_Expense}
                                        </p>
                                        <p className="">&#163;{item.Amount}</p>

                                        <div className="flex flex-col items-center gap-3 md:ml-24 lg:col-span-2 lg:flex-row">
                                            {item.Status === "Rejected" &&
                                            item.Appeal === "None" ? (
                                                <a
                                                    href={
                                                        "#modal-add-appeal-" +
                                                        index
                                                    }
                                                    className="btn-neutral btn btn-outline btn-error btn-sm z-10 mt-4 w-32 text-sm normal-case lg:mt-0">
                                                    Add Appeal
                                                </a>
                                            ) : (
                                                <p></p>
                                            )}

                                            {item.Status === "Rejected" ? (
                                                <a
                                                    href={
                                                        "#modal-rejection-stmt-" +
                                                        index
                                                    }
                                                    className="btn-neutral btn btn-outline btn-error btn-sm z-10 w-44 text-sm normal-case">
                                                    Rejection Statement
                                                </a>
                                            ) : (
                                                <p></p>
                                            )}
                                        </div>

                                        <p className="">{item.Line_Manager}</p>
                                        <p className="my-[1rem] text-slate-400 md:my-0">
                                            {item.Status}
                                        </p>
                                        <p className="">
                                            {item.Sort_Code}{" "}
                                            {item.Account_Number}
                                        </p>
                                    </div>

                                    <div
                                        className={
                                            "collapse-content mx-0 grid h-60 items-center justify-center px-8 text-center text-slate-300 md:h-24 md:grid-cols-7 " +
                                            (index % 2 === 0
                                                ? "lighter"
                                                : "darker")
                                        }>
                                        <p className="text-slate-400">
                                            <span className="capitalize">
                                                {item.Type}
                                            </span>{" "}
                                            Expense
                                        </p>
                                        <a
                                            href={"#modal-appeal-stmt-" + index}
                                            className=" text-slate-400 hover:cursor-pointer hover:underline md:col-span-3 md:pl-14 md:pr-8  md:text-left">
                                            Appeal Statement
                                        </a>
                                        <p className="">
                                            Appeal: {item.Time_of_Appeal}
                                        </p>
                                        <p className="">
                                            Type: {item.Category}
                                        </p>
                                        <a
                                            href={item.EvidenceLink}
                                            className="cursor-pointer text-sm underline hover:opacity-90"
                                            target="_blank">
                                            View Attachment
                                        </a>
                                    </div>

                                    <div
                                        className="modal"
                                        id={"modal-appeal-stmt-" + index}>
                                        <div className="modal-box">
                                            <h3 className="text-lg font-bold">
                                                Appeal Statement: {item.Appeal}
                                            </h3>
                                            <p className="md:py-4">
                                                {item.statement}
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
                                        id={"modal-rejection-stmt-" + index}>
                                        <div className="modal-box">
                                            <h3 className="text-lg font-bold">
                                                Rejection Statement
                                            </h3>
                                            <p className="py-4">
                                                {item.RejectionStatement}
                                            </p>
                                            <div className="modal-action">
                                                <a href="#" className="btn">
                                                    Close
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="modal "
                                        id={"modal-add-appeal-" + index}>
                                        <div className="modal-box p-10">
                                            <h3 className="mb-6 p-1 text-center text-2xl font-bold">
                                                Create Appeal
                                            </h3>
                                            <p className="ml-2 mb-3">
                                                For Expense Claim:
                                            </p>
                                            <div className="rounded-xl bg-base-300 p-5">
                                                <p className="my-1">
                                                    Amount: {item.Amount}
                                                </p>
                                                <p className="my-1">
                                                    Currency: {item.Currency}
                                                </p>
                                                <p className="my-1">
                                                    Type: {item.Category}
                                                </p>
                                                <p className="my-1">
                                                    Date: {item.Time_of_Expense}
                                                </p>
                                                <p className="my-1">
                                                    Sort Code: {item.Sort_Code}
                                                    <br />
                                                    Account Number:{" "}
                                                    {item.Account_Number}
                                                </p>
                                            </div>
                                            <p className="my-3 ml-2">
                                                Add Appeal Statement:
                                            </p>
                                            <textarea
                                                className="textarea textarea-bordered my-3 h-44 w-full border-2 border-slate-400"
                                                placeholder="Text here..."
                                                onChange={(event) => {
                                                    setAppealStatement(
                                                        event.target.value
                                                    );
                                                }}></textarea>
                                            <div className="flex-rows justofy-center modal-action flex items-center">
                                                <a href="#" className="btn">
                                                    Close
                                                </a>
                                                <a
                                                    type="submit"
                                                    id={item.id}
                                                    onClick={AppealClaim}
                                                    className="btn btn-primary">
                                                    Submit
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="dark-primary mx-0 flex h-10 w-full justify-end px-0 text-center text-sm text-slate-300 opacity-90">
                            <div className="btn-group px-4">
                                <button className="btn">«</button>
                                <button className="btn">Page 1</button>
                                <button className="btn">»</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HistoryComponent;
