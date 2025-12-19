"use client";

import { useState } from "react";
import { Upload, User, CalendarDays, Droplet, Building2 } from "lucide-react";

export default function EmployRegistration() {
  

  return (
    <div className=" bg-white rounded-3xl shadow-xl p-4 border border-gray-100">
   
      <div className="text-center mb-4">
        <h2 className="text-3xl font-extrabold text-pink-500">
          Curate Employee Registration
        </h2>
        <p className="text-teal-500 mt-2">
          Register internal employees with basic organizational details
        </p>
      </div>

    
      <div className="flex justify-center ">
        <label className="cursor-pointer">
         <div
  className="
    w-20 h-20
    rounded-full
    border border-gray-300
    shadow-md
    flex items-center justify-center
    overflow-hidden
    bg-white
    transition-all duration-300
    hover:border-indigo-500
    hover:shadow-lg
  "
>
  <img
    src="/Icons/Curate-logoq.png"
    alt="Curate Company Logo"
    className="w-14 h-14 object-contain"
  />
</div>

          
        </label>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
   
        <div>
          <label className="text-sm font-medium text-gray-600">
            Employee Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter employee name"
              className="pl-10 w-full mt-1 px-4 py-2.5 rounded-xl border 
                         focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
        </div>

  
        <div>
          <label className="text-sm font-medium text-gray-600">
            Email Address
          </label>
          <input
            type="email"
            placeholder="employee@company.com"
            className="w-full mt-1 px-4 py-2.5 rounded-xl border 
                       focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

 
        <div>
          <label className="text-sm font-medium text-gray-600">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter phone number"
            className="w-full mt-1 px-4 py-2.5 rounded-xl border 
                       focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

  
        <div>
          <label className="text-sm font-medium text-gray-600">
            Blood Group
          </label>
          <div className="relative">
            <Droplet className="absolute left-3 top-3 w-5 h-5 text-red-400" />
            <select
              className="pl-10 w-full mt-1 px-4 py-2.5 rounded-xl border 
                         focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="">Select blood group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>
        </div>

     
        <div>
          <label className="text-sm font-medium text-gray-600">
            Joining Date
          </label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="date"
              className="pl-10 w-full mt-1 px-4 py-2.5 rounded-xl border 
                         focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
        </div>

   
        <div>
          <label className="text-sm font-medium text-gray-600">
            Department
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="HR / Operations / Finance"
              className="pl-10 w-full mt-1 px-4 py-2.5 rounded-xl border 
                         focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
        </div>
      </div>


      <div className="mt-6">
        <label className="text-sm font-medium text-gray-600">
          Address
        </label>
        <textarea
          rows={3}
          placeholder="Enter employee address"
          className="w-full mt-1 px-4 py-3 rounded-xl border 
                     focus:ring-2 focus:ring-indigo-400 outline-none"
        />
      </div>

   
      <div className="flex justify-center mt-8">
        <button
          className="px-12 py-3 rounded-full bg-[#1392d3] text-white 
                     font-semibold shadow-lg hover:bg-indigo-700 
                     hover:scale-105 transition-all"
        >
          Register Employee
        </button>
      </div>
    </div>
  );
}
