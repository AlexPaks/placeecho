export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}
export interface LocationData {
  latitude: number;
  longitude: number;
  placeName: string;
  address?: string;
  timestamp: number;
}
export interface StorySettings {
  length: 'short' | 'medium' | 'long';
  style: 'historical' | 'adventure' | 'romantic' | 'mysterious' | 'educational';
}
export interface VoiceSettings {
  speed: number;
  gender: 'male' | 'female' | 'neutral';
  enabled: boolean;
}
export interface Story {
  id: string;
  title: string;
  content: string;
  location: LocationData;
  createdAt: number;
  wordCount: number;
  readingTime: number; // in minutes
  imageUrl?: string;
}
export interface AppSettings {
  darkMode: boolean;
  language: string;
  notifications: boolean;
}