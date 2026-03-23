import React, { useState, useEffect } from 'react';

export default function CallOverlay({ type, user, receiver, onClose }) {
    const [duration, setDuration] = useState(0);
    const [status, setStatus] = useState('Calling...');
    
    useEffect(() => {
        let interval;
        const to = setTimeout(() => {
            setStatus('0:00');
            interval = setInterval(() => setDuration(p => p + 1), 1000);
        }, 3000); // Simulate pickup after 3 seconds
        
        return () => {
            clearTimeout(to);
            clearInterval(interval);
        }
    }, []);

    const formatDuration = (d) => {
        if(status === 'Calling...') return status;
        const m = Math.floor(d / 60);
        const s = (d % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 animate-in zoom-in duration-300 backdrop-blur-sm">
            <div className="bg-[#111b21] w-full max-w-[400px] h-[600px] rounded-2xl flex flex-col items-center justify-between py-10 shadow-2xl overflow-hidden relative border border-white/10">
                {type === 'video' && (
                    <div className="absolute inset-0 z-0 bg-zinc-800">
                        {/* Placeholder fake video feed box */}
                        <div className="absolute top-4 right-4 w-28 h-40 bg-zinc-900 rounded-xl overflow-hidden shadow-lg border-2 border-zinc-700/50">
                             <div className="flex items-center justify-center h-full text-zinc-600 bg-zinc-900">Me</div>
                        </div>
                   </div>
                )}
                
                {/* Header Profile Layer */}
                <div className="z-10 flex flex-col items-center gap-4 mt-8">
                    <div className="relative">
                        <div className={`w-28 h-28 bg-[#dfe5e7] rounded-full flex items-center justify-center text-[#54656f] font-semibold text-5xl shadow-xl ${status === 'Calling...' && 'animate-pulse'}`}>
                             {receiver.username.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl text-[#e9edef] font-medium tracking-tight bg-black/20 px-4 py-1 rounded-full">{receiver.username}</div>
                        <div className="text-[#8696a0] mt-2 drop-shadow-md text-[17px] font-medium tracking-wide">
                            {type === 'video' ? 'WhatsApp Video' : 'WhatsApp Audio'} • {formatDuration(duration)}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="z-10 flex items-center gap-6 mb-8 bg-black/30 w-[85%] rounded-3xl p-4 backdrop-blur-md justify-center shadow-xl border border-white/5">
                    <button className="w-14 h-14 bg-white/10 hover:bg-white/20 transition-all rounded-full flex items-center justify-center text-white p-3">
                        {/* Speaker/Video toggle */}
                        {type === 'audio' ? (
                             <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>
                        ) : (
                             <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"></path></svg>
                        )}
                    </button>
                    <button className="w-14 h-14 bg-white/10 hover:bg-white/20 transition-all rounded-full flex items-center justify-center text-white p-3">
                        {/* Mute */}
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path></svg>
                    </button>
                    <button onClick={onClose} className="w-[68px] h-[68px] bg-red-500 hover:bg-red-600 transition-all rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                        {/* End Call */}
                        <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36" className="rotate-[135deg]"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
