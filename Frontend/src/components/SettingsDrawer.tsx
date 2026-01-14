import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Moon, Globe, Shield, Info, LogOut, Volume2 } from 'lucide-react';
import { User as UserType, StorySettings, VoiceSettings } from '../types';
interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onLogout: () => void;
  storySettings: StorySettings;
  onUpdateStorySettings: (settings: StorySettings) => void;
  voiceSettings: VoiceSettings;
  onUpdateVoiceSettings: (settings: VoiceSettings) => void;
}
export function SettingsDrawer({
  isOpen,
  onClose,
  user,
  onLogout,
  storySettings,
  onUpdateStorySettings,
  voiceSettings,
  onUpdateVoiceSettings
}: SettingsDrawerProps) {
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />

          {/* Drawer */}
          <motion.div initial={{
        x: '-100%'
      }} animate={{
        x: 0
      }} exit={{
        x: '-100%'
      }} transition={{
        type: 'spring',
        damping: 25,
        stiffness: 200
      }} className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-stone-800 font-serif">
                  Settings
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* User Profile */}
              <div className="mb-8 p-4 bg-stone-50 rounded-xl flex items-center space-x-4">
                {user?.photoURL ? <img src={user.photoURL} alt={user.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" /> : <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <User className="w-6 h-6" />
                  </div>}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 truncate">
                    {user?.name || 'Guest'}
                  </p>
                  <p className="text-xs text-stone-500 truncate">
                    {user?.email || 'Sign in to save stories'}
                  </p>
                </div>
              </div>

              {/* Story Settings */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">
                  Story Preferences
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Length
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['short', 'medium', 'long'] as const).map(len => <button key={len} onClick={() => onUpdateStorySettings({
                    ...storySettings,
                    length: len
                  })} className={`py-2 text-sm rounded-lg border transition-all ${storySettings.length === len ? 'bg-primary-50 border-primary-500 text-primary-700 font-medium' : 'border-stone-200 text-stone-600 hover:border-stone-300'}`}>
                          {len.charAt(0).toUpperCase() + len.slice(1)}
                        </button>)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Style
                    </label>
                    <select value={storySettings.style} onChange={e => onUpdateStorySettings({
                  ...storySettings,
                  style: e.target.value as any
                })} className="w-full p-2.5 bg-white border border-stone-200 rounded-lg text-stone-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                      <option value="historical">Historical</option>
                      <option value="adventure">Adventure</option>
                      <option value="romantic">Romantic</option>
                      <option value="mysterious">Mysterious</option>
                      <option value="educational">Educational</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Voice Settings */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">
                  Voice & Audio
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4 text-stone-500" />
                      <span className="text-sm text-stone-700">
                        Speech Speed
                      </span>
                    </div>
                    <span className="text-xs font-mono bg-stone-100 px-2 py-1 rounded">
                      {voiceSettings.speed}x
                    </span>
                  </div>
                  <input type="range" min="0.5" max="2" step="0.25" value={voiceSettings.speed} onChange={e => onUpdateVoiceSettings({
                ...voiceSettings,
                speed: parseFloat(e.target.value)
              })} className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
                </div>
              </div>

              {/* App Settings */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">
                  App Settings
                </h3>
                <div className="space-y-1">
                  <button className="w-full flex items-center justify-between p-3 hover:bg-stone-50 rounded-lg transition-colors text-left">
                    <div className="flex items-center space-x-3 text-stone-600">
                      <Moon className="w-4 h-4" />
                      <span className="text-sm">Dark Mode</span>
                    </div>
                    <div className="w-8 h-4 bg-stone-200 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm absolute left-0 top-0 transform transition-transform"></div>
                    </div>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 hover:bg-stone-50 rounded-lg transition-colors text-stone-600 text-left">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">Language</span>
                  </button>
                </div>
              </div>

              {/* Footer Links */}
              <div className="border-t border-stone-100 pt-6 space-y-3">
                <button className="flex items-center space-x-2 text-xs text-stone-500 hover:text-stone-800">
                  <Info className="w-3 h-3" />
                  <span>About Story Explorer</span>
                </button>
                <button className="flex items-center space-x-2 text-xs text-stone-500 hover:text-stone-800">
                  <Shield className="w-3 h-3" />
                  <span>Privacy Policy</span>
                </button>

                <button onClick={onLogout} className="w-full mt-6 flex items-center justify-center space-x-2 p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-medium text-sm">
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}