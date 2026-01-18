import { useState, useCallback } from 'react';
import { Story, LocationData, StorySettings } from '../types';
import config from '../config';

interface UseStoryGeneratorReturn {
  story: Story | null;
  loading: boolean;
  error: string | null;
  generateStory: (location: LocationData, settings: StorySettings, photo?: string | null) => Promise<void>;
  extendStory: () => Promise<void>;
}
const API_BASE =config.API_BASE_URL;

export function useStoryGenerator(): UseStoryGeneratorReturn {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateStory = useCallback(async (location: LocationData, settings: StorySettings, photo?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      if (config.TEST_MODE) {
        // Dummy API response for test mode
        const dummyStory: Story = {
          id: Date.now().toString(),
          title: `Test Story for ${location.placeName}`,
          content: `This is a dummy story generated for ${location.placeName} in test mode.`,
          location,
          createdAt: Date.now(),
          wordCount: 10,
          readingTime: 1,
          imageUrl: photo || undefined,
        };
        setStory(dummyStory);
      } else {
        // Real API call
        const response = await fetch(`${API_BASE}/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ location, settings, photo }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate story');
        }

        const newStory: Story = await response.json();
        setStory(newStory);
      }
    } catch (err) {
      setError('Failed to generate story. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  const extendStory = useCallback(async () => {
    if (!story) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const extension = `\n\nDigging deeper into the archives, we find that in 1923, a mysterious artifact was discovered just beneath the foundation of the main structure. Archaeologists were baffled by its origin, as it didn't match any known civilization in the region. Some say it was reburied to prevent a curse, while others believe it was stolen. The truth remains buried, perhaps waiting for someone with keen eyes—like yours—to uncover it. The energy of this place is undeniable, a magnetic pull that has drawn explorers, artists, and visionaries for generations.`;
      const extendedStory = {
        ...story,
        content: story.content + extension,
        wordCount: (story.content + extension).split(' ').length,
        readingTime: Math.ceil((story.content + extension).split(' ').length / 200)
      };
      setStory(extendedStory);
    } catch (err) {
      setError('Failed to extend story.');
    } finally {
      setLoading(false);
    }
  }, [story]);
  return {
    story,
    loading,
    error,
    generateStory,
    extendStory
  };
}