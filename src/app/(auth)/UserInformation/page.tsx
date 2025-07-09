'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import Logo from '@/Components/Logo/page';
import { useRouter } from 'next/navigation';

const getStatusBadge = (status: string) => {
    const styles = {
        Pending: 'bg-yellow-200 text-yellow-800',
        Verified: 'bg-green-200 text-green-800',
        Blocked: 'bg-red-200 text-red-800',
    };
    return (
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${styles[status as keyof typeof styles] || 'bg-gray-200 text-gray-700'}`}>
            {status}
        </span>
    );
};

export default function SplitUserCard() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const user = useSelector((state: any) => state.UserDetails);
    const Router = useRouter()
    const togglePassword = () => setShowPassword((prev) => !prev);
    const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

    const FormateadharNumber = (AdharNumber: any) => {
        if (!AdharNumber || AdharNumber.length !== 12) return AdharNumber;
        return `${AdharNumber.slice(0, 4)}-${AdharNumber.slice(4, 8)}-${AdharNumber.slice(8, 12)}`;
    };

    const formatField = (key: string, value: string) => {
        if (key === 'Password') {
            return (
                <div className="flex items-center gap-2">
                    <span>{showPassword ? value : '••••••••'}</span>
                    <button onClick={togglePassword} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                </div>
            );
        }

        if (key === 'ConfirmPassword') {
            return (
                <div className="flex items-center gap-2">
                    <span>{showConfirmPassword ? value : '••••••••'}</span>
                    <button onClick={toggleConfirmPassword} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                </div>
            );
        }

        if (key === 'AadharNumber') {
            return FormateadharNumber(value);
        }

        if (key === 'createdAt') {
            return new Date(value).toLocaleString('en-IN');
        }

        return value;
    };

    const leftFields = ['FirstName', 'LastName', 'Email', 'ContactNumber', 'Age', 'Location', 'userType'];
    const rightFields = ['AadharNumber', 'userId', 'VerificationStatus', 'Password', 'ConfirmPassword', 'createdAt'];
    const Revert = () => {
        Router.push("/AdminPage")
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex items-center justify-center">

            <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <div className='flex justify-end items-end cursor-pointer' >
                    <X size={16} onClick={Revert} />
                </div>

                <Logo />

                <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">👤{`${user.FirstName}'s Profile`}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">📄 Basic Info</h2>
                        <table className="w-full table-auto">
                            <tbody>
                                {leftFields.map((field) => (
                                    <tr key={field} className="border-b last:border-b-0 dark:border-gray-700">
                                        <td className="py-3 pr-3 text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap capitalize">
                                            {field.replace(/([A-Z])/g, ' $1')}
                                        </td>
                                        <td className="py-3 text-sm text-gray-800 dark:text-gray-100 break-all">
                                            {formatField(field, user[field as keyof typeof user])}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">🔒 Sensitive Info</h2>
                        <table className="w-full table-auto">
                            <tbody>
                                {rightFields.map((field) => (
                                    <tr key={field} className="border-b last:border-b-0 dark:border-gray-700">
                                        <td className="py-3 pr-3 text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap capitalize">
                                            {field.replace(/([A-Z])/g, ' $1')}
                                        </td>
                                        <td className="py-3 text-sm text-gray-800 dark:text-gray-100 break-all">
                                            {field === 'VerificationStatus'
                                                ? getStatusBadge(user[field])
                                                : formatField(field, user[field as keyof typeof user])}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
