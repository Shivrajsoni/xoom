"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const api_key = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const api_secret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async() =>{
    const user = await currentUser();

    if(!user) throw new Error('User Not Logged In');
    if(!api_key) throw new Error(' Api Key is Not Provided');
    if(!api_secret) throw new Error('Api Secret is Not Present');

    const client = new StreamClient(api_key,api_secret);
    const exp = Math.round(new Date().getTime()/1000) + 60 * 60;
    const issued = Math.floor(Date.now()/1000) - 60;
    
    const token = client.createToken(user.id, exp, issued);
    return token;
}