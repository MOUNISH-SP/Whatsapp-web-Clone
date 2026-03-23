import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegister) await register(username, password);
            else await login(username, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred connecting to server');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#d1d7db] relative z-0 items-center justify-center font-sans tracking-wide">
            {/* Header branding band like WhatsApp Web */}
            <div className="absolute top-0 w-full h-[222px] bg-[#00a884] z-[-1]"></div>
            
            {/* Container mapping */}
            <div className="flex items-center gap-3 absolute top-9 left-16 text-white md:flex hidden">
               <svg viewBox="0 0 24 24" width="34" height="34" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
               <h1 className="text-sm font-semibold tracking-widest uppercase">WhatsApp Web Clone</h1>
            </div>

            <div className="bg-white shadow-[0_17px_50px_0_rgba(11,20,26,.19)] w-full max-w-[1000px] h-[75vh] min-h-[500px] rounded-sm flex overflow-hidden">
                <div className="hidden md:flex flex-col p-14 w-1/2 justify-center border-r border-gray-100 bg-[#f9f9f9]/10 relative">
                    <h2 className="text-[28px] font-light text-[#41525d] mb-6 leading-tight">Use WhatsApp Clone securely on your computer</h2>
                    <ol className="text-[#3b4a54] text-[18px] leading-10 font-normal space-y-2 mb-10 list-decimal pl-5">
                       <li>Verify your credentials natively here.</li>
                       <li>Select a user via the left sidebar.</li>
                       <li>Send end-to-end web socket messages.</li>
                    </ol>
                    <div className="text-[#8696a0] text-sm mt-auto">Need help to get started?</div>
                </div>

                <div className="flex-1 p-10 flex flex-col items-center justify-center bg-white relative">
                    <div className="w-full max-w-[320px]">
                        <h2 className="text-[24px] mb-2 font-normal text-center text-[#41525d]">
                            {isRegister ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-sm text-center text-[#8696a0] mb-8 font-medium">Verify your assignment credentials natively</p>

                        {error && <div className="bg-red-50 text-red-500 p-3 mb-6 rounded-md text-[14px] text-center border-l-4 border-red-500 font-medium">{error}</div>}
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <input 
                                className="px-4 py-[14px] border-b-2 border-gray-200 outline-none focus:border-[#00a884] transition-colors text-[16px] text-[#111b21] bg-gray-50/50 rounded-t-md" 
                                placeholder="Username" 
                                value={username} 
                                onChange={e => setUsername(e.target.value)} 
                                required 
                            />
                            <input 
                                className="px-4 py-[14px] border-b-2 border-gray-200 outline-none focus:border-[#00a884] transition-colors text-[16px] text-[#111b21] bg-gray-50/50 rounded-t-md" 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                            />
                            <button className="bg-[#00a884] hover:bg-[#008f6f] text-white py-3 mt-4 rounded-full font-medium transition-colors shadow-sm text-[15px] tracking-wide active:scale-95 duration-150">
                                {isRegister ? 'Sign Up' : 'Log In'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-[15px] text-[#8696a0]">
                            {isRegister ? 'Already verified yourself?' : "Need an identity profile?"}
                            <button onClick={() => setIsRegister(!isRegister)} className="text-[#00a884] font-medium ml-2 hover:underline">
                                {isRegister ? 'Login Instead' : 'Register Here'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
