import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfilePanel from './ProfilePanel.jsx';
import GroupPanel from './GroupPanel.jsx';

export default function Sidebar({ users, selectedUser, onSelectUser }) {
    const { user, logout } = useAuth();
    const [search, setSearch] = useState('');
    const [view, setView] = useState('default');

    const filteredUsers = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex flex-col h-full w-full bg-white select-none relative overflow-hidden">
            {view === 'profile' && <ProfilePanel onClose={() => setView('default')} />}
            {view === 'group' && <GroupPanel onClose={() => setView('default')} users={users} onGroupCreated={(newGroup) => { users.unshift(newGroup); setView('default'); }} />}

            {/* Top User Header */}
            <div className="flex items-center justify-between bg-[#f0f2f5] px-4 py-2.5 h-[59px] shrink-0 border-r border-[#d1d7db]/40">
                <div className="flex items-center gap-3">
                    <div onClick={() => setView('profile')} className="w-10 h-10 bg-[#dfe5e7] rounded-full flex items-center justify-center text-gray-600 font-semibold text-lg overflow-hidden shrink-0 cursor-pointer transition hover:opacity-80">
                         {user.username.charAt(0).toUpperCase()}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-[#54656f]">
                    {/* Communities */}
                    <button className="p-2 rounded-full hover:bg-[#d9dcd] transition-colors" title="Communities">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M12.016 11.234c2.196 0 3.984-1.788 3.984-3.984 0-2.196-1.788-3.984-3.984-3.984s-3.984 1.788-3.984 3.984 1.788 3.984 3.984 3.984zm0-6.168c1.205 0 2.184.979 2.184 2.184s-.979 2.184-2.184 2.184-2.184-.979-2.184-2.184.979-2.184 2.184-2.184zm6.656 7.426c1.788 0 3.234-1.446 3.234-3.234 0-1.788-1.446-3.234-3.234-3.234s-3.234 1.446-3.234 3.234 1.446 3.234 3.234 3.234zm0-4.668c.791 0 1.434.643 1.434 1.434s-.643 1.434-1.434 1.434-1.434-.643-1.434-1.434.643-1.434 1.434-1.434zm-13.312 4.668c1.788 0 3.234-1.446 3.234-3.234 0-1.788-1.446-3.234-3.234-3.234s-3.234 1.446-3.234 3.234 1.446 3.234 3.234 3.234zm0-4.668c.791 0 1.434.643 1.434 1.434s-.643 1.434-1.434 1.434-1.434-.643-1.434-1.434.643-1.434 1.434-1.434zm16.141 12.312h-18v-1.125c0-2.315 4.097-3.483 9-3.483 4.903 0 9 1.168 9 3.483v1.125zm-16.2-1.8h14.4c-.454-1.151-3.6-2.083-7.2-2.083-3.6 0-6.746.932-7.2 2.083zm18-1.859V19.5h-1.074c.264-.467.43-.996.476-1.559h.598zm-19.2 1.559H2.4v-1.875h.598c.046.563.212 1.092.476 1.559z"></path>
                        </svg>
                    </button>
                    {/* Status */}
                    <button className="p-2 rounded-full hover:bg-[#d9dcd] transition-colors" title="Status" onClick={() => window.dispatchEvent(new CustomEvent('open-status'))}>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M12.005 22.003c-5.523 0-10.003-4.48-10.003-10.003 0-2.458.887-4.706 2.35-6.444l1.325 1.134A8.257 8.257 0 0 0 3.727 12c0 4.569 3.706 8.275 8.275 8.275s8.275-3.706 8.275-8.275-3.706-8.275-8.275-8.275v-1.728c5.523 0 10.003 4.48 10.003 10.003s-4.48 10.003-10.003 10.003z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    {/* Channels */}
                    <button className="p-2 rounded-full hover:bg-[#d9dcd] transition-colors" title="Channels">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M12.016 1.996c5.523 0 10.004 4.481 10.004 10.004s-4.481 10.004-10.004 10.004S2.012 17.523 2.012 12c0-5.523 4.481-10.004 10.004-10.004zm0 2.004c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm1 3v4h4v2h-4v4h-2v-4h-4v-2h4v-4h2z"></path>
                        </svg>
                    </button>
                    {/* New Chat */}
                    <button className="p-2 rounded-full hover:bg-[#d9dcd] transition-colors" title="New chat">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"></path>
                        </svg>
                    </button>
                    {/* Menu */}
                    <div className="relative group cursor-pointer">
                        <button className="p-2 rounded-full hover:bg-[#d9dcd] transition-colors peer" title="Menu">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path></svg>
                        </button>
                        <div className="absolute right-0 top-[100%] mt-1 w-48 bg-white shadow-lg rounded-md overflow-hidden hidden transform origin-top-right transition-transform scale-95 opacity-0 peer-focus-within:block peer-focus-within:opacity-100 peer-focus-within:scale-100 z-50">
                            <div className="py-2 text-[14.5px] text-[#3b4a54]">
                                <div className="px-4 py-2 hover:bg-[#f5f6f6] cursor-pointer" onMouseDown={() => setView('group')}>New group</div>
                                <div className="px-4 py-2 hover:bg-[#f5f6f6] cursor-pointer" onMouseDown={() => setView('group')}>New community</div>
                                <div className="px-4 py-2 hover:bg-[#f5f6f6] cursor-pointer">Starred messages</div>
                                <div className="px-4 py-2 hover:bg-[#f5f6f6] cursor-pointer" onMouseDown={() => setView('profile')}>Settings</div>
                                <div className="px-4 py-2 hover:bg-[#f5f6f6] cursor-pointer" onClick={logout}>Log out</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar Input */}
            <div className="p-2 bg-white border-b border-[#f2f2f2] shrink-0">
                <div className="flex items-center bg-[#f0f2f5] rounded-lg px-3 py-1.5 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#00a884] transition-all">
                    <button className="text-[#54656f] shrink-0 hover:rotate-90 transition transform">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                    <input 
                        type="text" 
                        placeholder="Search or start new chat" 
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-[#111b21] ml-4 text-[15px] placeholder-[#8696a0]"
                        autoComplete="off"
                    />
                </div>
            </div>

            {/* Contacts Scrolling Viewer */}
            <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
                 {filteredUsers.length === 0 ? (
                      <div className="text-center p-8 text-[#8696a0] text-sm">No contacts or chats found via exact sequence mappings.</div>
                 ) : (
                      filteredUsers.map(u => {
                          const isSelected = selectedUser?._id === u._id;
                          return (
                              <div key={u._id} onClick={() => onSelectUser(u)}
                                  className={`flex items-center px-3 cursor-pointer transition-colors ${isSelected ? 'bg-[#f0f2f5]' : 'hover:bg-[#f5f6f6]'}`}>
                                  <div className="w-[49px] h-[49px] bg-[#dfe5e7] rounded-full flex items-center justify-center text-[#54656f] font-semibold text-xl my-2 mr-3 shrink-0 relative">
                                      {u.username.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1 flex flex-col justify-center h-[72px] border-b border-[#f2f2f2] pr-2 overflow-hidden">
                                      <div className="flex justify-between items-center mb-[3px]">
                                          <span className="text-[17px] text-[#111b21] leading-none truncate tracking-tight">{u.username}</span>
                                          {/* Static fallback time acting as a preview tick */}
                                          <span className={`text-[12px] leading-none font-medium ${isSelected ? 'text-[#111b21]' : 'text-[#667781]'}`}>Recent</span>
                                      </div>
                                      <div className="flex items-center text-[14px] text-[#667781] truncate tracking-tight">
                                          Hello there! I am using EchoChat.
                                      </div>
                                  </div>
                              </div>
                          )
                      })
                 )}
            </div>
        </div>
    );
}
