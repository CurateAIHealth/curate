'use client';

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CircleUser,
  Mail,
  ShieldCheck,
  KeyRound,
  Clock,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  profileName?: string;
  ProfileEmail: any;
  Designation: any;
}

export default function ProfileDrawer({
  open,
  onClose,
  profileName = "Admin User",
  ProfileEmail,
  Designation,
}: Props) {

  /* ------------------ NEW STATE ------------------ */
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  /* ------------------ VALIDATION ------------------ */
  const passwordRules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const isStrongPassword = Object.values(passwordRules).every(Boolean);

  const handlePasswordSave = () => {
    if (!isStrongPassword) {
      setError("Password does not meet security requirements");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    // 🔐 Call your API / Firebase / Appwrite here
    console.log("Update password:", password);

    setShowPasswordForm(false);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-[#0b1220]/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="
              fixed right-0 top-0 z-50
              h-full w-full sm:w-[480px]
              bg-[#0f172a]
              text-slate-100
            "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <span className="text-sm uppercase tracking-widest text-slate-400">
                User Identity
              </span>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {/* Identity */}
            <div className="px-8 py-10 border-b border-white/10">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-2xl bg-white/10 flex items-center justify-center">
                  <CircleUser size={36} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{profileName}</h2>
                  <p className="text-slate-400">{Designation}</p>
                  <div className="mt-3 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck size={12} /> Active
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-8 space-y-10 text-sm overflow-y-auto">

              {/* Email */}
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                  Contact
                </div>
                <div className="flex items-center gap-4">
                  <Mail size={18} className="text-slate-400" />
                  <span>{ProfileEmail}</span>
                </div>
              </div>

              
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-500 mb-4">
                  Security
                </div>

                {/* Password Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <KeyRound size={18} className="text-slate-400" />
                    <span>Password</span>
                  </div>
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    {showPasswordForm ? "Cancel" : "Change"}
                  </button>
                </div>

                {/* PASSWORD FORM */}
                <AnimatePresence>
                  {showPasswordForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      {/* New Password */}
                      <div className="relative">
                        <input
                          type={showPwd ? "text" : "password"}
                          placeholder="New Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd(!showPwd)}
                          className="absolute right-3 top-3 text-slate-400"
                        >
                          {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      {/* Confirm Password */}
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none"
                      />

                      {/* Rules */}
                      <ul className="text-xs grid grid-cols-2 gap-2 text-slate-400">
                        <li className={passwordRules.length ? "text-emerald-400" : ""}>• 8+ characters</li>
                        <li className={passwordRules.upper ? "text-emerald-400" : ""}>• Uppercase</li>
                        <li className={passwordRules.lower ? "text-emerald-400" : ""}>• Lowercase</li>
                        <li className={passwordRules.number ? "text-emerald-400" : ""}>• Number</li>
                        <li className={passwordRules.special ? "text-emerald-400" : ""}>• Special char</li>
                      </ul>

                      {error && (
                        <p className="text-xs text-red-400">{error}</p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handlePasswordSave}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium"
                        >
                          Update Password
                        </button>
                        <button
                          onClick={() => setShowPasswordForm(false)}
                          className="px-4 py-2 border border-white/20 rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
<div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-slate-400" />
                      <span>Last Login</span>
                    </div>
                    <span className="text-slate-400">
                      Today · {new Date().toLocaleTimeString()}
                    </span>
                  </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
