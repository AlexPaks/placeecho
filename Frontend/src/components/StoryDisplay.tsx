import React from 'react';
import { Story } from '../types';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Share2, Heart } from 'lucide-react';
interface StoryDisplayProps {
  story: Story;
  onExtend: () => void;
  isExtending: boolean;
}
export function StoryDisplay({
  story,
  onExtend,
  isExtending
}: StoryDisplayProps) {
  return <motion.article initial={{
    opacity: 0,
    y: 40
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.6,
    ease: 'easeOut'
  }} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100 mb-24">
      {/* Header Image/Pattern */}
      <div className="h-32 bg-secondary-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")'
      }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center space-x-2 text-xs font-medium opacity-90 mb-1">
            <span className="bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm uppercase tracking-wider">
              Generated Story
            </span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {story.readingTime} min read
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold leading-tight shadow-black drop-shadow-md">
            {story.title}
          </h2>
        </div>
      </div>

      <div className="p-6">
        <div className="prose prose-stone prose-lg font-serif leading-relaxed text-stone-700 mb-8">
          {story.content.split('\n').map((paragraph, idx) => <p key={idx} className="mb-4 first-letter:text-4xl first-letter:font-bold first-letter:text-primary-600 first-letter:mr-1 first-letter:float-left">
              {paragraph}
            </p>)}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-stone-100">
          <div className="flex space-x-2">
            <button className="p-2 text-stone-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 text-stone-400 hover:text-primary-600 transition-colors rounded-full hover:bg-primary-50">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <button onClick={onExtend} disabled={isExtending} className="flex items-center space-x-2 text-secondary-700 font-medium text-sm hover:text-secondary-800 transition-colors">
            {isExtending ? <span>Expanding story...</span> : <>
                <BookOpen className="w-4 h-4" />
                <span>Get More Details</span>
              </>}
          </button>
        </div>
      </div>
    </motion.article>;
}