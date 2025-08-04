'use client';

import { useState, useCallback } from 'react';

import axios from 'axios';

import Logo from '@/Components/Logo/page';
import DoctorForm from '@/Components/DocterForm/page';
import NurseForm from '@/Components/NurseForm/page';
import PatientForm from '@/Components/PatientForm/page';
import PatientFamilyForm from '@/Components/PatientFamilyForm/page';
import UserTypeSelector from '@/Components/UserTypeSelector/page';
import HealthcareAssistantForm from '@/Components/HCA/page';
import OrganizationForm from '@/Components/Organisation/page';

export default function RegisterPage() {
  const [userType, setUserType] = useState<string>('');



  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-white to-green-100 md:p-2 p-6">
      <section className="w-full max-w-xl bg-white/80 backdrop-blur-md border border-white/40 rounded-3xl shadow-xl overflow-hidden">
        <div className="pl-4 pr-4 pb-2">
          <Logo />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800 leading-tight mb-4">
  <div>Register with</div>
  <div> 
  <span style={{ color: '#50c896' }}> AI Digital</span>{' '}
  <span style={{ color: '#50c896' }}>Health</span>
</div>

</h2>

     
       
          <UserTypeSelector userType={userType} setUserType={setUserType} />

         
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 text-sm text-gray-700 relative overflow-visible">
            {userType === 'doctor' && <DoctorForm  />}
            {userType === 'nurse' && <NurseForm  />}
            {userType === 'patient' && <PatientForm  />}
            {userType === 'Organisation' && <OrganizationForm/>}
            { userType ===  'Healthcare Assistant'&&<HealthcareAssistantForm/>}
          </div>
        </div>
      </section>
    </main>
  );
}
