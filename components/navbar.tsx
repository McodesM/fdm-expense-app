import Link from "next/link";
import { faFileShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { UserContext } from "../lib/context";
import { auth, db } from "../lib/firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const { user } = useContext(UserContext);
    const [nonAdmin, adminChange] = useState(false);
    const [type, SetType] = useState("");
    const checker = async () => {
        const querySnapshot = await getDocs(collection(db, "Account"));
        var items = new Map();

        querySnapshot.forEach((doc) => {
            items.set(doc.data().Email, doc.data().AccountType);
        });
        //console.log(items);

        //console.log(user.email);
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

    return (
        <>
            <div className="navbar relative z-30 my-7 flex h-80 flex-col bg-base-100 px-8 opacity-90 md:fixed md:my-0  md:h-24 md:flex-row">
                <div className="flex-1">
                    <a
                        href="/#showcase"
                        className="btn btn-ghost mb-4 text-3xl normal-case md:mb-0 md:text-xl">
                        FDM Expenses
                    </a>
                </div>
                <div className="h-72  flex-none">
                    {/* User not logged in */}
                    {!user && (
                        <ul className="menu menu-horizontal p-0">
                            <li>
                                <Link href="/login">Login</Link>
                            </li>
                        </ul>
                    )}
                    {/* User logged in */}
                    {user && (
                        <ul className="menu menu-horizontal mt-[-3rem] flex flex-col text-center md:mt-0 md:flex-row">
                            <li className="justify-center"></li>
                            {nonAdmin ? (
                                
                                <li className="justify-center">
                                    {type == "A" ? (
                                        <Link href="/">Create Account</Link>
                                    ) : (null)}
                                    <Link href="/track">Edit Expenses</Link>
                                </li>
                            ) : (
                                <li className="flex flex-col items-center justify-center md:flex-row">
                                    <Link href="/">Home</Link>

                                    <Link href="/#addX">Add Expense</Link>

                                    <Link href="/track">Track Expenses</Link>

                                    <Link href="/history">View History</Link>
                                </li>
                            )}

                            <div className="dropdown-end dropdown md:ml-3">
                                <label
                                    tabIndex={0}
                                    className="avatar btn btn-ghost btn-circle my-2">
                                    <div className=" w-10 rounded-full">
                                        <FontAwesomeIcon
                                            icon={faUserCircle}
                                            className="mt-[0.15rem] text-4xl"
                                        />
                                    </div>
                                </label>

                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow">
                                    <li>
                                        <Link href={`/${user.email}`}>
                                            <a className="justify-between">
                                                Profile
                                                {/* <span className="badge">New</span> */}
                                            </a>
                                        </Link>
                                    </li>
                                    <li>
                                        <a>Settings</a>
                                    </li>
                                    <li>
                                        <SignOutButton></SignOutButton>
                                    </li>
                                </ul>
                            </div>
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

export default Navbar;
