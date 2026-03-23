import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePanel({ onClose }) {
    const { user, api } = useAuth();
    const [about, setAbout] = useState(user.about || 'Available');
    const [theme, setTheme] = useState(user.theme || 'light');
    const [isEditingAbout, setIsEditingAbout] = useState(false);

    const handleUpdate = async (field, value) => {
        try {
            await api.put('/users/profile', { [field]: value });
            if (field === 'about') {
                user.about = value;
                setIsEditingAbout(false);
            }
            if (field === 'theme') {
                user.theme = value;
                if (value === 'dark') document.documentElement.classList.add('dark-theme');
                else document.documentElement.classList.remove('dark-theme');
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <div className="absolute inset-0 z-50 bg-[#f0f2f5] flex flex-col slide-in-left border-r border-[#d1d7db]/40">
            {/* Header */}
            <div className="bg-[#008069] h-[108px] px-6 text-white flex items-end justify-start space-x-6 shrink-0 shadow-sm relative z-10 pb-[18px]">
                <button onClick={onClose} className="hover:bg-black/10 p-2 rounded-full transition-colors mb-[-8px]">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 4l1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8 8-8z"></path></svg>
                </button>
                <div className="text-[19px] font-medium tracking-wide">Profile</div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center">
                {/* Avatar Section */}
                <div className="flex justify-center mt-7 mb-8 relative group w-[200px] h-[200px] cursor-pointer rounded-full overflow-hidden">
                    <div className="w-[200px] h-[200px] rounded-full bg-[#dfe5e7] flex items-center justify-center text-[#54656f] text-7xl font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                </div>

                {/* Name Section */}
                <div className="w-full px-7 py-[14px] bg-white shadow-sm mb-2.5">
                    <div className="text-[14px] text-[#008069] mb-4">Your name</div>
                    <div className="flex justify-between items-center group">
                        <div className="text-[#111b21] text-[17px] leading-relaxed">{user.username}</div>
                        <button className="text-[#54656f] transition p-1">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                        </button>
                    </div>
                </div>
                
                <div className="w-full px-7 pb-4">
                    <div className="text-[14px] text-[#8696a0] leading-[20px] font-normal">This is not your username or pin. This name will be visible to your WhatsApp contacts.</div>
                </div>

                {/* About Section */}
                <div className="w-full px-7 py-[14px] bg-white shadow-sm mb-2.5">
                    <div className="text-[14px] text-[#008069] mb-4">About</div>
                    <div className="flex justify-between items-center group">
                        {isEditingAbout ? (
                            <div className="flex w-full items-center border-b-2 border-[#00a884] pb-1">
                                <input 
                                    className="w-full py-1 outline-none text-[#111b21] font-medium text-[16px] bg-transparent" 
                                    value={about}
                                    onChange={(e)=>setAbout(e.target.value)}
                                    autoFocus
                                />
                                <button onClick={() => handleUpdate('about', about)} className="text-[#8696a0] hover:text-[#00a884] transition ml-2 p-1">
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></svg>
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="text-[#111b21] text-[17px] leading-relaxed">{user.about || 'Available'}</div>
                                <button onClick={() => setIsEditingAbout(true)} className="text-[#54656f] transition p-1">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Theme Toggle */}
                <div className="w-full px-7 py-[14px] bg-white shadow-sm mb-[5px]">
                    <div className="text-[14px] text-[#008069] mb-4">Display Theme</div>
                    <div className="flex justify-between items-center group">
                        <select 
                            className="w-full bg-transparent text-[#111b21] text-[16px] py-1 outline-none cursor-pointer"
                            value={theme}
                            onChange={(e) => {
                                setTheme(e.target.value);
                                handleUpdate('theme', e.target.value);
                            }}
                        >
                            <option value="light">Bright Mode</option>
                            <option value="dark">Dark Mode</option>
                        </select>
                    </div>
                </div>
                
                {/* Unique ID */}
                <div className="w-full px-7 py-[14px] bg-white shadow-sm mt-[5px]">
                    <div className="text-[14px] text-[#008069] mb-4">Unique User Identifier</div>
                    <div className="flex justify-between items-center group">
                        <div className="text-[#111b21] text-[17.5px] font-mono tracking-widest">{user.uniqueId || user._id.slice(0, 8).toUpperCase()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
