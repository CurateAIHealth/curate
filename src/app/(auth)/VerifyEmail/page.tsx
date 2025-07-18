'use client'
import Logo from "@/Components/Logo/page";
import { GetUserInformation, UpdateEmailVerification } from "@/Lib/user.action";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";

export default function () {
    const [token, setToken] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const router = useRouter()
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setToken(params.get('token') || '');
    }, []);

    const handleVerifyEmail = useCallback(async () => {


        try {
            const result: any = await UpdateEmailVerification(token)
            if (result.success) {
                setSuccess('Password updated successfully. Redirecting to Sign-in page....');

                const EmailComponent = () => (
                    <div>
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={`${process.env.NEXT_PUBLIC_BASE_URL}/Icons/Curate-logo.png`}
                                alt="Curate Digital AI Health"
                                width="150"
                            />
                        </div>
                        <p>Dear User,</p>
                        <p>
                            Thank you for registering with <strong>Curate Digital AI Health</strong>.
                        </p>
                        <p>
                            We have received your details. Our team will review the information and contact you if anything else is required.
                        </p>
                        <p>
                            For help, email <a href="mailto:support@curatedigital.ai">support@curatedigital.ai</a>.
                        </p>
                        <p>
                            Best regards,
                            <br />
                            Curate Digital AI Health Team
                        </p>
                    </div>
                );

                const ProfileInformation = await GetUserInformation(token)
                const UserEmail = ProfileInformation?.Email
                const htmlComponent = ReactDOMServer.renderToString(<EmailComponent />);
                await axios.post('/api/MailSend', {
                    to: UserEmail,
                    subject: 'Curate Digital AI Health Succesful Registration!',
                    html: htmlComponent,
                });
                setTimeout(() => {
                    router.push('/sign-in')
                }, 2500);
            } else {
                setError(result?.message || 'Update failed.');
            }
        } catch (err) {

            setError('Something went wrong.');
        }
    }, [token]);
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-100">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
                <Logo />
                <h2 className="text-2xl font-semibold mb-6">
                    Verify <span className="text-pink-500">Your</span>{' '}
                    <span className="text-teal-600">Email</span>
                </h2>






                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

                <button
                    onClick={handleVerifyEmail}
                    className="w-full py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all disabled:opacity-60"

                >
                    Verify Email
                </button>
            </div>
        </div>
    )
}