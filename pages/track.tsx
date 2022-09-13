import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import TrackComponent from "../components/track-component";
import { useContext, useEffect } from "react";
import { UserContext } from "../lib/context";
import LoginContent from "../components/login-content";

const Track = () => {
    const { user } = useContext(UserContext);

    return (
        <>
        {!user && (
            <>
            <LoginContent></LoginContent>

            <Footer></Footer>
        </>
        )}

        {user && (
            <>
            <Navbar></Navbar>

            <TrackComponent></TrackComponent>

            <Footer></Footer>
            </>
        )}
        </>
    );
};

export default Track;
