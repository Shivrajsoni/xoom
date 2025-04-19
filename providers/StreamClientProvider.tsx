"use client";
import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react";
import { tokenProvider } from "../actions/stream.actions";
import Loader from "@/components/Loader";

const api_key = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({children}:{children:ReactNode}) =>{
    const [videoClient,setVideoClient] = useState<StreamVideoClient>();
    const {user,isLoaded} = useUser();
    useEffect(()=>{
        if(!user || !isLoaded) return;
        if(!api_key) throw new Error(`Api Key Not found`);

        const client = new StreamVideoClient({
            apiKey: api_key,
            user:{
                id:user?.id,
                name:user?.username || user?.id,
                image:user?.imageUrl,
            },
            tokenProvider,
        })
        setVideoClient(client);
    },[user,isLoaded])
    
    if(!videoClient)
      return <Loader/>;

    return (
        <StreamVideo client={videoClient}>
            {children}
        </StreamVideo>
    )
}
export default StreamVideoProvider;