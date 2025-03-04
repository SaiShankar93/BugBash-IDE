'use client';
import React, { useRef, useState, useEffect, use } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import LanguageSelector from '@/components/LanguageSelector';
import { code_snippets } from '@/constants/languages';
import Output from '@/components/Output';
import { io, Socket } from 'socket.io-client';
import { executeCode } from "@/actions/compile";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSave, faUsers, faSun, faMoon,faArrowDown, faMicrophone, faMicrophoneSlash, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';

let socket: Socket;

const initialCodeState: Record<string, string> = {
  "javascript": "console.log('Hello, JavaScript!');",
  "python": "print('Hello, Python!')",
  "java": `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
  }`,
  "csharp": `using System;

  class Program
  {
      static void Main()
      {
          Console.WriteLine("Hello, C#!");
      }
  }`,
  "cpp": `#include <iostream>

  int main() {
      std::cout << "Hello, C++!";
      return 0;
  }`,
  "c": `#include <stdio.h>

  int main() {
      printf("Hello, C!");
      return 0;
  }`,
  "typescript": "console.log('Hello, TypeScript!');"
};


export default function Home() {
  const [codes, setCodes] = useState<Record<string, string>>(initialCodeState);
  const [language, setLanguage] = useState<string>('javascript');
  const [value, setValue] = useState<string>(codes['javascript']);
  const editorRef = useRef<any>();
  const monacoRef = useRef<Monaco>();
  // const [roomId, setRoomId] = useState<string | null>(localStorage.getItem('roomId') || '');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [output, setOutput] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
  // const [username, setUsername] = useState<string>(localStorage.getItem('userName') || '');
  const [username, setUsername] = useState<string>('');
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [showUsersList, setShowUsersList] = useState(false);
  const [lightMode, setLightMode] = useState<boolean>(false);



  useEffect(() => {
    socket = io('http://localhost:5000');

    socket.on('connect', () => {
      toast.success('User connected');
    });

    socket.on('disconnect', () => {
      toast.error('User disconnected');
    });

    socket.on('userLeft', ({ username }) => {
      toast.error(`${username} left the room`);
    });

    socket.on('userJoined', ({ username }) => {
      toast.success(`${username} joined the room`);
    });

    socket.on('welcome', (message) => {
      toast.success(message);
    });

    socket.on('codeUpdate', (newCode) => {
      if (editorRef.current && editorRef.current.getValue() !== newCode) {
        editorRef.current.setValue(newCode);
      }
    });
    
    socket.on('languageUpdate', (newLanguage, newCode) => {
      setLanguage(newLanguage);
      setValue(newCode);
      if (monacoRef.current && editorRef.current.getValue() !== newCode) {
        monacoRef.current.editor.setModelLanguage(editorRef.current.getModel(), newLanguage);
        editorRef.current.setValue(newCode);
      }
    });

    socket.on('userListUpdate', (users) => {
      setConnectedUsers(users);
    });

    return () => {
      socket.disconnect();
    };

  }, []);

  useEffect(() => {
    const getData = () =>{
      const storedRoomId = localStorage.getItem('roomId');
      const storedUsername = localStorage.getItem('userName');
      console.log(storedRoomId,storedUsername)
      if (storedRoomId) {
        console.log('in room id')
        setRoomId(storedRoomId);
        console.log('room id',roomId)
      }
      if (storedUsername) {
        console.log('in username')
        setUsername(storedUsername);
        console.log('username',username)
      }
      console.log('rdldd',roomId,username)
      if (roomId && username) {
        console.log('bsdk',roomId,username)
        joinRoom(roomId);
      }
    }
    getData()
  }, []);
  useEffect(() => {
    if (roomId && username && !showJoinRoomModal) {
      joinRoom(roomId);
    }
  }, [roomId, username]);

  const onMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.focus();

    editor.onDidChangeCursorPosition((e: any) => {
      if (roomId && username) {
        socket.emit('cursorChange', { roomId, username, position: e.position });
      }
    });
  };

  const handleLanguageSelect = (newLanguage: string) => {
    if (roomId) {
      socket.emit('languageChange', { roomId, language: newLanguage, value: codes[newLanguage] });
    }
    setLanguage(newLanguage);
    setValue(code_snippets[newLanguage]);
  };

  const handleEditorChange = (value: string | undefined) => {
    const updatedCode = value || '';
    setValue(updatedCode);
    setCodes(prevCodes => ({ ...prevCodes, [language]: updatedCode }));

    if (roomId) {
      socket.emit('codeChange', { roomId, code: updatedCode });
    }
  };

  const runCode = async () => {
    const sourceCode: string = editorRef.current?.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const result = await executeCode(language, sourceCode);
      setOutput(result.run.output.split("\n"));
      setIsError(!!result.run.stderr);
    } catch (error: any) {
      console.error(error);
      alert("An error occurred: " + (error.message || "Unable to run code"));
      setIsError(true);
    } finally {
      setIsLoading(false);
      handleScrollToOutput()
    }
  };

  const createRoom = () => {
    if (!username) {
      toast.error("please fill the username")
      return;
    }
    const newRoomId = Math.floor(10000 + Math.random() * 90000).toString();
    console.log("New Room ID:", newRoomId);
    setCreatedRoomId(newRoomId);
    setRoomId(newRoomId);
    setUsername(username)
    socket.emit('joinRoom', { roomId: newRoomId, username });
    localStorage.setItem('roomId', newRoomId)
    localStorage.setItem('userName',username)
    setShowCreateRoomModal(false);
  };

  const joinRoom = (roomId: string) => {
    if (!username) {
      toast.error("please fill the username")
      return;
    }
    if (!roomId) {
      toast.error("please enter Room ID")
      return;
    }
    setRoomId(roomId);
    setUsername(username);
    socket.emit('joinRoom', { roomId, username });
    localStorage.setItem('roomId', roomId);
    localStorage.setItem('userName',username)
    setShowJoinRoomModal(false);
  };

  const leaveRoom = () => {
    if (roomId) {
      socket.emit('leaveRoom', { roomId, username });
      setRoomId(null);
      setCreatedRoomId(null);
      setConnectedUsers([]);
      localStorage.setItem("roomId", '')
    }
  };
  const handleScrollToOutput = () => {
    const outputDiv = document.getElementById('output');
    if (outputDiv) {
      outputDiv.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // const saveCode = async () => {
  //   const sourceCode = editorRef.current?.getValue();
  //   if (!sourceCode || !username) return;

  //   try {
  //     const response = await fetch('/api/savecode', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ codes, username }),
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       alert(data.message);
  //     } else {
  //       alert(data.error);
  //     }
  //   } catch (error) {
  //     console.error('Error saving code:', error);
  //     alert('Failed to save code');
  //   }
  // };


  const closeJoinModal = () => {
    setRoomId('');
    setShowJoinRoomModal(false)
  }

  return (
    <>

      <div className={`flex flex-col md:flex-row h-screen ${lightMode ? "bg-gray-300" : " bg-gray-900"} `}>
        <Toaster />
        <div className="md:w-2/3 border-b md:border-b-0 md:border-r border-gray-900">
          <div className={`flex flex-col md:flex-row justify-between items-center px-4 py-2 border-b ${lightMode ? 'border-gray-50 bg-gray-100' : 'border-gray-700 bg-gray-900'}`}>
          <div className="flex flex-row items-center space-x-2">
        <LanguageSelector
          language={language}
          onSelect={handleLanguageSelect}
        />
        <button
          className="block md:hidden px-2 py-1 border border-slate-500 text-slate-500 rounded-lg hover:bg-slate-600 hover:text-white"
          onClick={handleScrollToOutput}
        >
          Output <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </div>

            <div className="flex space-x-2 items-center mt-2 md:mt-0">
              <button
                className="px-4 py-2 border border-slate-500 text-slate-500 rounded-lg hover:bg-slate-600 hover:text-white"
                onClick={() => setLightMode(!lightMode)}
              >
                {lightMode ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}
              </button>
              {roomId ? (
                <>
                  <span className={`${lightMode ? "text-black" : "text-white"}`}>Room ID: {roomId}</span>
                  <button
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-600 hover:text-white"
                    onClick={leaveRoom}
                  >
                    Leave Room
                  </button>
                  <button
                    className="px-4 py-2 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-600 hover:text-white"
                    onClick={() => setShowUsersList(!showUsersList)}
                  >
                    <span>
                      <FontAwesomeIcon icon={faUsers} />
                      {connectedUsers.length}
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-4 py-2 border border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-600 hover:text-white"
                    onClick={() => setShowCreateRoomModal(true)}
                  >
                    Create Room
                  </button>
                  <button
                    className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-600 hover:text-white"
                    onClick={() => setShowJoinRoomModal(true)}
                  >
                    Join Room
                  </button>
                </>
              )}
              <button
                className={`px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-600 hover:text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={runCode}
                disabled={isLoading}
              >
                {isLoading ?
                  <div role="status">
                    <svg aria-hidden="true" className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                  </div>
                  :
                  <FontAwesomeIcon icon={faPlay} />}
              </button>
            </div>
          </div>

          <Editor
            height="calc(100vh - 100px)"
            language={language}
            theme={lightMode ? "vs-light" : "vs-dark"}
            onMount={onMount}
            value={value}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              scrollbar: { alwaysConsumeMouseWheel: false },
            }}
          />
        </div>

        <div className={`md:w-1/3 p-4 ${lightMode ? 'bg-gray-100' : 'bg-gray-900'}  `} id='output'>
          <Output output={output} isError={isError} lightMode={lightMode} />
        </div>

        {showCreateRoomModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-lg mb-4">Create Room</h2>
              <label className="block mb-2">Username:</label>
              <input
                type="text"
                placeholder="Enter Your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border p-2 mb-4 w-full"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700" onClick={createRoom}>
                Create
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700" onClick={() => setShowCreateRoomModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {showJoinRoomModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-lg mb-4">Join Room</h2>
              <label className="block mb-2">Room ID:</label>
              <input
                type="text"
                value={roomId || ''}
                onChange={(e) => setRoomId(e.target.value)}
                className="border p-2 mb-4 w-full"
              />
              <label className="block mb-2">Username:</label>
              <input
                type="text"
                placeholder="Enter Your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border p-2 mb-4 w-full"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700" onClick={() => joinRoom(roomId!)}>
                Join
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700" onClick={closeJoinModal}>
                close
              </button>

            </div>
          </div>
        )}
        {showUsersList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Connected Users</h2>
              <ul className="space-y-4">
                {connectedUsers.map((user, index) => (
                  <li key={index} className="flex items-center space-x-4 bg-gray-100 p-2 rounded-lg shadow-sm">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white font-bold">
                      {user.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-lg text-gray-800">{user}</span>
                  </li>
                ))}
              </ul>
              <button
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none"
                onClick={() => setShowUsersList(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}