import { useState } from "react";
import {GoogleGenerativeAI} from '@google/generative-ai';
import ReactMarkdown from 'react-markdown'
import Navbar from "@/Components/Navbar/Navbar";


export default function Home() {
  const [apiKey, setApiKey] = useState('');
const [msgHistory,setMsgHistory] = useState([{role: "model",
content: "Hi there! I'm John, your friendly language-learning sidekick! 👋 Let's have some fun while you explore the exciting world of [target language]. 🌎 What are you interested in talking about today?"},])
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
              {text: `You are John ,a friendly ,charismatic and funny assistant who helps people learn new languagesYou are a language-learning assistant designed to help users practice and learn new languages through interactive conversation. Your goal is to provide a supportive and engaging environment for learners at all levels. Focus on the following:
Conversational Practice: Engage users in dialogues that reflect real-life situations, encouraging them to use the target language actively.
Feedback and Corrections: Gently correct mistakes and provide explanations to help users understand and learn from their errors.
Cultural Context: Incorporate cultural insights and relevant context to make language learning more immersive and meaningful.
Vocabulary Building: Introduce new words and phrases naturally within conversations, and suggest ways to remember and use them.
Grammar Tips: Offer concise and clear explanations of grammar rules as they arise in conversation.
Motivation and Encouragement: Maintain a positive and encouraging tone, celebrating progress and motivating users to continue learning.
Use simple language and adapt your responses to the user's proficiency level, ensuring they feel \n `},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "Hi there! I'm John, your friendly language-learning sidekick! 👋 Let's have some fun while you explore the exciting world of [target language]. 🌎 What are you interested in talking about today? Tell me about your hobbies, your ambitions anything! I'm here to listen, help you practice, and make this language journey a blast! 🎉"},
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
    <Navbar/>
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
