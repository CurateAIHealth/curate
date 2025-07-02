'use client';

import Logo from '@/Components/Logo/page';
import { GetUserIdwithEmail } from '@/Lib/user.action';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactDOMServer from 'react-dom/server';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [mailStatusMessage, setmailStatusMessage] = useState("")
    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setmailStatusMessage("Sending Email to Update Your Password")
        try {
            const FilterUserId= await GetUserIdwithEmail(email)
            console.log("Test Filter UserId---",`${process.env.NEXT_PUBLIC_BASE_URL}/UpdatePassword?UserId=${FilterUserId}`)
            const EmailComponent = () => (

                <div
                    style={{
                        maxWidth: '400px',
                        width: '100%',
                        background: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        padding: '32px',
                        boxSizing: 'border-box',
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={`${process.env.NEXT_PUBLIC_BASE_URL}/Icons/Curate-logo.png`}
                                alt="Curate Digital AI Health"
                                width="150"
                            />
                        </div>
                        <h2
                            style={{
                                fontSize: '24px',
                                fontWeight: 700,
                                color: '#1f2937',
                                margin: 0,
                            }}
                        >
                            Update <span style={{ color: '#ec4899' }}>Curate</span>{' '}
                            <span style={{ color: '#0d9488' }}>Digital AI</span> Password
                        </h2>
                    </div>



                    <a
                        style={{
                            width: '100%',
                            backgroundColor: '#0d9488',
                            color: '#ffffff',
                            fontWeight: 600,
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                        }}
                       
                    >
                        Update Password
                    </a>

                </div>

            );

            const htmlComponent = ReactDOMServer.renderToString(<EmailComponent />);
            const SenMail = await axios.post("/api/MailSend", {
                to: email,
                subject: 'Update Password with Curate Digital AI Health ',
                html: htmlComponent,
            });

            setmailStatusMessage("Email Sent successfully!")
            router.push("/sign-in")
        } catch (err: any) {
            setmailStatusMessage("Error in Sending Mail to Update Your Password,Please Try Agin Later")
        }




    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <Logo />

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <input
                        type="email"
                        required
                        placeholder="Enter Your Registered Email to Update Password"
                        className="w-full px-4 py-3 border border-teal-500 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder-gray-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-md shadow-md transition duration-200"
                    >
                        Send Email
                    </button>
                    <div className="md:col-span-2 flex justify-center">
                        <p
                            className={`text-center font-bold w-full ${mailStatusMessage === "Email Sent successfully!"
                                ? "text-green-700"
                                : "text-[#FF0000]"
                                }`}
                        >
                            {mailStatusMessage}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
