import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import ProfilePanel from '../components/ProfilePanel.jsx';

const MainChat = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-appBg relative z-0">
            {/* Thematic Accent Header similar to Desktop applications */}
            <div className="hidden md:block absolute top-0 left-0 w-full h-[130px] bg-primary z-[-1]"></div>

            {/* Application Shell Wrapper */}
            <div className="flex w-full h-full md:py-6 md:px-4 lg:py-8 lg:px-8 xl:max-w-[1600px] xl:mx-auto">
                <div className="w-full h-full bg-panelBg md:rounded-lg shadow-2xl flex relative overflow-hidden flex-row border border-gray-300/50">
                    <ProfilePanel isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
                    <Sidebar onOpenProfile={() => setIsProfileOpen(true)} />
                    <ChatWindow />
                </div>
            </div>
        </div>
    );
};

export default MainChat;
