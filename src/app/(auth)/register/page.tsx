'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
    const router = useRouter();
    const [userType, setUserType] = useState<'patient' | 'doctor' | null>(null);

    const handleSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUserType(e.target.value as 'patient' | 'doctor');
    }, []);

    const handleRegister = useCallback(() => {
        router.push(`/register?type=${userType}`);
    }, [router, userType]);

    const handleSignIn = useCallback(() => {
        router.push('/sign-in');
    }, [router]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-teal-100 p-4">
            <section className="w-full max-w-md md:max-w-lg bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-fade-in">


                <div className="flex justify-center">
                    <Image
                        src="/Icons/Curate-logo.png"
                        alt="Curate AI Health Logo"
                        width={80}
                        height={80}
                        priority
                        className="rounded-full shadow-md transition-transform duration-300 hover:scale-110"
                    />
                </div>


                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-snug">
                    Register with <span className="text-teal-600">Curate Ai Health</span>
                </h1>


                <div className="flex justify-center gap-6 text-gray-700 font-medium text-sm sm:text-base">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="userType"
                            value="patient"
                            onChange={handleSelect}
                            checked={userType === 'patient'}
                            className="accent-teal-600"
                        />
                        <span>Patient</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="userType"
                            value="doctor"
                            onChange={handleSelect}
                            checked={userType === 'doctor'}
                            className="accent-teal-600"
                        />
                        <span>Doctor</span>
                    </label>
                </div>
                {userType === null && <div className="text-sm text-gray-700 mt-2">
                    Already registered?{' '}
                    <button
                        onClick={handleSignIn}
                        className="text-teal-600 font-semibold hover:underline"
                    >
                        Sign In
                    </button>
                </div>}

                {userType && (
                    <>
                        <div className="text-left space-y-3">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                            />

                            {userType === 'patient' ? (
                                <input
                                    type="number"
                                    placeholder="Age"
                                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                                />
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Specialization"
                                        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                                    />
                                    <input
                                        type="text"
                                        placeholder="License Number"
                                        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                                    />
                                </>
                            )}
                        </div>


                        <button
                            onClick={handleRegister}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-full shadow-lg transition duration-300 mt-4"
                        >
                            Register as {userType.charAt(0).toUpperCase() + userType.slice(1)}
                        </button>

                        <div className="text-sm text-gray-700 mt-2">
                            Already registered?{' '}
                            <button
                                onClick={handleSignIn}
                                className="text-teal-600 font-semibold hover:underline"
                            >
                                Sign In
                            </button>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}
