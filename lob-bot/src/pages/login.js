import Navbar from "@/Components/Navbar/Navbar";
import Head from "next/head";
import { useState } from "react";
import { createClient } from '@supabase/supabase-js';
import toast,{Toaster} from 'react-hot-toast'
export default function Login(){
    const [code,setCode] = useState('');
    const [email,setEmail] = useState('');

    const superbase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    async function sendCode(){
    
        console.log('email entered is:'+ email)
        const {data,error} = await superbase.auth.signInWithOtp({
            email:email,
        });
        if(data.user){
            console.log('Verification Code Sent ');
            toast.success('Verification code sent.Check your email!')
        }
        if(error){
            console.log('Filed to send verification code' );
            toast.error('Failed to send verification code')
        }
    }

    async function submitCode(){
        const {data ,error} = await superbase.auth.verifyOtp({
            email:email,
            token:code,
            type:'magiclink'
        });
        if (data.user){
            console.log('Signed In Successfully',data)
            toast.error('Signed in Successfully ')
        }
        if(error){
            console.log('Filed to sign in',error)
            const {data:d2 ,error:e2} = await superbase.auth.verifyOtp({
                email:email,
                token:code,
                type:'signup'
            });
            if(d2.user){
                console.log('Signed up Successfully')
            }
            if(e2){
                console.log('Filed to sign up',e2)
            }
        }
    }

    return (
        <>
        <Head>
            Welcome to Language Lounge . Master languages through real conversations.
        </Head>
        <div className="flex flex-col h-screen">
            <Navbar/>
            <div className="mx-auto max-w-md">
                <div className="border m-4 p-4 w-full">
                    <h1 className="text-center ">Log In</h1>
                    <div className="flex flex-col">
                        <label> Email</label>
                        <input 
                        type="email"
                        className="border rounded "
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)} 
                         />
                        <button 
                        className="bg-blue-600 rounded-md m-1  p-1 w-1/2 mx-auto text-white"
                        onClick={sendCode}
                        >Send Code</button>
                        <label>Verification Code</label>
                        <input type="password" 
                        className="border rounded "
                        placeholder="Verification Code"
                        value={code}
                        onChange={(e)=>setCode(e.target.value)}
                        />
                        <button className="bg-blue-600 rounded-md m-1 p-1 w-1/2 mx-auto text-white"
                        onClick={submitCode}
                        >Verify Code</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}