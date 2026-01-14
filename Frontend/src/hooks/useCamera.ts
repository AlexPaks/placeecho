import { useState, useCallback } from 'react';
export function useCamera() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const capturePhoto = useCallback((file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Create object URL for preview
    try {
      const objectUrl = URL.createObjectURL(file);
      setPhoto(objectUrl);
      setError(null);
    } catch (err) {
      setError('Failed to process image');
      console.error(err);
    }
  }, []);
  const removePhoto = useCallback(() => {
    if (photo) {
      URL.revokeObjectURL(photo);
      setPhoto(null);
    }
  }, [photo]);
  return {
    photo,
    capturePhoto,
    removePhoto,
    error
  };
}