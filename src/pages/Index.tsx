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
import { Sparkles, Palette, Eye, Heart, ArrowLeftRight, Trophy } from 'lucide-react';
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
        
        <div className="relative container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
              <h1 className="text-4xl md:text-5xl font-light leading-tight">
                Art Curator AI
              </h1>
              
              {/* Saved Messages Badge */}
              <Badge
                variant="secondary"
                className="text-sm px-3 py-1 flex items-center cursor-pointer ml-4 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setShowSavedModal(true)}
              >
                <Heart className="w-4 h-4 mr-1 fill-current" />
                {savedMessagesCount} Saved
              </Badge>
            </div>
            
            <p className="text-lg text-primary-foreground/80 mb-6 leading-relaxed">
              Your personal guide to art and exhibitions
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="px-8" onClick={handleStartExploring}>
                <Palette className="w-5 h-5 mr-2" />
                전시회 둘러보기
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={handleWorldCupClick}
              >
                <Trophy className="w-5 h-5 mr-2" />
                전시회 월드컵 ({exhibitions.length})
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Main Content */}
      <section className="flex-1 flex flex-col min-h-0">
        <div className="container mx-auto px-4 flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col py-6 min-h-0">
            <ChatModule 
              onArtworkRecommendation={handleSaveArtwork}
              externalMessage={externalChatMessage}
              onMessageSent={handleChatMessageSent}
              onSavedMessagesChange={handleSavedMessagesChange}
            />
          </div>
        </div>
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