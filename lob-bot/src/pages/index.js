import { useState } from "react";
import {GoogleGenerativeAI} from '@google/generative-ai';
import ReactMarkdown from 'react-markdown'




export default function Home() {
  const [apiKey, setApiKey] = useState('AIzaSyAdgypHPvwOqqRwJgM-Yo5rq_Whzz7GJb4');
const [msgHistory,setMsgHistory] = useState([{role: "model",
content: "Alfred reporting for duty, ready to help you conquer your collaborative goals! 😎 💥 \n"},])
/* console.log('api key:' ,apiKey) */

  const [userMsg ,setUserMsg] = useState('');

  const genAI = new GoogleGenerativeAI(apiKey);
  

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
     });
     
     const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
     };
     
     async function run() {
        const newMessage = {role : "user" ,content: userMsg}
        console.log(newMessage)
        const newMessageHistory = [newMessage] 
        console.log(newMessageHistory)
        setMsgHistory(prevMsgHistory => [...prevMsgHistory,{role : "user" ,content: userMsg}])
        console.log(msgHistory)
        setUserMsg('');
      



      const chatSession = model.startChat({
        generationConfig,
     // safetySettings: Adjust safety settings
     // See https://ai.google.dev/gemini-api/docs/safety-settings
        history: [
          {
            role: "user",
            parts: [
              {text: "You are Alfred ,a friendly ,charismatic and funny assistant who works for Collab ,Collab is a website that allows teams to work together and accomplish a common goal with the help  of various tools .Your job is to capture ,the name of the team  ,the number of participants the project start and end date ,and the problem statement which you will break down into the most effective steps to achieve the best outcome using the information you captured,you responses \n "},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "Alfred reporting for duty, ready to help you conquer your collaborative goals! 😎\n\n**First things first, tell me about your project:**\n\n1. **What's the name of your awesome team?** (We need a catchy name!) \n2. **How many brilliant minds are working on this project?** (More brains, more power!)\n3. **When are we kicking off this adventure?** (Give me a starting date!)\n4. **When's the deadline?** (We need a finish line to sprint towards!)\n5. **What's the big problem we're tackling?** (The challenge that will make this project legendary!)\n\nOnce you give me this information, I'll unleash the magic of collab so we can make this project a smashing success. 💥 \n"},
            ],
          },
        ],
      });
     
     const result = await chatSession.sendMessage(userMsg);
    
     setMsgHistory(prevMsgHistory => [...prevMsgHistory , {role:'model' , content : result.response.text() }
    ])
    
 
    console.log('Button clicked')
  }
 
  return <div className="flex flex-col h-screen ">
    <nav className="shadow px-4 py-2 flex flex-row justify-between items-center">
      <div className="text-xl font-bold ">LabBot</div>
      <div>
        <input
          type="password"
          className="border p-2 rounded"
          placeholder="Paste API Key"
          onChange={e => setApiKey(e.target.value)}
          value={apiKey}
        />
      </div>
    </nav>
    {/* Message History */}
    <div className="flex-1 overflow-y-scroll">
      <div className="w-full max-w-screen-md mx-auto">
        {msgHistory/* .filter((message)=> message.role !== 'model') */
          .map((message,idx) =>(
            <div key={idx} className="my-3">
              <div className="font-bold">{message.role === 'user' ? 'You ' : 'Assistant'}</div>
              <div
              className="text-lg prose"
              >
                <ReactMarkdown>
                {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))
        }
   </div>
    
    </div>
    {/* Message Input Box */}
    <div className="w-full max-w-screen-md mx-auto flex  px-4 pb-4">
      <textarea className="border text-lg rounded-md p-1 flex-1" rows={1}
      value={userMsg}
      onChange={(e )=> setUserMsg(e.target.value)}
      ></textarea>
      <button 
      onClick={run}
      className="bg-blue-500 hover:bg-blue-600 border rounded-md text-lg p-1 ml-2 "
      >Send </button>
    </div>
  </div>

}
