import React from 'react';
import { Play, Pause, Square, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
interface AudioPlayerProps {
  isSpeaking: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}
export function AudioPlayer({
  isSpeaking,
  isPaused,
  onPlay,
  onPause,
  onStop
}: AudioPlayerProps) {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${isSpeaking && !isPaused ? 'bg-primary-100 text-primary-600' : 'bg-stone-100 text-stone-400'}`}>
            <Volume2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-stone-800">
              Narrating Story
            </span>
            <span className="text-xs text-stone-500">
              {isSpeaking && !isPaused ? 'Playing...' : isPaused ? 'Paused' : 'Ready to play'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isSpeaking && !isPaused ? <button onClick={onPause} className="w-12 h-12 flex items-center justify-center bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors active:scale-95" aria-label="Pause narration">
              <Pause className="w-6 h-6 fill-current" />
            </button> : <button onClick={onPlay} className="w-12 h-12 flex items-center justify-center bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors active:scale-95 relative overflow-hidden" aria-label="Play narration">
              <Play className="w-6 h-6 fill-current ml-1" />
              {/* Subtle pulse effect when ready but not playing */}
              {!isSpeaking && <span className="absolute inset-0 rounded-full animate-ping bg-white opacity-20"></span>}
            </button>}

          {isSpeaking && <button onClick={onStop} className="p-2 text-stone-400 hover:text-stone-600 transition-colors" aria-label="Stop narration">
              <Square className="w-5 h-5 fill-current" />
            </button>}
        </div>
      </div>
    </motion.div>;
}