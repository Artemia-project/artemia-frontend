import React, { useState, useMemo, useCallback } from 'react';
import { ChatModule } from '@/components/ChatModule';
import { ComparisonView } from '@/components/ComparisonView';
import { ExhibitionWorldCup } from '@/components/ExhibitionWorldCup';
import { ExhibitionGallery } from '@/components/ExhibitionGallery';
import { HeroSection } from '@/components/Index/HeroSection';
import { SavedMessagesModal } from '@/components/Index/SavedMessagesModal';
import { exhibitionsData } from '@/data/exhibitions';
import { UI_CONSTANTS } from '@/constants';
import { Message, Exhibition, Artwork } from '@/types';



const Index = () => {
  const [savedArtworks, setSavedArtworks] = useState<Artwork[]>([]);
  const [comparisonArtworks, setComparisonArtworks] = useState<Artwork[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showWorldCup, setShowWorldCup] = useState(false);
  const [showExhibitionGallery, setShowExhibitionGallery] = useState(false);
  const [externalChatMessage, setExternalChatMessage] = useState<string>('');
  const [savedMessagesCount, setSavedMessagesCount] = useState(0);
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const exhibitions = exhibitionsData;
  
  // Memoize the sliced exhibitions to prevent infinite re-renders
  const worldCupExhibitions = useMemo(() => exhibitions.slice(0, UI_CONSTANTS.TOURNAMENT_SIZE), [exhibitions]);

  const handleSaveArtwork = useCallback((artwork: Artwork) => {
    setSavedArtworks(prev => {
      const exists = prev.find(item => item.id === artwork.id);
      if (exists) {
        return prev.filter(item => item.id !== artwork.id);
      }
      return [...prev, artwork];
    });
  }, []);

  const handleCompareArtwork = useCallback((artwork: Artwork) => {
    setComparisonArtworks(prev => {
      const exists = prev.find(item => item.id === artwork.id);
      if (exists) {
        return prev.filter(item => item.id !== artwork.id);
      }
      if (prev.length >= 2) {
        return prev;
      }
      const newComparison = [...prev, artwork];
      if (newComparison.length === 2) {
        setShowComparison(true);
      }
      return newComparison;
    });
  }, []);

  const handleWorldCupClick = useCallback(() => {
    if (exhibitions.length >= UI_CONSTANTS.TOURNAMENT_SIZE) {
      setShowWorldCup(true);
    } else {
      alert(`⚠️ Need ${UI_CONSTANTS.TOURNAMENT_SIZE} exhibitions for tournament. Currently have: ${exhibitions.length}`);
    }
  }, [exhibitions.length]);

  const handleStartExploring = useCallback(() => {
    setShowExhibitionGallery(true);
  }, []);

  const handleSendMessageToChat = useCallback((message: string) => {
    setExternalChatMessage(message);
  }, []);

  const handleChatMessageSent = useCallback(() => {
    setExternalChatMessage('');
  }, []);

  const handleSavedMessagesChange = useCallback((count: number, messages: Message[]) => {
    setSavedMessagesCount(count);
    setSavedMessages(messages);
  }, []);

  const handleSavedMessagesClick = useCallback(() => {
    setShowSavedModal(true);
  }, []);



  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <HeroSection
        onWorldCupClick={handleWorldCupClick}
        onGalleryClick={handleStartExploring}
        onSavedMessagesClick={handleSavedMessagesClick}
        savedMessagesCount={savedMessagesCount}
      />

      {/* Main Content - Chat fills all remaining space */}
      <section className="flex-1 min-h-0">
        <ChatModule 
          onArtworkRecommendation={handleSaveArtwork}
          externalMessage={externalChatMessage}
          onMessageSent={handleChatMessageSent}
          onSavedMessagesChange={handleSavedMessagesChange}
        />
      </section>

      {/* Comparison Modal */}
      {showComparison && comparisonArtworks.length === 2 && (
        <ComparisonView
          artworks={comparisonArtworks}
          onClose={() => {
            setShowComparison(false);
            setComparisonArtworks([]);
          }}
        />
      )}

      {/* Exhibition World Cup Modal */}
      {showWorldCup && (
        <ExhibitionWorldCup
          exhibitions={worldCupExhibitions}
          onClose={() => setShowWorldCup(false)}
          onSendMessage={handleSendMessageToChat}
        />
      )}

      {/* Exhibition Gallery Modal */}
      {showExhibitionGallery && (
        <ExhibitionGallery
          exhibitions={exhibitions}
          onClose={() => setShowExhibitionGallery(false)}
        />
      )}

      <SavedMessagesModal
        isOpen={showSavedModal}
        onClose={() => setShowSavedModal(false)}
        savedMessages={savedMessages}
      />
    </div>
  );
};

export default Index;