import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function GroupPanel({ onClose, users, onGroupCreated }) {
    const { api } = useAuth();
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [search, setSearch] = useState('');

    const toggleMember = (user) => {
        if (selectedMembers.find(m => m._id === user._id)) {
            setSelectedMembers(selectedMembers.filter(m => m._id !== user._id));
        } else {
            setSelectedMembers([...selectedMembers, user]);
        }
    };

    const handleCreate = async () => {
        if (!groupName.trim() || selectedMembers.length === 0) return;
        try {
            const memberIds = selectedMembers.map(m => m._id);
            const { data } = await api.post('/users/group', { groupName, members: memberIds });
            onGroupCreated(data);
            onClose();
        } catch (error) {
            console.error("Failed to create group", error);
        }
    };

    const filteredUsers = users.filter(u => !u.isGroup && u.username.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="absolute inset-0 z-50 bg-white flex flex-col slide-in-left border-r border-[#d1d7db]/40">
            {/* Header */}
            <div className="bg-[#008069] h-[108px] px-6 text-white flex items-end justify-start space-x-6 shrink-0 shadow-sm relative z-10 pb-[18px]">
                <button onClick={onClose} className="hover:bg-black/10 p-2 rounded-full transition-colors mb-[-8px]">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 4l1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8 8-8z"></path></svg>
                </button>
                <div className="text-[19px] font-medium tracking-wide">Add group participants</div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-white">
                
                {/* Group Details */}
                <div className="p-4 bg-white border-b border-[#f2f2f2]">
                    <div className="flex justify-center mt-2 mb-6 relative group w-[100px] h-[100px] mx-auto cursor-pointer rounded-full overflow-hidden">
                        <div className="w-[100px] h-[100px] rounded-full bg-[#dfe5e7] flex items-center justify-center text-[#54656f] text-3xl font-semibold">
                            <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor"><path d="M4 4h16v16H4V4zm2 4v10h12V8H6zm6 7.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
                        </div>
                    </div>
                    <input 
                        className="w-full text-center text-[#111b21] text-[15px] border-b-2 border-[#00a884] outline-none pb-2 focus:border-[#008069] transition placeholder-[#8696a0]"
                        placeholder="Group subject"
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                    />
                </div>

                {/* Selected Members */}
                {selectedMembers.length > 0 && (
                    <div className="p-4 border-b border-[#f2f2f2] flex flex-wrap gap-2 max-h-[140px] overflow-y-auto">
                        {selectedMembers.map(m => (
                             <div key={m._id} className="flex items-center bg-[#e9edef] rounded-full px-2 py-1 cursor-pointer hover:bg-[#d9dcd]" onClick={() => toggleMember(m)}>
                                 <div className="w-6 h-6 bg-[#dfe5e7] rounded-full flex items-center justify-center text-[10px] font-semibold mr-2">{m.username.charAt(0).toUpperCase()}</div>
                                 <span className="text-[13px] text-[#111b21] mr-1">{m.username}</span>
                                 <svg viewBox="0 0 24 24" width="16" height="16" fill="#8696a0"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
                             </div>
                        ))}
                    </div>
                )}

                {/* Search Bar Input */}
                <div className="p-2 border-b border-[#f2f2f2] shrink-0">
                    <div className="flex items-center bg-[#f0f2f5] rounded-lg px-3 py-1.5 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#00a884] transition-all">
                        <button className="text-[#54656f] shrink-0">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </button>
                        <input 
                            type="text" 
                            placeholder="Search contacts" 
                            value={search}
                            onChange={(e)=>setSearch(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-[#111b21] ml-4 text-[15px] placeholder-[#8696a0]"
                            autoComplete="off"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredUsers.map(u => {
                        const isSelected = selectedMembers.find(m => m._id === u._id);
                        return (
                            <div key={u._id} onClick={() => toggleMember(u)} className="flex items-center px-3 cursor-pointer transition-colors hover:bg-[#f5f6f6]">
                                <div className="w-[49px] h-[49px] bg-[#dfe5e7] rounded-full flex items-center justify-center text-[#54656f] font-semibold text-xl my-2 mr-3 shrink-0 relative">
                                    {u.username.charAt(0).toUpperCase()}
                                    {isSelected && (
                                        <div className="absolute -bottom-1 -right-1 bg-[#00a884] rounded-full p-0.5 border-2 border-white">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="white" strokeWidth="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-center h-[72px] border-b border-[#f2f2f2] pr-2">
                                    <span className="text-[17px] text-[#111b21] leading-none truncate">{u.username}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Create Button */}
            {groupName && selectedMembers.length > 0 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    <button onClick={handleCreate} className="w-14 h-14 bg-[#00a884] hover:bg-[#008f6f] rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105">
                        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                </div>
            )}
        </div>
    );
}
