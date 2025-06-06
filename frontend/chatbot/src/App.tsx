import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState<string[]>(["hello there"]);
  const [Input ,setinput] = useState<string>("");
  const wsRef =useRef<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket('http://localhost:5500');

    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data]);
    };
  wsRef.current=ws;

     ws.onopen =()=>{
      ws.send(JSON.stringify({
        type:'join',
        payload:{
          room :'red'
        }
      }))
     }

    
    return () => ws.close();
  }, []);

  return (
    <div className='h-screen bg-black flex justify-center items-center flex-col'>
      <div className='h-[40vw] bg-green-200 w-[40vw] rounded-md overflow-auto p-2'>
        {messages.map((message, index) => (
          <div key={index} className='mt-8'><span className='bg-white rounded-md '>{message}</span></div>
        ))}
      </div>

      <div className='h-[5vw] bg-red-200 w-[20vw] rounded-md mt-4 flex justify-center items-center'>
        <input
          className='rounded-md h-10 outline-none text-center'
          type='text'
          placeholder='Send message..'
          value={Input}
          onChange={(e)=>{setinput(e.target.value)}}
        />
        <button onClick={()=>{
         wsRef.current?.send(JSON.stringify({
          type :"chat",
          payload :{
            message : Input
          }
         }))
        }} className='mx-2 cursor-pointer rounded-md w-12 bg-[#2596be] text-white hover:bg-[#4643d4] duration-300 delay-200'>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
