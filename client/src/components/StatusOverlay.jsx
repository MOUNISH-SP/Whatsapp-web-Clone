import React, { useState } from 'react';

export default function StatusOverlay({ onClose, user }) {
    const [viewingStatus, setViewingStatus] = useState(false);
    
    return (
        <div className="fixed inset-0 z-[100] bg-[#111b21] flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 text-[#d1d7db]">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12 20.016l-7.016-7.016 7.016-7.016 1.406 1.406-4.609 4.609h10.203v2h-10.203l4.609 4.609z"></path>
                    </svg>
                </button>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#dfe5e7] rounded-full flex items-center justify-center text-gray-800 font-semibold text-lg relative cursor-pointer group">
                        {user.username.charAt(0).toUpperCase()}
                        <div className="absolute right-0 bottom-0 w-4 h-4 bg-[#00a884] rounded-full flex items-center justify-center border-2 border-[#111b21]">
                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="white" strokeWidth="3" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </div>
                    </div>
                    <div>
                        <div className="text-[16px] text-[#e9edef] font-medium">My status</div>
                        <div className="text-[13px] text-[#8696a0]">No updates</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar Status List */}
                <div className="w-full md:w-[30%] lg:w-[25%] bg-[#111b21] border-r border-white/10 flex flex-col">
                    <div className="px-6 py-4 text-[#00a884] font-medium text-sm tracking-wide">RECENT UPDATES</div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="text-center text-[#8696a0] p-6 text-[14px]">No recent updates to show right now.</div>
                    </div>
                </div>
                {/* Right Viewing Area */}
                <div className="hidden md:flex flex-1 bg-[#0b141a] items-center justify-center flex-col relative">
                    <svg viewBox="0 0 24 24" width="100" height="100" fill="none" stroke="#3b4a54" strokeWidth="1"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg>
                    <div className="mt-6 text-[#8696a0] text-[15px]">Click on a contact to view their status updates</div>
                </div>
            </div>
        </div>
    );
}
