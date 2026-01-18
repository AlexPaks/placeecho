import { MapPin, RefreshCw, Navigation } from 'lucide-react';
import { LocationData } from '../types';
import { motion } from 'framer-motion';

interface LocationCardProps {
  title: string; // Title prop is now required
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function LocationCard({
  title,
  location,
  loading,
  error,
  onRefresh,
}: LocationCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="bg-white rounded-2xl shadow-lg p-5 border border-stone-100 overflow-hidden relative"
    >
      {/* Decorative map background pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#b45309 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      ></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2 text-secondary-700">
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide uppercase">
              {title}
            </span>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`p-2 rounded-full hover:bg-stone-100 transition-colors ${
              loading ? 'animate-spin' : ''
            }`}
            aria-label="Refresh location"
          >
            <RefreshCw className="w-4 h-4 text-stone-500" />
          </button>
        </div>

        {loading ? (
          <div className="h-16 flex items-center justify-center">
            <span className="text-stone-400 text-sm">Locating you...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
            {error}
            <button
              onClick={onRefresh}
              className="block mt-2 text-red-700 underline text-xs"
            >
              Try again
            </button>
          </div>
        ) : location ? (
          <div>
            <h2 className="text-xl font-bold text-stone-800 mb-1 font-serif">
              {location.placeName}
            </h2>
            <div className="flex items-center text-stone-500 text-xs space-x-3 mt-2 font-mono">
              <span className="flex items-center">
                <Navigation className="w-3 h-3 mr-1" />
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-stone-500 text-sm italic">
            Tap refresh to find your location
          </div>
        )}
      </div>
    </motion.div>
  );
}