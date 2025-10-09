'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { GetRegidterdUsers, UpdateRemainderTimer } from '@/Lib/user.action';

interface Reminder {
  id?: string;
  message: string;
  Contact: any;
  FirstName: any;
  date: string;
  time: string;
  image?: string | null;
}

interface NotificationContextType {
  showNotification: (data: Reminder) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notification, setNotification] = useState<Reminder | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const firedRemindersRef = useRef<Set<string>>(new Set());
  const [TrigerSound, setTrigerSound] = useState(false);
  const [UpdateTimeings, setUpdateTimeings] = useState(false)
  const remindersRef = useRef<Reminder[]>([]);
  remindersRef.current = reminders;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);


  useEffect(() => {
    if (TrigerSound) {
      const audio = new Audio("/Icons/NewNotificationSound.mp3");
      audio.play().catch(err => console.log("Sound play error:", err));
      setTrigerSound(false);
    }
  }, [TrigerSound]);

  const playNotificationSound = () => {
    if (audioUnlocked && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
  };

  const showNotification = (data: Reminder) => {
    setNotification(data);
    playNotificationSound();
  };

  const handleClose = () => setNotification(null);

  const formatDate = (date: string | Date | undefined | null) => {
    if (!date) return '';
    if (date instanceof Date) return date.toISOString().split('T')[0];
    return date;
  };

  const formatTime = (time: string | Date | undefined | null) => {
    if (!time) return '';
    if (time instanceof Date) return time.toTimeString().slice(0, 5);
    return time.length > 5 ? time.slice(0, 5) : time;
  };


  const fetchReminders = async () => {
    try {
      const result = await GetRegidterdUsers();
      const data: Reminder[] = result.map((each: any) => ({
        id: each.userId || '',
        FirstName: each.FirstName,
        Contact: each.ContactNumber,
        date: each.RemainderDate,
        time: each.RemainderTime,
        message: each.Message || 'Call Back Reminder',
        image: each.Image || null,
      }));
      setReminders(data);
    } catch (error) {
      console.error('Failed to fetch reminders', error);
    }
  };


  useEffect(() => {
    fetchReminders();
    const fetchInterval = setInterval(fetchReminders, 10000);
    return () => clearInterval(fetchInterval);
  }, []);


  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentDate = formatDate(now);
      const currentTime = formatTime(now);

      remindersRef.current.forEach(reminder => {
        const reminderDate = formatDate(reminder.date);
        const reminderTime = formatTime(reminder.time);
        const uniqueId = `${reminderDate}-${reminderTime}-${reminder.message}`;

        if (
          reminderDate &&
          reminderTime &&
          reminderDate === currentDate &&
          reminderTime === currentTime &&
          !firedRemindersRef.current.has(uniqueId)
        ) {
          setTrigerSound(true);
          showNotification(reminder);
          firedRemindersRef.current.add(uniqueId);
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 10000);
    return () => clearInterval(interval);
  }, []);
  const ShowRemaindTiming = () => {
    setUpdateTimeings(true)
  }


  const UpdateRemainderTime = async (id: any, each: number) => {
    console.log("Test Userid---", id)
    console.log("Test Each Timeing---", each)
    const currentTime = new Date();
    const updatedTime = new Date(currentTime.getTime() + each * 60000);
    const hours = updatedTime.getHours().toString().padStart(2, "0");
    const minutes = updatedTime.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;
    const year = updatedTime.getFullYear();
    const month = (updatedTime.getMonth() + 1).toString().padStart(2, "0");
    const day = updatedTime.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    console.log("Updated Time (+15 mins):", formattedTime);
    const UpdateReminderTimeing:any = await UpdateRemainderTimer(id, formattedTime,formattedDate)
    if(UpdateReminderTimeing.success){
        handleClose()
    }
  }
  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-white border-l-4 border-blue-500 text-gray-800 p-4 rounded-xl shadow-lg flex items-start gap-3 min-w-[250px]"
          >

            <Bell size={26} className="text-red-500 mt-1" />


            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold">
                {`${notification.message} from ${notification.FirstName}`}
              </p>

              <p className="text-xs text-gray-600">
                Immediate follow-up recommended to retain engagement
              </p>
              <div className='flex gap-2'>
                <p className="rounded-md cursor-pointer text-xs px-2 py-1 text-center w-[150px] bg-gradient-to-r from-blue-400 to-blue-500 text-white font-medium hover:from-teal-400 transition">
                  Contact {notification.Contact}
                </p>

                <p
                  className="bg-gray-400 text-white rounded-md text-center text-xs py-1 w-[150px]  cursor-pointer hover:bg-gray-500 transition"
                  onClick={ShowRemaindTiming}
                >
                  Remind Me Later
                </p>
              </div>


              {UpdateTimeings===true&& 
                <div className="flex gap-2 mt-2">
                  {[2,5, 10,15,20,25].map((each:number) => (
                    <p
                      key={each}
                      className="text-xs bg-gray-200 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-300 transition"
                      onClick={()=>UpdateRemainderTime(notification.id,each)}
                    >
                      {each} Min
                    </p>
                  ))}
                </div>
              }
            </div>


            <button
              onClick={handleClose}
              className="ml-2 p-1 hover:bg-gray-200 rounded-full transition"
            >
              <X size={18} />
            </button>
          </motion.div>

        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};
