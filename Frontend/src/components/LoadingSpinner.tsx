import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
interface LoadingSpinnerProps {
  text?: string;
}
export function LoadingSpinner({
  text = 'Loading...'
}: LoadingSpinnerProps) {
  return <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <motion.div className="absolute inset-0 text-primary-500" animate={{
        rotate: 360
      }} transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear'
      }}>
          <svg viewBox="0 0 100 100" className="w-16 h-16">
            <path d="M 50 50 m -40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
          </svg>
        </motion.div>
        <motion.div className="relative z-10 bg-white rounded-full p-3 shadow-md" animate={{
        scale: [1, 1.1, 1]
      }} transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}>
          <Sparkles className="w-8 h-8 text-primary-600" />
        </motion.div>
      </div>
      <motion.p className="text-stone-600 font-serif italic text-lg" animate={{
      opacity: [0.5, 1, 0.5]
    }} transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }}>
        {text}
      </motion.p>
    </div>;
}