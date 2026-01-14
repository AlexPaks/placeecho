import { useState, useEffect } from 'react'; // Removed unused React import
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Wand2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGeolocation } from '../hooks/useGeolocation';
import { useCamera } from '../hooks/useCamera';
import { useStoryGenerator } from '../hooks/useStoryGenerator';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { LocationCard } from '../components/LocationCard';
import { CameraCapture } from '../components/CameraCapture';
import { StoryDisplay } from '../components/StoryDisplay';
import { AudioPlayer } from '../components/AudioPlayer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SettingsDrawer } from '../components/SettingsDrawer';
import { StorySettings, VoiceSettings } from '../types';

export function MainStoryScreen() {
  const {
    user,
    logout
  } = useAuth();
  const {
    location,
    loading: locationLoading,
    error: locationError,
    refreshLocation
  } = useGeolocation();
  const {
    photo,
    capturePhoto,
    removePhoto
  } = useCamera();
  const {
    story,
    loading: storyLoading,
    generateStory,
    extendStory
  } = useStoryGenerator();
  const {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    setRate
  } = useTextToSpeech();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [storySettings, setStorySettings] = useState<StorySettings>({
    length: 'medium',
    style: 'adventure'
  });
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    speed: 1,
    gender: 'neutral',
    enabled: true
  });
  // Update TTS rate when settings change
  useEffect(() => {
    setRate(voiceSettings.speed);
  }, [voiceSettings.speed, setRate]);
  const handleGenerateStory = async () => {
    if (location) {
      stop(); // Stop any current audio
      await generateStory(location, storySettings, photo);
    }
  };
  const handlePlayStory = () => {
    if (story) {
      if (isPaused) {
        resume();
      } else {
        speak(story.content);
      }
    }
  };
  return <div className="min-h-screen bg-[#fdfbf7] pb-20">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setIsDrawerOpen(true)} className="p-2 -ml-2 hover:bg-stone-100 rounded-full transition-colors" aria-label="Open menu">
          <Menu className="w-6 h-6 text-stone-700" />
        </button>

        <h1 className="text-lg font-serif font-bold text-stone-800">
          Story Explorer
        </h1>

        <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-200 border border-stone-200">
          {user?.photoURL ? <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-stone-500 text-xs font-bold">
              {user?.name.charAt(0)}
            </div>}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Location Section */}
        <section>
          <LocationCard location={location} loading={locationLoading} error={locationError} onRefresh={refreshLocation} />
        </section>

        {/* Camera Section - Only show if no story yet or if we want to regenerate */}
        {!story && <motion.section initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.2
      }}>
            <CameraCapture photo={photo} onCapture={capturePhoto} onRemove={removePhoto} />
          </motion.section>}

        {/* Generate Button */}
        {!story && !storyLoading && <motion.button initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: 0.3
      }} onClick={handleGenerateStory} disabled={!location || locationLoading} className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
            <Wand2 className="w-5 h-5" />
            <span>Generate My Story</span>
          </motion.button>}

        {/* Loading State */}
        {storyLoading && <LoadingSpinner text="Weaving local legends together..." />}

        {/* Story Display */}
        <AnimatePresence>
          {story && !storyLoading && <StoryDisplay story={story} onExtend={extendStory} isExtending={storyLoading} // Reuse loading state for extension
        />}
        </AnimatePresence>
      </main>

      {/* Audio Player - Fixed at bottom */}
      <AnimatePresence>
        {story && !storyLoading && <AudioPlayer isSpeaking={isSpeaking} isPaused={isPaused} onPlay={handlePlayStory} onPause={pause} onStop={stop} />}
      </AnimatePresence>

      {/* Settings Drawer */}
      <SettingsDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} user={user} onLogout={logout} storySettings={storySettings} onUpdateStorySettings={setStorySettings} voiceSettings={voiceSettings} onUpdateVoiceSettings={setVoiceSettings} />
    </div>;
}