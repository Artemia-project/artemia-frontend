import React, { useState } from 'react';
import { ChatModule, type Message } from '@/components/ChatModule';
import { ComparisonView } from '@/components/ComparisonView';
import { ExhibitionWorldCup } from '@/components/ExhibitionWorldCup';
import { ExhibitionGallery } from '@/components/ExhibitionGallery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Sparkles, Frame, Eye, Heart, ArrowLeftRight, Trophy } from 'lucide-react';
import { exhibitionsData, type Exhibition } from '@/data/exhibitions';
import heroArtwork from '@/assets/hero-artwork.jpg';

interface Artwork {
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

  function handleSaveArtwork(artwork: Artwork) {
    setSavedArtworks(prev => {
      const exists = prev.find(item => item.id === artwork.id);
      if (exists) {
        return prev.filter(item => item.id !== artwork.id);
      }
      return [...prev, artwork];
    });
  }

  const handleCompareArtwork = (artwork: Artwork) => {
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
  };

  const handleWorldCupClick = () => {
    console.log('🏆 World Cup button clicked!');
    console.log('📊 Exhibitions ready:', exhibitions.length);
    
    if (exhibitions.length >= 16) {
      alert(`🎉 Tournament ready! ${exhibitions.length} exhibitions loaded.`);
      setShowWorldCup(true);
    } else {
      alert(`⚠️ Need 16 exhibitions for tournament. Currently have: ${exhibitions.length}`);
    }
  };

  const handleStartExploring = () => {
    setShowExhibitionGallery(true);
  };

  const handleSendMessageToChat = (message: string) => {
    setExternalChatMessage(message);
  };

  const handleChatMessageSent = () => {
    setExternalChatMessage('');
  };

  const handleSavedMessagesChange = (count: number, messages: Message[]) => {
    setSavedMessagesCount(count);
    setSavedMessages(messages);
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <div className="absolute inset-0">
          <img
            src={heroArtwork}
            alt="Hero artwork"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        </div>
        
        <div className="relative container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-12">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-4">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary-foreground" />
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-tight">
                Artemia: Art Curator AI
              </h1>
            </div>
            
            <p className="text-sm sm:text-base lg:text-lg text-primary-foreground/80 mb-3 sm:mb-4 lg:mb-6 leading-relaxed">
              전시 추천 주변 관광지 추천 서비스
            </p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
              <Button
                variant="outline"
                size="sm"
                className="px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base flex items-center bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-200"
                onClick={handleWorldCupClick}
              >
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">내 전시 월드컵</span>
                <span className="sm:hidden">월드컵</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base flex items-center bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-200"
                onClick={handleStartExploring}
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
                둘러보기
              </Button>
                          
              <Button
                variant="outline"
                size="sm"
                className="px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base flex items-center bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-200"
                onClick={() => setShowSavedModal(true)}
              >
                <Heart className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 ${savedMessagesCount > 0 ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{savedMessagesCount} 저장된 메세지</span>
                <span className="sm:hidden">{savedMessagesCount} 저장</span>
              </Button>
            </div>
          </div>
        </div>
      </section>


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
          exhibitions={exhibitions.slice(0, 16)}
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

      {/* Saved Messages Modal */}
      <Dialog open={showSavedModal} onOpenChange={setShowSavedModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Saved Messages</DialogTitle>
            <DialogDescription>
              These are the messages you've marked as favorite.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {savedMessages.length > 0 ? (
              savedMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 border rounded-lg bg-accent/5 text-sm"
                >
                  {msg.content}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No saved messages yet.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowSavedModal(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;