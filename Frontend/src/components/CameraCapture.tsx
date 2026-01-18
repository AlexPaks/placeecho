import React, { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractGpsFromImage } from '../utils/extractGpsFromImage';
import { reverseGeocode } from '../utils/reverseGeocode';

interface CameraCaptureProps {
  photo: string | null;
  onCapture: (file: File) => void;
  onRemove: () => void;
}

export function CameraCapture({ photo, onCapture, onRemove }: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoLocation, setPhotoLocation] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const gpsData = await extractGpsFromImage(file);
      if (gpsData) {
        const placeName = await reverseGeocode(gpsData.lat, gpsData.lng);
        setPhotoLocation(placeName);
        onCapture(file);
      } else {
        setPhotoLocation(null);
      }
    }
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <AnimatePresence mode="wait">
        {photo ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative rounded-2xl overflow-hidden shadow-md aspect-video bg-stone-100"
          >
            <img src={photo} alt="Uploaded photo" className="w-full h-full object-cover" />
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
              aria-label="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              {photoLocation ? (
                <p className="text-white text-xs font-medium">{photoLocation}</p>
              ) : (
                <p className="text-white text-xs">No GPS data in this photo</p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={triggerCamera}
            className="w-full flex items-center justify-center space-x-3 py-4 border-2 border-dashed border-stone-300 rounded-2xl text-stone-500 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all group"
          >
            <div className="bg-stone-100 p-2 rounded-full group-hover:bg-white transition-colors">
              <Camera className="w-5 h-5" />
            </div>
            <span className="font-medium">Add a photo for better context</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}