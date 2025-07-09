'use client';

import Logo from '@/Components/Logo/page';
import { GetUserIdwithEmail } from '@/Lib/user.action';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useCallback, memo } from 'react';
import ReactDOMServer from 'react-dom/server';


const EmailComponent = memo(({ UpdatedFilterUserId }: { UpdatedFilterUserId: string }) => (
  <div
    style={{
      maxWidth: '400px',
      width: '100%',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      padding: '32px',
      boxSizing: 'border-box',
      textAlign: 'center',
      margin: '0 auto', 
      fontFamily: 'Arial, sans-serif',
    }}
  >
    <div style={{ marginBottom: '24px' }}>
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/Icons/Curate-logo.png`}
        alt="Curate Digital AI Health"
        width="150"
        style={{ display: 'block', margin: '0 auto' }}
      />
      <h2
        style={{
          fontSize: '22px',
          fontWeight: 700,
          color: '#1f2937',
          margin: '20px 0 10px',
        }}
      >
        Update{' '}
        <span style={{ color: '#ec4899' }}>Curate</span>{' '}
        <span style={{ color: '#0d9488' }}>Digital AI</span> Password
      </h2>
    </div>

    <a
      href={`${process.env.NEXT_PUBLIC_BASE_URL}/UpdatePassword?token=${UpdatedFilterUserId}`}
      style={{
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#0d9488',
        color: '#ffffff',
        fontWeight: 600,
        borderRadius: '8px',
        fontSize: '16px',
        textDecoration: 'none', 
        marginTop: '10px',
      }}
    >
      Update Password
    </a>
  </div>
));


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [mailStatusMessage, setMailStatusMessage] = useState('Eand Email');
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setMailStatusMessage('Sending email to update your password...');
      try {
        const FilterUserId = await GetUserIdwithEmail(email);

        const htmlComponent = ReactDOMServer.renderToString(
          <EmailComponent UpdatedFilterUserId={FilterUserId} />
        );

        await axios.post('/api/MailSend', {
          to: email,
          subject: 'Update Password with Curate Digital AI Health',
          html: htmlComponent,
        });

        
        alert("Check Your Email to Update Your Password")
        
        setMailStatusMessage('Email sent successfully!');
        // router.push('/sign-in');
      } catch (error) {
  ;
        setMailStatusMessage('Error sending email. Please try again later.');
      }
    },
    [email, router]
  );

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
            {mailStatusMessage}
          </button>
          {/* {mailStatusMessage && (
            <div className="text-center font-bold w-full">
              <p className={mailStatusMessage.includes('success') ? 'text-green-700' : 'text-red-600'}>
                {mailStatusMessage}
              </p>
            </div>
          )} */}
        </form>
      </div>
    </div>
  );
}
