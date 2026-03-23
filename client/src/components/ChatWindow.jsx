import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EmojiPicker from 'emoji-picker-react';

const ENDPOINT = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function ChatWindow({ selectedUser, messages, setMessages, onBack }) {
    const { user, api } = useAuth();
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAttachments, setShowAttachments] = useState(false);
    
    // Recording state arrays
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    
    const endRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [messages]);

    // Async Timer strictly tracking duration natively
    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        } else {
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const handleSend = async (e) => {
        e.preventDefault();
        setShowEmojiPicker(false);
        if(!newMessage.trim()) return;
        try {
             const textToSend = newMessage;
             setNewMessage('');
             const { data } = await api.post('/messages', {
                 receiver: selectedUser._id,
                 text: textToSend
             });
             setMessages(prev => [...prev, data]);
        } catch (error) {
             console.error("Message send failed.");
        }
    }

    const startRecording = async () => {
        setShowEmojiPicker(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = e => {
                if(e.data.size > 0) audioChunksRef.current.push(e.data);
            };
            mediaRecorderRef.current.onstop = async () => {
                 const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                 audioChunksRef.current = [];
                 
                 const audioFile = new File([audioBlob], 'audio_message.webm', {type: 'audio/webm'});
                 uploadMedia(audioFile, 'audio', recordingTime);
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch(err) { 
            console.error("Microphone hardware access denied or missing.", err); 
            alert('Hardware access denied. Please allow microphone permissions.');
        }
    };

    const stopRecording = () => {
        if(mediaRecorderRef.current && isRecording) {
             mediaRecorderRef.current.stop();
             mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
             setIsRecording(false);
        }
    };

    const handleFileUploadChange = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        setShowEmojiPicker(false);
        
        let t = 'file';
        if (file.type.startsWith('audio/')) t = 'audio';
        
        uploadMedia(file, t, 0);
        e.target.value = ''; // Reset input
    };

    const uploadMedia = async (file, type, duration) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('receiver', selectedUser._id);
        formData.append('type', type);
        if (duration) formData.append('duration', duration);
        
        try {
             const { data } = await api.post('/messages/upload', formData, {
                 headers: { 'Content-Type': 'multipart/form-data' }
             });
             setMessages(prev => [...prev, data]);
        } catch (error) {
             console.error("Media Upload failed dynamically", error);
        }
    };

    if (!selectedUser) {
        return (
            <div className="hidden md:flex flex-col h-full items-center justify-center p-4 border-l border-[#d1d7db]/40 border-b-8 border-b-[#43c5a5]">
                <div className="max-w-[460px] text-center flex flex-col items-center">
                    <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke="#dfe5e7" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="mb-8">
                       <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <h1 className="text-[32px] text-[#41525d] font-light mb-4 tracking-tight leading-none">Assignment Web Client</h1>
                    <p className="text-[#667781] text-[14px] leading-relaxed mb-8 font-medium">
                        Send and receive messages seamlessly without keeping any hardware online.<br/>
                        Select a user from the sidebar to verify full-stack architectural syncing natively.
                    </p>
                </div>
            </div>
        );
    }

    const SingleGrayTick = <svg viewBox="0 0 16 15" width="16" height="15" className="text-[#8696a0]"><path fill="currentColor" d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>;
    const DoubleGrayTick = <svg viewBox="0 0 16 15" width="16" height="15" className="text-[#8696a0]"><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>;
    const DoubleBlueTick = <svg viewBox="0 0 16 15" width="16" height="15" className="text-[#53bdeb]"><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>;

    return (
        <div className="flex flex-col h-full relative">
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/clean-text-pattern.png')] pointer-events-none" onClick={()=>setShowEmojiPicker(false)}></div>
            
            <div className="h-[59px] bg-[#f0f2f5] flex items-center px-4 justify-between z-10 shrink-0 border-l border-[#d1d7db]/40">
                <div className="flex items-center gap-4 cursor-pointer">
                    <button onClick={onBack} className="md:hidden text-[#54656f] p-1 -ml-2 rounded-full hover:bg-[#d9dcd] transition-colors">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                    <div className="relative w-10 h-10 bg-[#dfe5e7] rounded-full flex items-center justify-center text-gray-600 font-semibold text-lg shrink-0">
                         {selectedUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col justify-center h-full">
                        <span className="font-semibold text-[#111b21] text-[16px] leading-[1.2]">{selectedUser.username}</span>
                        {selectedUser.isOnline && <span className="text-[13px] text-[#667781] leading-[1.2]">Online</span>}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-[#54656f]">
                    {/* Video Call */}
                    <button className="p-2 rounded-full hover:bg-[#d9dcd] transition-colors" title="Video call" onClick={() => window.dispatchEvent(new CustomEvent('video-call', {detail: selectedUser}))}>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18 10.32V7.5A1.5 1.5 0 0 0 16.5 6h-11A1.5 1.5 0 0 0 4 7.5v9A1.5 1.5 0 0 0 5.5 18h11a1.5 1.5 0 0 0 1.5-1.5v-2.82l4 3.96v-11.3l-4 3.98z"></path></svg>
                    </button>
                    {/* Audio Call */}
                    <button className="p-2 rounded-full hover:bg-[#d9dcd] transition-colors" title="Voice call" onClick={() => window.dispatchEvent(new CustomEvent('audio-call', {detail: selectedUser}))}>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19.01 15.63l-2.82-1.3a1.49 1.49 0 0 0-1.87.41l-1.34 1.76a13.3 13.3 0 0 1-6.14-6.14l1.76-1.34a1.49 1.49 0 0 0 .41-1.87l-1.3-2.82A1.49 1.49 0 0 0 6.01 3.2L4.08 3.51a1.5 1.5 0 0 0-1.28 1.48C2.86 11.66 8.35 17.15 15.01 21.2a1.5 1.5 0 0 0 1.48-1.28l.31-1.93a1.49 1.49 0 0 0-1.13-1.63z"></path></svg>
                    </button>
                    <div className="w-[1px] h-6 bg-[#d1d7db] mx-1"></div>
                    {/* Search */}
                    <button className="p-2 rounded-full hover:bg-[#d9dcd] transition-colors" title="Search...">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                    {/* Menu */}
                    <div className="relative group cursor-pointer z-50">
                        <button className="p-2 rounded-full hover:bg-[#d9dcd] transition-colors peer" title="Menu">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path></svg>
                        </button>
                        <div className="absolute right-0 top-[100%] mt-1 w-48 bg-white shadow-lg rounded-md overflow-hidden hidden transform origin-top-right transition-transform scale-95 opacity-0 peer-focus-within:block peer-focus-within:opacity-100 peer-focus-within:scale-100">
                            <div className="py-2 text-[14.5px] text-[#3b4a54]">
                                <div className="px-4 py-2 hover:bg-[#f5f6f6] cursor-pointer">Contact info</div>
                                <div className="px-4 py-2 hover:bg-[#f5f6f6] cursor-pointer">Select messages</div>
                                <div className="px-4 py-2 hover:bg-[#f5f6f6] cursor-pointer">Close chat</div>
                                <div className="px-4 py-2 hover:bg-[#f5f6f6] cursor-pointer">Mute notifications</div>
                                <div className="px-4 py-2 hover:bg-[#f5f6f6] cursor-pointer text-red-500">Clear chat</div>
                                <div className="px-4 py-2 hover:bg-[#f5f6f6] cursor-pointer text-red-500">Delete chat</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-[5%] py-4 md:px-14 flex flex-col z-10 custom-scrollbar" onClick={()=>{setShowEmojiPicker(false); setShowAttachments(false);}}>
                <div className="w-full flex justify-center mb-6">
                    <span className="bg-[#ffeecd] text-[#54656f] text-[12.5px] px-3 py-1.5 rounded-lg shadow-sm text-center">
                        Messages are rigorously secured internally within your MongoDB persistence layer.
                    </span>
                </div>

                {messages.map((m, i) => {
                     const senderId = m.sender._id || m.sender;
                     const isMe = senderId === user._id;
                     let showTail = true;
                     if(i > 0 && (messages[i-1].sender._id || messages[i-1].sender) === senderId) showTail = false;

                     const bubbleStyles = isMe 
                         ? 'bg-[#dcf8c6] rounded-l-lg rounded-b-lg ' + (showTail ? 'rounded-tr-none' : 'rounded-tr-lg')
                         : 'bg-white rounded-r-lg rounded-b-lg ' + (showTail ? 'rounded-tl-none' : 'rounded-tl-lg');

                     return (
                         <div key={m._id || i} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} ${showTail ? 'mt-3' : 'mt-[3px]'}`}>
                              <div className={`relative px-[9px] min-w-[80px] pt-[6px] pb-2 max-w-[65%] text-[14.2px] md:text-[15px] shadow-sm leading-[20px] break-words text-[#111b21] ${bubbleStyles}`}>
                                  {/* Dynamic Media Routing */}
                                  {m.type === 'text' && <span>{m.text}</span>}
                                  
                                  {m.type === 'audio' && (
                                      <div className="flex items-center gap-2 pt-1 pb-1">
                                          <audio controls src={`${ENDPOINT}/${m.fileUrl}`} className="h-[38px] max-w-[220px]" />
                                      </div>
                                  )}
                                  
                                  {m.type === 'file' && (
                                      <a href={`${ENDPOINT}/${m.fileUrl}`} target="_blank" download className="flex items-center gap-3 p-2 bg-black/5 rounded-md cursor-pointer hover:bg-black/10 transition mt-1">
                                          <div className="p-2 bg-[#00a884] text-white rounded-md shrink-0">
                                              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                                          </div>
                                          <div className="flex flex-col flex-1 overflow-hidden min-w-[120px] text-left">
                                              <span className="text-[14px] text-[#111b21] font-medium truncate leading-tight">{m.fileName}</span>
                                              <span className="text-[12px] text-[#667781] uppercase mt-0.5">{(m.fileSize / 1024).toFixed(1)} KB • Document</span>
                                          </div>
                                      </a>
                                  )}

                                  <span className="float-right text-[11px] text-[#667781] mt-1 ml-3 select-none flex items-center gap-1 w-max justify-end clear-both -mb-1 min-w-[50px] text-right translate-y-[2px]">
                                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      {isMe && (
                                         <span className="ml-[1px]">
                                            {m.status === 'read' ? DoubleBlueTick : m.status === 'delivered' ? DoubleGrayTick : SingleGrayTick}
                                         </span>
                                      )}
                                  </span>
                                  
                                  {showTail && isMe && (
                                     <svg viewBox="0 0 8 13" width="8" height="13" className="absolute top-0 -right-[8px] text-[#dcf8c6] drop-shadow-sm"><path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" fill="currentColor"></path></svg>
                                  )}
                                  {showTail && !isMe && (
                                     <svg viewBox="0 0 8 13" width="8" height="13" className="absolute top-0 -left-[8px] text-white drop-shadow-sm"><path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" fill="currentColor" transform="matrix(-1 0 0 1 8 0)"></path></svg>
                                  )}
                              </div>
                         </div>
                     );
                })}
                <div ref={endRef} className="h-3" />
            </div>
            
            <form onSubmit={handleSend} className="h-[62px] px-4 bg-[#f0f2f5] flex items-center gap-2 z-10 shrink-0 relative">
                 
                 {/* Emoji Picker Toggle */}
                 <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-[#54656f] p-2 hover:bg-[#d9dcd] rounded-full transition-colors shrink-0">
                     <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                 </button>
                 
                 {/* Internal Emoji Library Mount */}
                 {showEmojiPicker && (
                      <div className="absolute bottom-[65px] left-4 z-50 shadow-2xl rounded-lg overflow-hidden border border-[#d1d7db]">
                          <EmojiPicker onEmojiClick={(e) => setNewMessage(p => p + e.emoji)} width={320} height={400} />
                      </div>
                 )}

                 {/* File Attachment Triggers */}
                 <div className="relative">
                     <button type="button" onClick={() => {setShowAttachments(!showAttachments); setShowEmojiPicker(false);}} className="text-[#54656f] p-2 hover:bg-[#d9dcd] rounded-full transition-colors shrink-0 mr-1">
                         <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" className={`transition-transform duration-300 ${showAttachments ? 'rotate-45 bg-[#d9dcd] rounded-full' : ''}`}><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                     </button>
                     {showAttachments && (
                         <div className="absolute bottom-14 left-0 bg-white shadow-[0_2px_15px_rgba(11,20,26,0.1)] border border-[#d1d7db]/40 rounded-2xl py-2 w-52 z-50 transform origin-bottom-left transition-all">
                             <div className="flex flex-col">
                                 <button type="button" onClick={() => {fileInputRef.current?.click(); setShowAttachments(false);}} className="flex items-center gap-3 px-4 py-2 hover:bg-[#f5f6f6] transition-colors text-left w-full group">
                                     <div className="bg-[#7f66ff] text-white p-2 rounded-full group-hover:bg-[#6b52e0] transition-colors"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4 2v20h16V8l-6-6H4zm14 18H6V4h7v5h5v11z"></path></svg></div>
                                     <span className="text-[15.5px] text-[#3b4a54] font-medium">Document</span>
                                 </button>
                                 <button type="button" onClick={() => {fileInputRef.current?.click(); setShowAttachments(false);}} className="flex items-center gap-3 px-4 py-2 hover:bg-[#f5f6f6] transition-colors text-left w-full group">
                                     <div className="bg-[#007bfc] text-white p-2 rounded-full group-hover:bg-[#0063cc] transition-colors"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path></svg></div>
                                     <span className="text-[15.5px] text-[#3b4a54] font-medium">Photos & videos</span>
                                 </button>
                                 <button type="button" onClick={() => setShowAttachments(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-[#f5f6f6] transition-colors text-left w-full group">
                                     <div className="bg-[#ff2e74] text-white p-2 rounded-full group-hover:bg-[#e02663] transition-colors"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"></path></svg></div>
                                     <span className="text-[15.5px] text-[#3b4a54] font-medium">Camera</span>
                                 </button>
                                 <button type="button" onClick={() => setShowAttachments(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-[#f5f6f6] transition-colors text-left w-full group">
                                     <div className="bg-[#009de2] text-white p-2 rounded-full group-hover:bg-[#0086c2] transition-colors"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg></div>
                                     <span className="text-[15.5px] text-[#3b4a54] font-medium">Contact</span>
                                 </button>
                             </div>
                         </div>
                     )}
                 </div>
                 <input type="file" hidden ref={fileInputRef} onChange={handleFileUploadChange} />
                 
                 {/* Recording UX Bar vs Text Input */}
                 {isRecording ? (
                     <div className="flex-1 h-[42px] px-4 rounded-lg bg-red-50 flex items-center gap-3 animate-pulse border border-red-100 shadow-sm transition-all relative overflow-hidden">
                          <div className="absolute left-0 top-0 h-full w-full bg-red-100/50 -z-10"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-md"></div>
                          <span className="text-red-500 text-[15px] font-semibold tracking-wide" style={{fontVariantNumeric: 'tabular-nums'}}>
                              {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                          </span>
                     </div>
                 ) : (
                     <input className="flex-1 h-[42px] px-4 rounded-lg outline-none border-none focus:outline-none bg-white text-[#111b21] text-[15px] placeholder-[#8696a0]" placeholder="Type a message" value={newMessage} onChange={e => setNewMessage(e.target.value)} autoComplete="off" />
                 )}
                 
                 {/* Dynamic Right Submit Map */}
                 {newMessage.trim() ? (
                    <button type="submit" className="text-[#54656f] p-2 hover:bg-[#d9dcd] rounded-full transition-colors"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" className="translate-x-0.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
                 ) : (
                    <button type="button" onClick={isRecording ? stopRecording : startRecording} className={`${isRecording ? 'text-white bg-red-500 scale-110 shadow-md hover:bg-red-600' : 'text-[#54656f] hover:bg-[#d9dcd]'} p-2 rounded-full transition-all duration-200`}>
                       {isRecording ? (
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>
                       ) : (
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                       )}
                    </button>
                 )}
            </form>
        </div>
    );
}
