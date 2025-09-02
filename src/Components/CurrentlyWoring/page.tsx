"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function WorkingOn({ ServiceName }: { ServiceName: any }) {
  const text = `Currently We are Working On ${ServiceName}`;
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="flex flex-col items-center justify-center h-[500px] relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      
     
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <img
            src="Icons/StayTune.jpg" 
            alt="Working illustration"
            width={380}
            height={280}
            className="drop-shadow-lg"
          />
        </motion.div>

        <div>
          

          <p className="mt-3 text-gray-600 text-sm md:text-base">
            Stay tuned! We’re building something exciting for{" "}
            <span className="font-semibold text-indigo-700">{ServiceName}</span>.
          </p>
        </div>
    
    </div>
  );
}