// Common interfaces used across the application

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isSaved?: boolean;
}

export interface Exhibition {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
  theme?: string | null;
  cost: string;
  start: string;
  end: string;
  link: string;
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  dimensions: string;
  description: string;
  image: string;
  tags: string[];
  price?: string;
}

export interface Match {
  id: string;
  exhibition1: Exhibition;
  exhibition2: Exhibition;
  winner: Exhibition | null;
  round: number;
}

// Component Props Interfaces
export interface ChatModuleProps {
  onArtworkRecommendation?: (artwork: unknown) => void;
  externalMessage?: string;
  onMessageSent?: () => void;
  onSavedMessagesChange?: (count: number, messages: Message[]) => void;
}

export interface ExhibitionGalleryProps {
  exhibitions: Exhibition[];
  onClose: () => void;
}

export interface ExhibitionWorldCupProps {
  exhibitions: Exhibition[];
  onClose: () => void;
  onSendMessage?: (msg: string) => void;
}

export interface ComparisonViewProps {
  artworks: Artwork[];
  onClose: () => void;
}